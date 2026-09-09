require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const mysql   = require('mysql2/promise');
const admin   = require('firebase-admin');

const app = express();
app.use(cors());
app.use(express.json());

// ── Firebase Admin SDK (verifies tokens from your frontend) ──
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

// ── MySQL Connection Pool (Railway auto-provides env vars) ───
const pool = mysql.createPool({
  host:            process.env.MYSQLHOST     || 'localhost',
  user:            process.env.MYSQLUSER     || 'root',
  password:        process.env.MYSQLPASSWORD || '',
  database:        process.env.MYSQLDATABASE || 'lasu_navigator',
  port:            process.env.MYSQLPORT     || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ── Auth Middleware (verifies Firebase ID token) ─────────────
const authenticate = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token missing' });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

const verifyAdmin = async (req, res, next) => {
  const [rows] = await pool.execute(
    'SELECT role FROM users WHERE uid = ?', [req.user.uid]
  );
  if (!rows.length || rows[0].role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admins only' });
  }
  next();
};

// ── Health Check ─────────────────────────────────────────────
app.get('/', (req, res) => res.json({ status: 'LASU Navigator API running' }));

// ══════════════════════════════════════════════════════════════
// USER / PROFILE ROUTES
// ══════════════════════════════════════════════════════════════

// Sync profile after Firebase login (upsert)
app.post('/api/users/sync', authenticate, async (req, res) => {
  const { full_name, matric_no, department, level } = req.body;
  const { uid, email } = req.user;
  try {
    await pool.execute(
      `INSERT INTO users (uid, full_name, matric_no, email, department, level)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         full_name  = COALESCE(VALUES(full_name), full_name),
         matric_no  = COALESCE(VALUES(matric_no), matric_no),
         department = COALESCE(VALUES(department), department),
         level      = COALESCE(VALUES(level), level)`,
      [uid, full_name || '', matric_no || null, email,
       department || 'Computer Science', level || '300']
    );
    const [rows] = await pool.execute('SELECT * FROM users WHERE uid = ?', [uid]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get own profile
app.get('/api/users/me', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE uid = ?', [req.user.uid]);
    if (!rows.length) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all students (admin only)
app.get('/api/users', authenticate, verifyAdmin, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT id, uid, full_name, matric_no, email, department, level, created_at FROM users WHERE role = 'STUDENT' ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════════════════════════════
// ANNOUNCEMENTS ROUTES
// ══════════════════════════════════════════════════════════════

// Get all announcements (any authenticated user)
app.get('/api/announcements', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM announcements ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Post announcement (admin only)
app.post('/api/announcements', authenticate, verifyAdmin, async (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) return res.status(400).json({ error: 'Title and body required' });
  try {
    const [result] = await pool.execute(
      'INSERT INTO announcements (title, body, author_uid, author_email) VALUES (?, ?, ?, ?)',
      [title, body, req.user.uid, req.user.email]
    );
    // Create notification for all students
    const [students] = await pool.execute(
      "SELECT uid FROM users WHERE role = 'STUDENT'"
    );
    if (students.length) {
      const values = students.map(s => `('${s.uid}', ${result.insertId})`).join(',');
      await pool.execute(
        `INSERT INTO notifications (user_uid, announcement_id) VALUES ${values}`
      );
    }
    res.status(201).json({ id: result.insertId, title, body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete announcement (admin only)
app.delete('/api/announcements/:id', authenticate, verifyAdmin, async (req, res) => {
  try {
    await pool.execute('DELETE FROM announcements WHERE id = ?', [req.params.id]);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════════════════════════════
// SCHEDULES ROUTES
// ══════════════════════════════════════════════════════════════

// Get all schedules
app.get('/api/schedules', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT * FROM schedules
       ORDER BY FIELD(day_of_week,'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'),
       start_time`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Post schedule (admin only)
app.post('/api/schedules', authenticate, verifyAdmin, async (req, res) => {
  const { course_code, course_name, lecturer_name, day_of_week, start_time, duration_hours, venue } = req.body;
  if (!course_code || !day_of_week || !start_time || !venue) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const [result] = await pool.execute(
      `INSERT INTO schedules (course_code, course_name, lecturer_name, day_of_week, start_time, duration_hours, venue, created_by_uid)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [course_code, course_name || '', lecturer_name || '', day_of_week,
       start_time, duration_hours || 2, venue, req.user.uid]
    );
    res.status(201).json({ id: result.insertId, course_code, course_name, day_of_week, start_time, venue });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete schedule (admin only)
app.delete('/api/schedules/:id', authenticate, verifyAdmin, async (req, res) => {
  try {
    await pool.execute('DELETE FROM schedules WHERE id = ?', [req.params.id]);
    res.json({ message: 'Schedule deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════════════════════════════
// NOTIFICATIONS ROUTES
// ══════════════════════════════════════════════════════════════

// Get notifications for logged-in student
app.get('/api/notifications', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT n.id, n.is_read, n.created_at,
              a.title, a.body, a.author_email
       FROM notifications n
       JOIN announcements a ON n.announcement_id = a.id
       WHERE n.user_uid = ?
       ORDER BY n.created_at DESC`,
      [req.user.uid]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark notification as read
app.patch('/api/notifications/:id/read', authenticate, async (req, res) => {
  try {
    await pool.execute(
      'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_uid = ?',
      [req.params.id, req.user.uid]
    );
    res.json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Count unread notifications
app.get('/api/notifications/unread-count', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT COUNT(*) as count FROM notifications WHERE user_uid = ? AND is_read = 0',
      [req.user.uid]
    );
    res.json({ count: rows[0].count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`LASU Navigator API running on port ${PORT}`));
