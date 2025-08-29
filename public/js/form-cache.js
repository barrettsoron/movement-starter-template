/**
 * Generic Form Cache System for Movement Starter Template
 * 
 * Features:
 * - Configurable cache key and TTL
 * - URL parameter prefilling
 * - Cross-form data sharing
 * - Privacy-respecting (session storage only)
 * - Input validation and sanitization
 */
(function () {
  'use strict';

  // Configuration - can be overridden via data attributes
  const DEFAULT_CONFIG = {
    cacheKey: 'movement_form_cache',
    ttlMs: 60 * 60 * 1000, // 1 hour
    allowedFields: [
      'name', 'first_name', 'last_name',
      'email', 'phone',
      'address_1', 'address_2', 'postal_code',
      'organization', 'referral_id'
    ],
    fieldLimits: {
      name: 120, first_name: 60, last_name: 60,
      email: 320, phone: 32,
      address_1: 120, address_2: 120, postal_code: 16,
      organization: 120, referral_id: 50
    }
  };

  // Get configuration from site config or use defaults
  let config = DEFAULT_CONFIG;
  
  // Override with site configuration if available
  if (window.siteConfig?.forms?.cache) {
    const siteCache = window.siteConfig.forms.cache;
    config = {
      ...config,
      cacheKey: siteCache.storageKey || config.cacheKey,
      ttlMs: siteCache.ttlMs || config.ttlMs
    };
  }

  const forms = Array.from(document.querySelectorAll('form.movement-form'));
  if (!forms.length) return;

  const ALLOWED = new Set(config.allowedFields);
  const LIMITS = config.fieldLimits;

  function sanitizeField(key, val) {
    let v = String(val ?? '').trim();
    const max = LIMITS[key];
    return max ? v.slice(0, max) : v;
  }

  function saveSession(data, ttlMs) {
    try {
      // ensure full replace every time
      sessionStorage.removeItem(config.cacheKey);
      const payload = { data, expires_at: Date.now() + ttlMs };
      sessionStorage.setItem(config.cacheKey, JSON.stringify(payload));
    } catch (e) {
      console.warn('Form cache: Unable to save to sessionStorage', e);
    }
  }

  function readSession() {
    try {
      const raw = sessionStorage.getItem(config.cacheKey);
      if (!raw) return null;
      const { data, expires_at } = JSON.parse(raw);
      if (!expires_at || Date.now() > expires_at) {
        sessionStorage.removeItem(config.cacheKey);
        return null;
      }
      // return only allowed keys (defense-in-depth)
      const safe = {};
      for (const k of Object.keys(data || {})) {
        if (ALLOWED.has(k)) safe[k] = sanitizeField(k, data[k]);
      }
      return safe;
    } catch (e) {
      console.warn('Form cache: Unable to read from sessionStorage', e);
      return null;
    }
  }

  function byNameOrId(form, name) {
    if (!ALLOWED.has(name)) return null;
    return form.querySelector(
      '#' + CSS.escape(name) + ',' +
      '[name="' + name + '"],' +
      '[name="' + name + '[]"]'
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
    
    if (el.tagName === 'TEXTAREA') {
      el.value = String(value);
      return;
    }
    
    if ('value' in el) el.value = String(value);
  }

  function getValue(form, name) {
    if (!ALLOWED.has(name)) return '';
    const el = byNameOrId(form, name);
    if (!el) return '';
    
    if (el.tagName === 'SELECT' && el.multiple) {
      return Array.from(el.selectedOptions).map(opt => opt.value);
    }
    
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
      if (!ALLOWED.has(field)) continue; // ignore non-allowlisted fields

      any = true;
      out[field] = sanitizeField(field, rawVal);
    }
    return { any, values: out };
  }

  // Prefill forms on page load
  (function prefill() {
    const { any, values } = getPrefillParams();

    if (any) {
      forms.forEach(form => {
        // Apply provided values (allowed only)
        Object.keys(values).forEach(field => setValue(form, field, values[field]));

        // Mirror names both ways
        const hasName = values.name && String(values.name).trim();
        const hasFirst = values.first_name && String(values.first_name).trim();
        const hasLast = values.last_name && String(values.last_name).trim();

        if (hasName) {
          const { first_name, last_name } = splitName(values.name);
          if (first_name) setValue(form, 'first_name', sanitizeField('first_name', first_name));
          if (last_name) setValue(form, 'last_name', sanitizeField('last_name', last_name));
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
      let ln = (data.last_name || '').trim();
      let nm = (data.name || '').trim();

      // Handle name mirroring
      if (!fn && !ln && nm) {
        const s = splitName(nm);
        fn = s.first_name; ln = s.last_name;
      }
      if (!nm && (fn || ln)) nm = joinName(fn, ln);

      // Apply cached values to all allowed fields
      for (const field of ALLOWED) {
        let value = data[field];
        
        // Special handling for name fields
        if (field === 'name' && nm) value = nm;
        else if (field === 'first_name' && fn) value = fn;
        else if (field === 'last_name' && ln) value = ln;
        
        if (value) {
          setValue(form, field, sanitizeField(field, value));
        }
      }
    });
  })();

  // Save form data on submission
  forms.forEach(form => {
    form.addEventListener('submit', function() {
      // Don't cache if caching is disabled
      if (!config.cacheKey) return;
      
      const rawName = getValue(form, 'name').trim();
      let first = getValue(form, 'first_name').trim();
      let last = getValue(form, 'last_name').trim();

      // Mirror both ways
      if (!first && !last && rawName) {
        const s = splitName(rawName);
        first = s.first_name; last = s.last_name;
      }
      const joinedName = rawName || joinName(first, last);

      // Build payload with ONLY allowlisted fields
      const payload = {};
      if (joinedName) payload.name = sanitizeField('name', joinedName);
      if (first) payload.first_name = sanitizeField('first_name', first);
      if (last) payload.last_name = sanitizeField('last_name', last);

      // Collect all other allowed fields
      for (const field of ALLOWED) {
        if (['name', 'first_name', 'last_name'].includes(field)) continue;
        
        const value = getValue(form, field);
        if (value && String(value).trim()) {
          if (Array.isArray(value)) {
            payload[field] = value.map(v => sanitizeField(field, v));
          } else {
            payload[field] = sanitizeField(field, value);
          }
        }
      }

      // Full replace of cache on every submission
      try { sessionStorage.removeItem(config.cacheKey); } catch (e) {}
      if (Object.keys(payload).length) {
        saveSession(payload, config.ttlMs);
      }
    });
  });

  // Expose API for programmatic access
  window.FormCache = {
    get: readSession,
    set: saveSession,
    clear: () => sessionStorage.removeItem(config.cacheKey),
    config: config
  };
})();