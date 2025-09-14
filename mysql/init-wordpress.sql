-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: db
-- Tiempo de generación: 16-05-2023 a las 02:14:20
-- Versión del servidor: 8.0.32
-- Versión de PHP: 8.1.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `epayco_shopify`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `epayco`
--
-- Limpiar base de datos si existe
DROP DATABASE IF EXISTS wordpress;
CREATE DATABASE wordpress CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Otorgar permisos completos al usuario root
GRANT ALL PRIVILEGES ON wordpress.* TO 'root'@'%';
FLUSH PRIVILEGES;

CREATE TABLE `epayco` (
                          `p_cust_id` varchar(255) NOT NULL,
                          `public_key` varchar(255) NOT NULL,
                          `p_key` varchar(255) NOT NULL,
                          `tipe_checkout` varchar(45) NOT NULL,
                          `checkout_test` varchar(45) NOT NULL,
                          `language_checkout` varchar(45) NOT NULL,
                          `shop_url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `epayco`
--

INSERT INTO `epayco` (`p_cust_id`, `public_key`, `p_key`, `tipe_checkout`, `checkout_test`, `language_checkout`, `shop_url`) VALUES
    ('19520', 'c84ad754c728bfbn', '122n', 'standartd', 'true', 'es', 'epaycotext.myshopify.com');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `shop`
--

CREATE TABLE `shop` (
                        `id` int NOT NULL,
                        `shop_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                        `access_token` varchar(255) NOT NULL,
                        `hmac` varchar(255) NOT NULL,
                        `install_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `shop`
--

INSERT INTO `shop` (`id`, `shop_url`, `access_token`, `hmac`, `install_date`) VALUES
    (25, 'epaycotext.myshopify.com', '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', 'ae89bfaa8d2461c971ffc5ff7bd79e8f4fa060d9fc997d231977c49fa9623402', '2023-05-15 20:01:39');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `epayco`
--
ALTER TABLE `epayco`
    ADD UNIQUE KEY `epayco_shop` (`shop_url`) USING BTREE;

--
-- Indices de la tabla `shop`
--
ALTER TABLE `shop`
    ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `shop_utl` (`shop_url`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `shop`
--
ALTER TABLE `shop`
    MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `epayco`
--
ALTER TABLE `epayco`
    ADD CONSTRAINT `epayco_shop` FOREIGN KEY (`shop_url`) REFERENCES `shop` (`shop_url`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;