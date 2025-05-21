// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');              // thêm cors
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const AdmZip = require('adm-zip');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(cors({                               // cho phép frontend gọi từ http://localhost:5173
  origin: 'http://localhost:5173',
  credentials: true
}));

// MySQL pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,               // ví dụ: 'localhost'
  port: process.env.DB_PORT ? +process.env.DB_PORT : 3306,
  user: process.env.DB_USER,               // ví dụ: 'root'
  password: process.env.DB_PASS,           // ví dụ: '123456'
  database: process.env.DB_NAME,           // ví dụ: 'quizz'
  connectTimeout: 10000
});

// **Thêm đoạn này ngay sau khi tạo pool**
;(async () => {
  try {
    const conn = await pool.getConnection();
    console.log('✅ MySQL connected');
    conn.release();
  } catch (e) {
    console.error('❌ MySQL connect failed:', e);
    process.exit(1);
  }
})();
// Multer for JAR upload
const upload = multer({ dest: 'uploads/' });

// Middleware: verify JWT
function auth(req, res, next) {
  const hdr = req.headers.authorization;
  if (!hdr) return res.status(401).json({ message: 'No token' });
  const token = hdr.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// 2.1 Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const [r] = await pool.query(
      'INSERT INTO users (username, password_hash) VALUES (?,?)',
      [username, hash]
    );
    res.json({ id: r.insertId });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// 2.2 Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE username=?',
      [username]
    );
    if (!rows.length) return res.status(400).json({ message: 'User not found' });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(400).json({ message: 'Wrong password' });

    const token = jwt.sign(
      { id: user.id, username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// 2.3 Create Quiz (title)
app.post('/api/quizzes', auth, async (req, res) => {
  try {
    const { title } = req.body;
    const [r] = await pool.query(
      'INSERT INTO quizzes (user_id, title) VALUES (?,?)',
      [req.user.id, title]
    );
    res.json({ quizId: r.insertId });
  } catch (err) {
    console.error('Create quiz error:', err);
    res.status(500).json({ message: 'Internal error' });
  }
});


// 2.4 Upload JAR và parse questions.json
app.post(
  '/api/quizzes/:quizId/upload',
  auth,
  upload.single('jar'),
  async (req, res) => {
    try {
      const jarPath = req.file.path;
      const zip = new AdmZip(jarPath);
      const entry = zip.getEntry('questions.json');
      if (!entry) {
        fs.unlinkSync(jarPath);
        return res.status(400).json({ message: 'questions.json not found in JAR' });
      }

      const data = JSON.parse(zip.readAsText(entry));
      for (const q of data) {
        const [qr] = await pool.query(
          'INSERT INTO questions (quiz_id, content) VALUES (?,?)',
          [req.params.quizId, q.content]
        );
        for (const a of q.answers) {
          await pool.query(
            'INSERT INTO answers (question_id, content, is_correct) VALUES (?,?,?)',
            [qr.insertId, a.content, a.isCorrect]
          );
        }
      }

      fs.unlinkSync(jarPath);
      res.json({ message: 'Imported successfully' });
    } catch (err) {
      console.error('Upload error:', err);
      res.status(500).json({ message: 'Internal error' });
    }
  }
);

// 2.5 Lấy quiz list của user
app.get('/api/quizzes', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM quizzes WHERE user_id=?',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error('List quizzes error:', err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// 2.6 Lấy question & answers cho quiz
app.get('/api/quizzes/:quizId/questions', auth, async (req, res) => {
  try {
    const [qs] = await pool.query(
      'SELECT * FROM questions WHERE quiz_id=?',
      [req.params.quizId]
    );
    const out = [];
    for (const q of qs) {
      const [as] = await pool.query(
        'SELECT id, content, is_correct FROM answers WHERE question_id=?',
        [q.id]
      );
      out.push({ id: q.id, content: q.content, answers: as });
    }
    res.json(out);
  } catch (err) {
    console.error('Get questions error:', err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// 2.7 Lưu attempt (khi kết thúc quiz)
app.post('/api/quizzes/:quizId/attempts', auth, async (req, res) => {
  try {
    const { score, totalQuestions } = req.body;
    await pool.query(
      'INSERT INTO attempts (user_id, quiz_id, score, total_questions) VALUES (?,?,?,?)',
      [req.user.id, req.params.quizId, score, totalQuestions]
    );
    res.json({ message: 'Saved' });
  } catch (err) {
    console.error('Save attempt error:', err);
    res.status(500).json({ message: 'Internal error' });
  }
});

// 2.8 Lấy lịch sử làm bài
app.get('/api/attempts', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.id, q.title, a.score, a.total_questions, a.created_at
       FROM attempts a
       JOIN quizzes q ON a.quiz_id=q.id
       WHERE a.user_id=?
       ORDER BY a.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error('List attempts error:', err);
    res.status(500).json({ message: 'Internal error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server on ${PORT}`));
