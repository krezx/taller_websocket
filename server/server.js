const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'notificaciones_db'
});

// Crear tabla de notificaciones si no existe
db.query(`
  CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    read_status BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

// Endpoint para obtener notificaciones previas
app.get('/previous-notifications', (req, res) => {
  db.query(
    'SELECT * FROM notifications ORDER BY created_at DESC',
    (err, results) => {
      if (err) {
        console.error('Error al obtener notificaciones:', err);
        res.status(500).json({ error: 'Error al obtener notificaciones' });
        return;
      }
      res.json(results);
    }
  );
});

// Endpoint para enviar notificaciones
app.post('/send-notification', (req, res) => {
  const { targetUserId, message, type } = req.body;
  
  db.query(
    'INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)',
    [targetUserId, message, type],
    (err, result) => {
      if (err) {
        console.error('Error al guardar notificación:', err);
        res.status(500).json({ error: 'Error al guardar notificación' });
        return;
      }

      const notification = {
        id: result.insertId,
        user_id: targetUserId,
        message,
        type,
        read_status: false,
        created_at: new Date()
      };

      // Enviar al usuario si está conectado
      const targetSocketId = userConnections.get(targetUserId);
      if (targetSocketId) {
        io.to(targetSocketId).emit('new_notification', notification);
      }

      res.json(notification);
    }
  );
});

// Mapa para mantener registro de conexiones de usuarios
const userConnections = new Map();

io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  socket.on('authenticate', (userId) => {
    console.log('Usuario autenticado:', userId);
    userConnections.set(userId, socket.id);
    socket.userId = userId;
    
    // Enviar notificaciones pendientes al usuario
    db.query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
      [userId],
      (err, results) => {
        if (!err) {
          socket.emit('pending_notifications', results);
        }
      }
    );
  });

  socket.on('disconnect', () => {
    if (socket.userId) {
      userConnections.delete(socket.userId);
      console.log('Usuario desconectado:', socket.userId);
    }
  });

  socket.on('mark_as_read', (notificationId) => {
    if (!notificationId) return;
    
    db.query(
      'UPDATE notifications SET read_status = true WHERE id = ?',
      [notificationId],
      (err) => {
        if (err) {
          console.error('Error al actualizar notificación:', err);
        }
      }
    );
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});