//Soo this is part where we handle api from the api/
import { supabase } from './supabase';

async function authHeaders() {
  if (!supabase) return {};
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function req(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(await authHeaders()), ...(options.headers || {}) };
  const res = await fetch(path, { ...options, headers });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || body.detail || `Request failed (${res.status})`);
  return body.data;
}

export const api = {
  topics: () => req('/api/topics'),
  createTopic: (payload) => req('/api/topics', { method: 'POST', body: JSON.stringify(payload) }),
  lessons: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return req(`/api/lessons${q ? `?${q}` : ''}`);
  },
  lesson: (id) => req(`/api/lessons/${id}`),
  generateLesson: (payload) => req('/api/lessons/generate', { method: 'POST', body: JSON.stringify(payload) }),
  submitAttempt: (payload) => req('/api/attempts', { method: 'POST', body: JSON.stringify(payload) }),
  attempt: (id) => req(`/api/attempts/${id}`),
  profile: () => req('/api/profile'),
  updateProfile: (payload) => req('/api/profile', { method: 'PATCH', body: JSON.stringify(payload) }),
};
