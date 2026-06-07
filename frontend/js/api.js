const API_BASE = 'http://localhost:3000';

function getSession() {
  try { return JSON.parse(localStorage.getItem('session')); } catch { return null; }
}

async function apiFetch(path, options = {}) {
  const session = getSession();
  const headers = { 'Content-Type': 'application/json' };
  if (session?.role)  headers['x-role']    = session.role;
  if (session?.id)    headers['x-user-id'] = session.id;
  Object.assign(headers, options.headers || {});

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

const usersApi = {
  getAll:  ()     => apiFetch('/users'),
  getById: (id)   => apiFetch(`/users/${id}`),
  create:  (data) => apiFetch('/users', { method: 'POST', body: JSON.stringify(data) }),
};

const eventsApi = {
  getAll: (params = {}) => {
    const filtered = Object.fromEntries(Object.entries(params).filter(([,v]) => v));
    const qs = new URLSearchParams(filtered).toString();
    return apiFetch(`/events${qs ? '?' + qs : ''}`);
  },
  getById:    (id)   => apiFetch(`/events/${id}`),
  create:     (data) => apiFetch('/events', { method: 'POST', body: JSON.stringify(data) }),
  register:   (id)   => apiFetch(`/events/${id}/register`, { method: 'POST' }),
  unregister: (id)   => apiFetch(`/events/${id}/register`, { method: 'DELETE' }),
};
