import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './App.css';

const USERS = [
  { id: 'user1', name: 'Usuario 1' },
  { id: 'user2', name: 'Usuario 2' },
  { id: 'user3', name: 'Usuario 3' },
  { id: 'user4', name: 'Usuario 4' }
];

const NOTIFICATION_TYPES = [
  'Nueva tarea asignada',
  'Mensaje recibido',
  'Recordatorio de reunión',
  'Actualización de proyecto'
];

const LatestNotifications = ({ notifications }) => {
  // Obtener solo las últimas 5 notificaciones
  const latestNotifications = notifications.slice(0, 5);

  // Encontrar el nombre del usuario por ID
  const getUserName = (userId) => {
    const user = USERS.find(user => user.id === userId);
    return user ? user.name : userId;
  };

  return (
    <div className="mt-8 bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Últimas Notificaciones</h2>
        <span className="text-sm text-gray-500">Mostrando las últimas 5 notificaciones</span>
      </div>
      <div className="space-y-4">
        {latestNotifications.map((notification, index) => (
          <div
            key={notification.id || index}
            className={`p-4 rounded-lg ${
              notification.read_status
                ? 'bg-gray-50'
                : 'bg-blue-50'
            } transition-all duration-300 ease-in-out`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">
                  Para: {getUserName(notification.user_id)}
                </h3>
                <p className="mt-1">{notification.message}</p>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(notification.created_at).toLocaleString()}
              </span>
            </div>
            <div className="mt-2 text-sm">
              <span className={`px-2 py-1 rounded ${
                notification.read_status
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {notification.read_status ? 'Leída' : 'No leída'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function App() {
  const [connections, setConnections] = useState({});
  const [notifications, setNotifications] = useState({});
  const [openPanels, setOpenPanels] = useState({});
  const [allNotifications, setAllNotifications] = useState([]);

  // Inicializar el estado de notificaciones para cada usuario
  useEffect(() => {
    const initialNotifications = {};
    USERS.forEach(user => {
      initialNotifications[user.id] = [];
    });
    setNotifications(initialNotifications);

    // Obtener notificaciones previas al cargar
    const fetchPreviousNotifications = async () => {
      try {
        const response = await fetch('http://localhost:5000/previous-notifications');
        const data = await response.json();
        
        const notificationsByUser = {};
        USERS.forEach(user => {
          notificationsByUser[user.id] = data.filter(n => n.user_id === user.id);
        });
        
        setNotifications(notificationsByUser);
        setAllNotifications(data); // Inicializar allNotifications con datos previos
      } catch (error) {
        console.error('Error fetching previous notifications:', error);
      }
    };

    fetchPreviousNotifications();
  }, []);

  // Conectar usuario
  const connectUser = (userId) => {
    const socket = io('http://localhost:5000');
    
    socket.on('connect', () => {
      socket.emit('authenticate', userId);
      
      socket.on('pending_notifications', (pendingNotifications) => {
        setNotifications(prev => ({
          ...prev,
          [userId]: [...pendingNotifications]
        }));
        // Actualizar allNotifications con las notificaciones pendientes
        setAllNotifications(prev => [...pendingNotifications, ...prev]);
      });

      socket.on('new_notification', (notification) => {
        setNotifications(prev => ({
          ...prev,
          [userId]: [notification, ...(prev[userId] || [])]
        }));
        // Actualizar allNotifications con la nueva notificación
        setAllNotifications(prev => [notification, ...prev]);
      });
    });

    setConnections(prev => ({
      ...prev,
      [userId]: socket
    }));
  };

  // Desconectar usuario
  const disconnectUser = (userId) => {
    if (connections[userId]) {
      connections[userId].disconnect();
      setConnections(prev => {
        const newConnections = { ...prev };
        delete newConnections[userId];
        return newConnections;
      });
    }
  };

  // Generar notificaciones automáticas
  useEffect(() => {
    const interval = setInterval(() => {
      // Seleccionar un usuario aleatorio
      const connectedUsers = Object.keys(notifications);
      if (connectedUsers.length > 0) {
        const randomUser = connectedUsers[Math.floor(Math.random() * connectedUsers.length)];
        
        const notification = {
          targetUserId: randomUser,
          message: `${NOTIFICATION_TYPES[Math.floor(Math.random() * NOTIFICATION_TYPES.length)]} - ${new Date().toLocaleTimeString()}`,
          type: 'automatic'
        };

        // Enviar notificación incluso si el usuario está desconectado
        fetch('http://localhost:5000/send-notification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(notification),
        });
      }
    }, 7000);

    return () => clearInterval(interval);
  }, [notifications]);

  // Marcar notificación como leída
  const markAsRead = (userId, notificationId) => {
    if (connections[userId]) {
      connections[userId].emit('mark_as_read', notificationId);
      
      // Actualizar el estado de la notificación en notifications
      setNotifications(prev => ({
        ...prev,
        [userId]: prev[userId].map(notif =>
          notif.id === notificationId ? { ...notif, read_status: true } : notif
        )
      }));
      
      // Actualizar el estado de la notificación en allNotifications
      setAllNotifications(prev => 
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, read_status: true } : notif
        )
      );
    }
  };

  const getUserName = (userId) => {
    const user = USERS.find(user => user.id === userId);
    return user ? user.name : userId;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Sistema de Notificaciones en Tiempo Real</h1>
        
        <div className="grid grid-cols-2 gap-6">
          {USERS.map(user => (
            <div key={user.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <div className="flex gap-2">
                  {!connections[user.id] ? (
                    <button
                      onClick={() => connectUser(user.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Conectar
                    </button>
                  ) : (
                    <button
                      onClick={() => disconnectUser(user.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Desconectar
                    </button>
                  )}
                  <button
                    onClick={() => setOpenPanels(prev => ({
                      ...prev,
                      [user.id]: !prev[user.id]
                    }))}
                    className={`relative bg-blue-500 text-white p-2 rounded hover:bg-blue-600 ${
                      !connections[user.id] ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={!connections[user.id]}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    {notifications[user.id]?.filter(n => !n.read_status).length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                        {notifications[user.id].filter(n => !n.read_status).length}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Panel de notificaciones */}
              {openPanels[user.id] && connections[user.id] && (
                <div className="mt-4 bg-gray-50 rounded p-4 max-h-60 overflow-y-auto">
                  <h3 className="font-semibold mb-2">Notificaciones</h3>
                  {notifications[user.id]?.length === 0 ? (
                    <p className="text-gray-500">No hay notificaciones</p>
                  ) : (
                    notifications[user.id]?.map((notification, index) => (
                      <div
                        key={notification.id || index}
                        className={`p-3 mb-2 rounded cursor-pointer ${
                          notification.read_status
                            ? 'bg-white'
                            : 'bg-blue-50 hover:bg-blue-100'
                        }`}
                        onClick={() => markAsRead(user.id, notification.id)}
                      >
                        <p className="font-medium">{notification.message}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}

              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  Estado: {connections[user.id] ? (
                    <span className="text-green-500">Conectado</span>
                  ) : (
                    <span className="text-red-500">Desconectado</span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Componente de últimas notificaciones */}
        <LatestNotifications notifications={allNotifications} />
      </div>
    </div>
  );
}

export default App;