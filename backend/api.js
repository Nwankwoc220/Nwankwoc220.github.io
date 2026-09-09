// ============================================================
// LASU NAVIGATOR — Frontend API Client
// paste this file as api.js in your project root
// import it in index.html and admin.html
// ============================================================

const API_BASE = 'https://YOUR-RAILWAY-APP.railway.app'; // 👈 replace after deploying

// ── Get Firebase ID token for API calls ─────────────────────
async function getToken() {
  const { getAuth } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js');
  const user = getAuth().currentUser;
  if (!user) throw new Error('Not logged in');
  return user.getIdToken();
}

async function apiFetch(path, options = {}) {
  const token = await getToken();
  const res = await fetch(API_BASE + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
      ...(options.headers || {})
    }
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'API error');
  }
  return res.json();
}

// ── User / Profile ───────────────────────────────────────────
export async function syncProfile(profileData) {
  return apiFetch('/api/users/sync', {
    method: 'POST',
    body: JSON.stringify(profileData)
  });
}

export async function getMyProfile() {
  return apiFetch('/api/users/me');
}

export async function getAllStudents() {
  return apiFetch('/api/users');
}

// ── Announcements ────────────────────────────────────────────
export async function getAnnouncements() {
  return apiFetch('/api/announcements');
}

export async function postAnnouncement(title, body) {
  return apiFetch('/api/announcements', {
    method: 'POST',
    body: JSON.stringify({ title, body })
  });
}

export async function deleteAnnouncement(id) {
  return apiFetch('/api/announcements/' + id, { method: 'DELETE' });
}

// ── Schedules ────────────────────────────────────────────────
export async function getSchedules() {
  return apiFetch('/api/schedules');
}

export async function postSchedule(data) {
  return apiFetch('/api/schedules', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function deleteSchedule(id) {
  return apiFetch('/api/schedules/' + id, { method: 'DELETE' });
}

// ── Notifications ────────────────────────────────────────────
export async function getNotifications() {
  return apiFetch('/api/notifications');
}

export async function getUnreadCount() {
  return apiFetch('/api/notifications/unread-count');
}

export async function markNotificationRead(id) {
  return apiFetch('/api/notifications/' + id + '/read', { method: 'PATCH' });
}
