(function () {
  'use strict';

  const forms = Array.from(document.querySelectorAll('form.prefillable-form'));
  if (!forms.length) return;

  // Configuration - read from first form's data attributes with fallbacks
  const firstForm = forms[0];
  const KEY = firstForm?.dataset.cacheKey || 'ndp_form_cache';
  const HOUR_MS = 60 * 60 * 1000;
  const TTL_MS = parseInt(firstForm?.dataset.cacheTtl) || HOUR_MS;

  // Allowlist + simple length limits to avoid stuffing
  const ALLOWED = new Set([
    'name', 'first_name', 'last_name',
    'email', 'phone',
    'address_1', 'address_2', 'postal', 'postal_code', 'referral_id'
  ]);
  const LIMITS = {
    name: 120, first_name: 60, last_name: 60,
    email: 320, phone: 32,
    address_1: 120, address_2: 120, postal: 16, postal_code: 16
  };
  function sanitizeField(key, val) {
    let v = String(val ?? '').trim();
    const max = LIMITS[key];
    return max ? v.slice(0, max) : v;
  }

  function saveSession(data, ttlMs) {
    try {
      // ensure full replace every time
      sessionStorage.removeItem(KEY);
      const payload = { data, expires_at: Date.now() + ttlMs };
      sessionStorage.setItem(KEY, JSON.stringify(payload));
    } catch {}
  }

  function readSession() {
    try {
      const raw = sessionStorage.getItem(KEY);
      if (!raw) return null;
      const { data, expires_at } = JSON.parse(raw);
      if (!expires_at || Date.now() > expires_at) {
        sessionStorage.removeItem(KEY);
        return null;
      }
      // return only allowed keys (defense-in-depth)
      const safe = {};
      for (const k of Object.keys(data || {})) {
        if (ALLOWED.has(k)) safe[k] = sanitizeField(k, data[k]);
      }
      return safe;
    } catch { return null; }
  }

  function byNameOrId(form, name) {
    if (!ALLOWED.has(name)) return null;
    return form.querySelector(
      '#' + CSS.escape(name) + ','
      + '[name="' + name + '"],'
      + '[name="' + name + '[]"]'
    );
  }

  function setValue(form, name, value) {
    if (!ALLOWED.has(name)) return;
    const el = byNameOrId(form, name);
    if (!el) return;

    if (el.tagName === 'SELECT') {
      if (el.multiple) {
        const wanted = new Set(
          Array.isArray(value) ? value.map(s => String(s).trim().toLowerCase())
                               : String(value).split(',').map(s => s.trim().toLowerCase())
        );
        Array.from(el.options).forEach(opt => {
          const v = String(opt.value || opt.text).trim().toLowerCase();
          opt.selected = wanted.has(v);
        });
      } else {
        el.value = String(value);
      }
      return;
    }
    if ('value' in el) el.value = String(value);
  }

  function getValue(form, name) {
    if (!ALLOWED.has(name)) return '';
    const el = byNameOrId(form, name);
    return el && typeof el.value === 'string' ? el.value : '';
  }

  function splitName(full) {
    const s = String(full || '').trim().replace(/\s+/g, ' ');
    if (!s) return { first_name: '', last_name: '' };
    const parts = s.split(' ');
    if (parts.length === 1) return { first_name: parts[0], last_name: '' };
    const last_name = parts.pop();
    const first_name = parts.join(' ');
    return { first_name, last_name };
  }

  function joinName(first, last) {
    return String([first || '', last || ''].join(' ').trim()).replace(/\s+/g, ' ');
  }

  function getPrefillParams() {
    const params = new URLSearchParams(location.search);
    const out = {};
    let any = false;

    for (const [rawKey, rawVal] of params.entries()) {
      const lower = rawKey.toLowerCase();
      if (!lower.startsWith('prefill_')) continue;

      const field = lower.slice('prefill_'.length); // e.g. "name", "first_name", etc.
      if (!ALLOWED.has(field)) continue; // ignore non-whitelisted fields

      any = true;
      out[field] = sanitizeField(field, rawVal);
    }
    return { any, values: out };
  }

  (function prefill() {
    const { any, values } = getPrefillParams();

    if (any) {
      forms.forEach(form => {
        // Apply provided values (allowed only)
        Object.keys(values).forEach(field => setValue(form, field, values[field]));

        // Mirror names both ways
        const hasName  = values.name && String(values.name).trim();
        const hasFirst = values.first_name && String(values.first_name).trim();
        const hasLast  = values.last_name && String(values.last_name).trim();

        if (hasName) {
          const { first_name, last_name } = splitName(values.name);
          if (first_name) setValue(form, 'first_name', sanitizeField('first_name', first_name));
          if (last_name)  setValue(form, 'last_name',  sanitizeField('last_name',  last_name));
        } else if (hasFirst || hasLast) {
          const nm = joinName(values.first_name || '', values.last_name || '');
          if (nm) setValue(form, 'name', sanitizeField('name', nm));
        }
      });
      // When prefill params exist, we intentionally do NOT read session data
      return;
    }

    const data = readSession();
    if (!data) return;

    forms.forEach(form => {
      let fn = (data.first_name || '').trim();
      let ln = (data.last_name  || '').trim();
      let nm = (data.name       || '').trim();

      if (!fn && !ln && nm) {
        const s = splitName(nm);
        fn = s.first_name; ln = s.last_name;
      }
      if (!nm && (fn || ln)) nm = joinName(fn, ln);

      if (nm) setValue(form, 'name', sanitizeField('name', nm));
      if (fn) setValue(form, 'first_name', sanitizeField('first_name', fn));
      if (ln) setValue(form, 'last_name',  sanitizeField('last_name',  ln));

      if (data.email)     setValue(form, 'email',     sanitizeField('email',     data.email));
      if (data.phone)     setValue(form, 'phone',     sanitizeField('phone',     data.phone));
      if (data.address_1) setValue(form, 'address_1', sanitizeField('address_1', data.address_1));
      if (data.address_2) setValue(form, 'address_2', sanitizeField('address_2', data.address_2));
      
      // Handle both 'postal' and 'postal_code' field names
      const postalValue = data.postal || data.postal_code;
      if (postalValue) {
        setValue(form, 'postal', sanitizeField('postal', postalValue));
        setValue(form, 'postal_code', sanitizeField('postal_code', postalValue));
      }
    });
  })();

  forms.forEach(form => {
    form.addEventListener('submit', () => {
      const rawName = getValue(form, 'name').trim();
      let first = getValue(form, 'first_name').trim();
      let last  = getValue(form, 'last_name').trim();

      // Mirror both ways
      if (!first && !last && rawName) {
        const s = splitName(rawName);
        first = s.first_name; last = s.last_name;
      }
      const joinedName = rawName || joinName(first, last);

      // Build payload with ONLY whitelisted fields
      const payload = {};
      if (joinedName) payload.name = sanitizeField('name', joinedName);
      if (first)      payload.first_name = sanitizeField('first_name', first);
      if (last)       payload.last_name  = sanitizeField('last_name',  last);

      const email = getValue(form, 'email').trim();
      const phone = getValue(form, 'phone').trim();
      const addr1 = getValue(form, 'address_1').trim();
      const addr2 = getValue(form, 'address_2').trim();
      const postal = getValue(form, 'postal').trim() || getValue(form, 'postal_code').trim();

      if (email)  payload.email     = sanitizeField('email', email);
      if (phone)  payload.phone     = sanitizeField('phone', phone);
      if (addr1)  payload.address_1 = sanitizeField('address_1', addr1);
      if (addr2)  payload.address_2 = sanitizeField('address_2', addr2);
      if (postal) {
        payload.postal = sanitizeField('postal', postal);
        payload.postal_code = sanitizeField('postal_code', postal);
      }

      // Full replace of cache on every submission
      try { sessionStorage.removeItem(KEY); } catch {}
      if (Object.keys(payload).length) saveSession(payload, TTL_MS);
    });
  });
})();