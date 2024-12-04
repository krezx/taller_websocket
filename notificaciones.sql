-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 05-12-2024 a las 00:21:33
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `notificaciones_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `type` varchar(50) NOT NULL,
  `read_status` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `message`, `type`, `read_status`, `created_at`) VALUES
(1, 'user1', 'Actualización de proyecto - 20:16:24', 'automatic', 1, '2024-12-04 23:16:24'),
(2, 'user1', 'Notificación global para 4 usuarios - 20:16:36', 'global', 1, '2024-12-04 23:16:36'),
(3, 'user2', 'Notificación global para 4 usuarios - 20:16:36', 'global', 1, '2024-12-04 23:16:36'),
(4, 'user3', 'Notificación global para 4 usuarios - 20:16:36', 'global', 1, '2024-12-04 23:16:36'),
(5, 'user4', 'Notificación global para 4 usuarios - 20:16:36', 'global', 1, '2024-12-04 23:16:36'),
(6, 'user3', 'Nueva tarea asignada - 20:16:43', 'automatic', 1, '2024-12-04 23:16:43'),
(7, 'user1', 'Notificación global para 4 usuarios - 20:16:50', 'global', 1, '2024-12-04 23:16:50'),
(8, 'user2', 'Notificación global para 4 usuarios - 20:16:50', 'global', 1, '2024-12-04 23:16:50'),
(9, 'user3', 'Notificación global para 4 usuarios - 20:16:50', 'global', 1, '2024-12-04 23:16:50'),
(10, 'user4', 'Notificación global para 4 usuarios - 20:16:50', 'global', 1, '2024-12-04 23:16:50'),
(11, 'user1', 'Notificación global para 4 usuarios - 20:16:57', 'global', 1, '2024-12-04 23:16:57'),
(12, 'user2', 'Notificación global para 4 usuarios - 20:16:57', 'global', 1, '2024-12-04 23:16:57'),
(13, 'user3', 'Notificación global para 4 usuarios - 20:16:57', 'global', 1, '2024-12-04 23:16:57'),
(14, 'user4', 'Notificación global para 4 usuarios - 20:16:57', 'global', 1, '2024-12-04 23:16:57'),
(15, 'user2', 'Mensaje recibido - 20:17:09', 'automatic', 1, '2024-12-04 23:17:09'),
(16, 'user2', 'Recordatorio de reunión - 20:17:16', 'automatic', 1, '2024-12-04 23:17:16'),
(17, 'user1', 'Notificación global para 4 usuarios - 20:17:37', 'global', 1, '2024-12-04 23:17:37'),
(18, 'user2', 'Notificación global para 4 usuarios - 20:17:37', 'global', 1, '2024-12-04 23:17:37'),
(19, 'user3', 'Notificación global para 4 usuarios - 20:17:37', 'global', 1, '2024-12-04 23:17:37'),
(20, 'user4', 'Notificación global para 4 usuarios - 20:17:37', 'global', 1, '2024-12-04 23:17:37'),
(21, 'user2', 'Recordatorio de reunión - 20:17:51', 'automatic', 1, '2024-12-04 23:17:51'),
(22, 'user2', 'Mensaje recibido - 20:18:03', 'automatic', 1, '2024-12-04 23:18:03'),
(23, 'user1', 'Notificación global para 4 usuarios - 20:18:12', 'global', 1, '2024-12-04 23:18:12'),
(24, 'user2', 'Notificación global para 4 usuarios - 20:18:12', 'global', 1, '2024-12-04 23:18:12'),
(25, 'user3', 'Notificación global para 4 usuarios - 20:18:12', 'global', 1, '2024-12-04 23:18:12'),
(26, 'user4', 'Notificación global para 4 usuarios - 20:18:12', 'global', 1, '2024-12-04 23:18:12'),
(27, 'user2', 'Nueva tarea asignada - 20:18:33', 'automatic', 1, '2024-12-04 23:18:33'),
(28, 'user4', 'Nueva tarea asignada - 20:18:40', 'automatic', 1, '2024-12-04 23:18:40'),
(29, 'user3', 'Mensaje recibido - 20:18:48', 'automatic', 1, '2024-12-04 23:18:48'),
(30, 'user1', 'Notificación global para 4 usuarios - 20:19:01', 'global', 1, '2024-12-04 23:19:01'),
(31, 'user2', 'Notificación global para 4 usuarios - 20:19:01', 'global', 1, '2024-12-04 23:19:01'),
(32, 'user3', 'Notificación global para 4 usuarios - 20:19:01', 'global', 1, '2024-12-04 23:19:01'),
(33, 'user4', 'Notificación global para 4 usuarios - 20:19:01', 'global', 1, '2024-12-04 23:19:01'),
(34, 'user2', 'Nueva tarea asignada - 20:19:12', 'automatic', 1, '2024-12-04 23:19:12'),
(35, 'user4', 'Actualización de proyecto - 20:19:20', 'automatic', 0, '2024-12-04 23:19:20'),
(36, 'user1', 'Recordatorio de reunión - 20:19:27', 'automatic', 0, '2024-12-04 23:19:27');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
