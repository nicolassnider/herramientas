-- phpMyAdmin SQL Dump
-- version 4.8.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 11-11-2018 a las 05:41:26
-- Versión del servidor: 10.1.33-MariaDB
-- Versión de PHP: 7.2.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT = @@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS = @@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION = @@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `herramientas2`
--
DROP DATABASE IF EXISTS `herramientas2`;
CREATE DATABASE IF NOT EXISTS `herramientas2`
  DEFAULT CHARACTER SET utf8
  COLLATE utf8_spanish2_ci;
USE `herramientas2`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `campania`
--

CREATE TABLE `campania` (
  `id`           int(30) NOT NULL,
  `fecha_inicio` date    NOT NULL,
  `fecha_fin`    date    NOT NULL,
  `descripcion`  varchar(20)      DEFAULT NULL,
  `activo`       bit(1)  NOT NULL DEFAULT b'1'
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `catalogo`
--

CREATE TABLE `catalogo` (
  `id`            int(30)     NOT NULL,
  `descripcion`   varchar(30) NOT NULL,
  `observaciones` text,
  `activo`        bit(1)      NOT NULL DEFAULT b'1'
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `catalogo_campania`
--

CREATE TABLE `catalogo_campania` (
  `id`       int(30) NOT NULL,
  `catalogo` int(30) NOT NULL,
  `campania` int(30) NOT NULL,
  `activo`   bit(1)  NOT NULL DEFAULT b'1'
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria_cliente`
--

CREATE TABLE `categoria_cliente` (
  `id`          int(30)     NOT NULL,
  `descripcion` varchar(30) NOT NULL
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria_producto`
--

CREATE TABLE `categoria_producto` (
  `id`          int(30)     NOT NULL,
  `descripcion` varchar(30) NOT NULL
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria_revendedora`
--

CREATE TABLE `categoria_revendedora` (
  `id`          int(30)                              NOT NULL,
  `descripcion` varchar(30) COLLATE utf8_spanish2_ci NOT NULL
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8
  COLLATE = utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `categoria_revendedora`
--

INSERT INTO categoria_revendedora (id, descripcion)
VALUES (1, 'NO UTILIZAR');
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cliente`
--

CREATE TABLE `cliente` (
  `id`                 int(30)     NOT NULL,
  `categoria_cliente`  int(30)     NOT NULL,
  `direccion_entrega`  varchar(30) NOT NULL,
  `ubicacion`          int(30)              DEFAULT NULL,
  `fecha_alta_cliente` date        NOT NULL,
  `anio_nacimiento`    date                 DEFAULT NULL,
  `madre`              bit(1)               DEFAULT NULL,
  `apodo`              varchar(15)          DEFAULT NULL,
  `persona`            int(30)     NOT NULL,
  `activo`             bit(1)      NOT NULL DEFAULT b'1',
  `revendedora`        int(30)     NOT NULL,
  `fecha_baja_cliente` date                 DEFAULT NULL
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `factura`
--

CREATE TABLE `factura` (
  `id`                int(30)        NOT NULL,
  `total`             decimal(13, 3) NOT NULL,
  `fecha_vencimiento` date           NOT NULL,
  `campania`          int(30)        NOT NULL,
  `pagado`            bit(1)         NOT NULL DEFAULT b'0',
  `nro_factura`       varchar(15)    NOT NULL
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `localidad`
--

CREATE TABLE `localidad` (
  `id`            int(30)     NOT NULL,
  `descripcion`   varchar(30) NOT NULL,
  `provincia`     int(30)     NOT NULL,
  `codigo_postal` varchar(8)  NOT NULL
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

--
-- Volcado de datos para la tabla `localidad`
--

INSERT INTO `localidad` (`id`, `descripcion`, `provincia`, `codigo_postal`)
VALUES (1, 'Pilar', 1, '1629'),
       (2, 'Jose C. Paz', 1, '1665'),
       (3, 'Presidente Derqui', 1, '1635');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pais`
--

CREATE TABLE `pais` (
  `id`          int(30)     NOT NULL,
  `descripcion` varchar(30) NOT NULL
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

--
-- Volcado de datos para la tabla `pais`
--

INSERT INTO `pais` (`id`, `descripcion`)
VALUES (1, 'Argentina'),
       (2, 'Paraguay');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `parametro`
--

CREATE TABLE `parametro` (
  `id`        int(30)      NOT NULL,
  `parametro` varchar(100) NOT NULL,
  `valor`     varchar(100) NOT NULL
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedido_avon`
--

CREATE TABLE `pedido_avon` (
  `id`             int(30) NOT NULL,
  `fecha_recibido` date             DEFAULT NULL,
  `recibido`       bit(1)  NOT NULL DEFAULT b'0',
  `entregado`      bit(1)  NOT NULL DEFAULT b'0',
  `cobrado`        bit(1)  NOT NULL DEFAULT b'0',
  `campania`       int(30) NOT NULL
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedido_producto_catalogo`
--

CREATE TABLE `pedido_producto_catalogo` (
  `id`                int(30) NOT NULL,
  `pedido_avon`       int(30) NOT NULL,
  `producto_catalogo` int(30) NOT NULL,
  `cantidad`          int(30) NOT NULL,
  `recibido`          bit(1)  NOT NULL DEFAULT b'0',
  `cliente`           int(30)          DEFAULT NULL,
  `revendedora`       int(30)          DEFAULT NULL,
  `precio_unitario`   decimal(13, 3)   DEFAULT NULL,
  `precio_total`      decimal(13, 3)   DEFAULT NULL,
  `entregado`         bit(1)  NOT NULL DEFAULT b'0',
  `cobrado`           bit(1)  NOT NULL DEFAULT b'0'
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `perfil`
--

CREATE TABLE `perfil` (
  `id`          int(30)     NOT NULL,
  `descripcion` varchar(30) NOT NULL
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

--
-- Volcado de datos para la tabla `perfil`
--

INSERT INTO `perfil` (`id`, `descripcion`)
VALUES (1, 'ADMINISTRADOR'),
       (2, 'REVENDEDORA');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `perfil_permiso`
--

CREATE TABLE `perfil_permiso` (
  `perfil`  int(30)      NOT NULL,
  `permiso` varchar(100) NOT NULL
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

--
-- Volcado de datos para la tabla `perfil_permiso`
--

INSERT INTO `perfil_permiso` (`perfil`, `permiso`)
VALUES (1, 'CAMPANIA_CREAR'),
       (1, 'CAMPANIA_DESACTIVAR'),
       (1, 'CAMPANIA_LISTAR'),
       (1, 'CAMPANIA_MODIFICAR'),
       (1, 'CAMPANIA_VISUALIZAR'),
       (1, 'CATALOGO_LISTAR'),
       (1, 'CATEGORIA_REVENDEDORA_CREAR'),
       (1, 'CATEGORIA_REVENDEDORA_ELIMINAR'),
       (1, 'CATEGORIA_REVENDEDORA_MODIFICAR'),
       (1, 'PERFILES_CREAR'),
       (1, 'PERFILES_ELIMINAR'),
       (1, 'PERFILES_LISTAR'),
       (1, 'PERFILES_MODIFICAR'),
       (1, 'PERFILES_VISUALIZAR'),
       (1, 'PERFIL_CREAR'),
       (1, 'PERFIL_ELIMINAR'),
       (1, 'PERFIL_LISTAR'),
       (1, 'PERFIL_MODIFICAR'),
       (1, 'PERFIL_VISUALIZAR'),
       (1, 'PERMISOS_LISTAR'),
       (1, 'PERSONA_CREAR'),
       (1, 'PERSONA_ELIMINAR'),
       (1, 'PERSONA_LISTAR'),
       (1, 'PERSONA_MODIFICAR'),
       (1, 'PERSONA_VISUALIZAR'),
       (1, 'REVENDEDORA_CREAR'),
       (1, 'REVENDEDORA_ELIMINAR'),
       (1, 'REVENDEDORA_LISTAR'),
       (1, 'REVENDEDORA_MODIFICAR'),
       (1, 'REVENDEDORA_VISUALIZAR'),
       (1, 'USUARIO_CREAR'),
       (2, 'CAMPANIA_CREAR'),
       (2, 'CAMPANIA_DESACTIVAR'),
       (2, 'CAMPANIA_LISTAR'),
       (2, 'CAMPANIA_MODIFICAR'),
       (2, 'CAMPANIA_VISUALIZAR'),
       (2, 'CATALOGO_LISTAR'),
       (2, 'CATEGORIA_REVENDEDORA_CREAR'),
       (2, 'CATEGORIA_REVENDEDORA_ELIMINAR'),
       (2, 'CATEGORIA_REVENDEDORA_MODIFICAR'),
       (2, 'PERFILES_CREAR'),
       (2, 'PERFILES_ELIMINAR'),
       (2, 'PERFILES_LISTAR'),
       (2, 'PERFILES_MODIFICAR'),
       (2, 'PERFILES_VISUALIZAR'),
       (2, 'PERFIL_CREAR'),
       (2, 'PERFIL_ELIMINAR'),
       (2, 'PERFIL_LISTAR'),
       (2, 'PERFIL_MODIFICAR'),
       (2, 'PERFIL_VISUALIZAR'),
       (2, 'PERMISOS_LISTAR'),
       (2, 'PERSONA_CREAR'),
       (2, 'PERSONA_ELIMINAR'),
       (2, 'PERSONA_LISTAR'),
       (2, 'PERSONA_MODIFICAR'),
       (2, 'PERSONA_VISUALIZAR'),
       (2, 'REVENDEDORA_CREAR'),
       (2, 'REVENDEDORA_ELIMINAR'),
       (2, 'REVENDEDORA_LISTAR'),
       (2, 'REVENDEDORA_MODIFICAR'),
       (2, 'REVENDEDORA_VISUALIZAR'),
       (2, 'USUARIO_CREAR');
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `persona`
--

CREATE TABLE `persona` (
  `id`                 int(30)     NOT NULL,
  `tipo_documento`     int(30)     NOT NULL,
  `documento`          varchar(10) NOT NULL,
  `nombre`             varchar(50) NOT NULL,
  `nombre_segundo`     varchar(50)          DEFAULT NULL,
  `apellido`           varchar(50)          DEFAULT NULL,
  `apellido_segundo`   varchar(50)          DEFAULT NULL,
  `telefono`           varchar(11) NOT NULL,
  `email`              varchar(50) NOT NULL,
  `activo`             bit(1)      NOT NULL DEFAULT b'1',
  `localidad`          int(30)     NOT NULL,
  `fecha_alta_persona` date        NOT NULL,
  `es_usuario`         bit(1)               DEFAULT b'0',
  `fecha_baja_persona` date                 DEFAULT NULL
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

--
-- Volcado de datos para la tabla `persona`
--

INSERT INTO `persona` (`id`,
                       `tipo_documento`,
                       `documento`,
                       `nombre`,
                       `nombre_segundo`,
                       `apellido`,
                       `apellido_segundo`,
                       `telefono`,
                       `email`,
                       `activo`,
                       `localidad`,
                       `fecha_alta_persona`,
                       `es_usuario`,
                       `fecha_baja_persona`)
VALUES (2,
        1,
        '99999999',
        'admin',
        'ad',
        'admin',
        'ad',
        '9999999999',
        'admin@admin.com',
        b'1',
        1,
        '2018-09-01',
        b'1',
        NULL);
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `id`          int(30)     NOT NULL,
  `descripcion` varchar(30) NOT NULL,
  `categoria`   int(30)     NOT NULL,
  `unidad`      int(30)     NOT NULL
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto_catalogo`
--

CREATE TABLE `producto_catalogo` (
  `id`       int(30)        NOT NULL,
  `producto` int(30)        NOT NULL,
  `catalogo` int(30)        NOT NULL,
  `precio`   decimal(13, 3) NOT NULL,
  `activo`   bit(1) DEFAULT b'1'
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `provincia`
--

CREATE TABLE `provincia` (
  `id`          int(30)     NOT NULL,
  `descripcion` varchar(30) NOT NULL,
  `pais`        int(30)     NOT NULL
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

--
-- Volcado de datos para la tabla `provincia`
--

INSERT INTO `provincia` (`id`, `descripcion`, `pais`)
VALUES (1, 'BUENOS AIRES', 1),
       (2, 'CATAMARCA', 1),
       (3, 'CHACO', 1),
       (4, 'CHUBUT', 1),
       (5, 'CORDOBA', 1),
       (6, 'CORRIENTES', 1),
       (7, 'ENTRE RIOS', 1),
       (8, 'FORMOSA', 1),
       (9, 'JUJUY', 1),
       (10, 'LA PAMPA', 1),
       (11, 'LA RIOJA', 1),
       (12, 'MENDOZA', 1),
       (13, 'MISIONES', 1),
       (14, 'NEUQUÉN', 1),
       (15, 'RIO NEGRO', 1),
       (16, 'SALTA', 1),
       (17, 'SAN JUÁN', 1),
       (18, 'SANTA CRUZ', 1),
       (19, 'SANTA FE', 1),
       (20, 'SANTIAGO DEL ESTERO', 1),
       (21, 'TIERRA DEL FUEGO', 1),
       (22, 'TUCUMÁN', 1),
       (23, 'Capital Federal', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `remito`
--

CREATE TABLE `remito` (
  `id`            int(30)     NOT NULL,
  `factura`       int(30)     NOT NULL,
  `numero_remito` varchar(30) NOT NULL
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `remito_producto`
--

CREATE TABLE `remito_producto` (
  `id`              int(30) NOT NULL,
  `remito`          int(30) NOT NULL,
  `producto`        int(30) NOT NULL,
  `cantidad`        int(30) NOT NULL,
  `precio_unitario` decimal(13, 3)   DEFAULT NULL,
  `recibido`        bit(1)  NOT NULL DEFAULT b'0'
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `revendedora`
--

CREATE TABLE `revendedora` (
  `id`                     int(30) NOT NULL,
  `categoria_revendedora`  int(30) NOT NULL,
  `fecha_alta_revendedora` date    NOT NULL,
  `activo`                 bit(1)  NOT NULL DEFAULT b'1',
  `persona`                int(30) NOT NULL,
  `fecha_baja_revendedora` date             DEFAULT NULL
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

--
-- Volcado de datos para la tabla `revendedora`
--

INSERT INTO `revendedora` (`id`,
                           `categoria_revendedora`,
                           `fecha_alta_revendedora`,
                           `activo`,
                           `persona`,
                           `fecha_baja_revendedora`)
VALUES (1, 1, '2018-09-01', b'1', 2, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_documento`
--

CREATE TABLE `tipo_documento` (
  `id`          int(30)     NOT NULL,
  `descripcion` varchar(30) NOT NULL
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

--
-- Volcado de datos para la tabla `tipo_documento`
--

INSERT INTO `tipo_documento` (`id`, `descripcion`)
VALUES (1, 'DU'),
       (2, 'LE'),
       (3, 'PASAPORTE');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ubicacion`
--

CREATE TABLE `ubicacion` (
  `id`        int(30)     NOT NULL,
  `ubicacion` varchar(50) NOT NULL
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `unidad`
--

CREATE TABLE `unidad` (
  `id`          int(30)     NOT NULL,
  `descripcion` varchar(30) NOT NULL
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

--
-- Volcado de datos para la tabla `unidad`
--

INSERT INTO `unidad` (`id`, `descripcion`)
VALUES (1, 'Botella 1000 cc'),
       (6, 'Botella 2 Litros'),
       (4, 'Botella 5 Litros'),
       (3, 'Caja 10 Un.'),
       (2, 'Pote 200Gr');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id`                          int(30)      NOT NULL,
  `revendedora`                 int(30)               DEFAULT NULL,
  `usuario`                     varchar(50)  NOT NULL,
  `clave`                       varchar(100) NOT NULL,
  `clave_activacion_codigo`     varchar(16)           DEFAULT NULL,
  `clave_activacion_expiracion` datetime              DEFAULT NULL,
  `perfil`                      int(30)      NOT NULL,
  `notificaciones_activas`      bit(1)       NOT NULL DEFAULT b'1'
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`,
                       `revendedora`,
                       `usuario`,
                       `clave`,
                       `clave_activacion_codigo`,
                       `clave_activacion_expiracion`,
                       `perfil`,
                       `notificaciones_activas`)
VALUES (1, 1, 'administrador', 'administrador', NULL, NULL, 1, b'1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios_tokens`
--

CREATE TABLE `usuarios_tokens` (
  `token`      varchar(16) NOT NULL,
  `usuario`    int(30)     NOT NULL,
  `expiracion` datetime DEFAULT NULL
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

--
-- Volcado de datos para la tabla `usuarios_tokens`
--

INSERT INTO `usuarios_tokens` (`token`, `usuario`, `expiracion`)
VALUES ('14b222c4f6d5a1d2', 1, '2018-11-11 01:42:13'),
       ('156aba5effae8975', 1, '2018-11-11 02:39:08'),
       ('914749243effd213', 1, '2018-11-11 00:51:42'),
       ('a13de4112f2e50ed', 1, '2018-11-11 00:47:17'),
       ('e776c012c76dc4d5', 1, '2018-11-11 00:52:13');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `campania`
--
ALTER TABLE `campania`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `catalogo`
--
ALTER TABLE `catalogo`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `descripcion_catalogo_unico` (`descripcion`);

--
-- Indices de la tabla `catalogo_campania`
--
ALTER TABLE `catalogo_campania`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_CATALOGO` (`catalogo`),
  ADD KEY `FK_CAMPANIA` (`campania`);

--
-- Indices de la tabla `categoria_cliente`
--
ALTER TABLE `categoria_cliente`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `categoria_producto`
--
ALTER TABLE `categoria_producto`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNICO_CATEGORIA_PRODUCTO_DESCRIPCION` (`descripcion`);

--
-- Indices de la tabla `categoria_revendedora`
--
ALTER TABLE `categoria_revendedora`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cliente_persona_unico` (`persona`),
  ADD KEY `FK_TIPO_CLIENTE` (`categoria_cliente`),
  ADD KEY `FK_UBICACION` (`ubicacion`),
  ADD KEY `FK_REVENDEDORA` (`revendedora`);

--
-- Indices de la tabla `factura`
--
ALTER TABLE `factura`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_FACTURA_CAMPANIA` (`campania`);

--
-- Indices de la tabla `localidad`
--
ALTER TABLE `localidad`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNICO_CODIGO_POSTAL` (`codigo_postal`),
  ADD KEY `FK_PROVINCIA` (`provincia`);

--
-- Indices de la tabla `pais`
--
ALTER TABLE `pais`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `parametro`
--
ALTER TABLE `parametro`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `pedido_avon`
--
ALTER TABLE `pedido_avon`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pedido_avon_campania` (`campania`);

--
-- Indices de la tabla `pedido_producto_catalogo`
--
ALTER TABLE `pedido_producto_catalogo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_PEDIDO_AVON_CAMPANIA` (`pedido_avon`),
  ADD KEY `FK_PRODUCTO_CATALOGO_` (`producto_catalogo`),
  ADD KEY `FK_PEDIDO_PRODUCTO_CATALOGO_CLIENTE` (`cliente`);

--
-- Indices de la tabla `perfil`
--
ALTER TABLE `perfil`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `DESCRIPCION_PERFIL_UNICO` (`descripcion`);

--
-- Indices de la tabla `perfil_permiso`
--
ALTER TABLE `perfil_permiso`
  ADD PRIMARY KEY (`perfil`, `permiso`);

--
-- Indices de la tabla `persona`
--
ALTER TABLE `persona`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `documento_unico` (`tipo_documento`, `documento`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_CATEGORIA_PRODUCTO` (`categoria`),
  ADD KEY `FK_UNIDAD_PRODUCTO` (`unidad`);

--
-- Indices de la tabla `producto_catalogo`
--
ALTER TABLE `producto_catalogo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_PRODUCTO_CATALOGO` (`producto`),
  ADD KEY `FK_CATALOGO_CATALOGO` (`catalogo`);

--
-- Indices de la tabla `provincia`
--
ALTER TABLE `provincia`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_PAIS` (`pais`);

--
-- Indices de la tabla `remito`
--
ALTER TABLE `remito`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `NUMERO_REMITO_UNICO` (`numero_remito`),
  ADD KEY `FK_REMITO_FACTURA` (`factura`);

--
-- Indices de la tabla `remito_producto`
--
ALTER TABLE `remito_producto`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `REMITO_PRODUCTO_UNICO` (`remito`, `producto`),
  ADD KEY `FK_REMITO_PRODUCTO` (`producto`);

--
-- Indices de la tabla `revendedora`
--
ALTER TABLE `revendedora`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `persona_unique` (`persona`),
  ADD KEY `CATEGORIA_REVENDEDORA` (`categoria_revendedora`);

--
-- Indices de la tabla `tipo_documento`
--
ALTER TABLE `tipo_documento`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `ubicacion`
--
ALTER TABLE `ubicacion`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `unidad`
--
ALTER TABLE `unidad`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNICO_UNIDAD_DESCRIPCION` (`descripcion`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `USUARIO_UNICO` (`usuario`),
  ADD UNIQUE KEY `REVENDEDORA_UNICO` (`revendedora`),
  ADD KEY `FK_PERFIL_USUARIO` (`perfil`);

--
-- Indices de la tabla `usuarios_tokens`
--
ALTER TABLE `usuarios_tokens`
  ADD PRIMARY KEY (`token`),
  ADD KEY `usuarios_tokens_expiracion_idx` (`expiracion`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `campania`
--
ALTER TABLE `campania`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 26;

--
-- AUTO_INCREMENT de la tabla `catalogo`
--
ALTER TABLE `catalogo`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 4;

--
-- AUTO_INCREMENT de la tabla `catalogo_campania`
--
ALTER TABLE `catalogo_campania`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 22;

--
-- AUTO_INCREMENT de la tabla `categoria_cliente`
--
ALTER TABLE `categoria_cliente`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 5;

--
-- AUTO_INCREMENT de la tabla `categoria_producto`
--
ALTER TABLE `categoria_producto`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 7;

--
-- AUTO_INCREMENT de la tabla `categoria_revendedora`
--
ALTER TABLE `categoria_revendedora`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 5;

--
-- AUTO_INCREMENT de la tabla `cliente`
--
ALTER TABLE `cliente`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 8;

--
-- AUTO_INCREMENT de la tabla `factura`
--
ALTER TABLE `factura`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 3;

--
-- AUTO_INCREMENT de la tabla `localidad`
--
ALTER TABLE `localidad`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 4;

--
-- AUTO_INCREMENT de la tabla `pais`
--
ALTER TABLE `pais`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 3;

--
-- AUTO_INCREMENT de la tabla `parametro`
--
ALTER TABLE `parametro`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 4;

--
-- AUTO_INCREMENT de la tabla `pedido_avon`
--
ALTER TABLE `pedido_avon`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 3;

--
-- AUTO_INCREMENT de la tabla `pedido_producto_catalogo`
--
ALTER TABLE `pedido_producto_catalogo`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 34;

--
-- AUTO_INCREMENT de la tabla `perfil`
--
ALTER TABLE `perfil`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 3;

--
-- AUTO_INCREMENT de la tabla `persona`
--
ALTER TABLE `persona`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 248;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 16;

--
-- AUTO_INCREMENT de la tabla `producto_catalogo`
--
ALTER TABLE `producto_catalogo`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 17;

--
-- AUTO_INCREMENT de la tabla `provincia`
--
ALTER TABLE `provincia`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 24;

--
-- AUTO_INCREMENT de la tabla `remito`
--
ALTER TABLE `remito`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 2;

--
-- AUTO_INCREMENT de la tabla `remito_producto`
--
ALTER TABLE `remito_producto`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 22;

--
-- AUTO_INCREMENT de la tabla `revendedora`
--
ALTER TABLE `revendedora`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 22;

--
-- AUTO_INCREMENT de la tabla `tipo_documento`
--
ALTER TABLE `tipo_documento`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 4;

--
-- AUTO_INCREMENT de la tabla `ubicacion`
--
ALTER TABLE `ubicacion`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `unidad`
--
ALTER TABLE `unidad`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 7;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 12;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `catalogo_campania`
--
ALTER TABLE `catalogo_campania`
  ADD CONSTRAINT `FK_CAMPANIA` FOREIGN KEY (`campania`) REFERENCES `campania` (`id`),
  ADD CONSTRAINT `FK_CATALOGO` FOREIGN KEY (`catalogo`) REFERENCES `catalogo` (`id`);

--
-- Filtros para la tabla `cliente`
--
ALTER TABLE `cliente`
  ADD CONSTRAINT `FK_REVENDEDORA` FOREIGN KEY (`revendedora`) REFERENCES `revendedora` (`id`),
  ADD CONSTRAINT `FK_TIPO_CLIENTE` FOREIGN KEY (`categoria_cliente`) REFERENCES `categoria_cliente` (`id`),
  ADD CONSTRAINT `FK_UBICACION` FOREIGN KEY (`ubicacion`) REFERENCES `ubicacion` (`id`);

--
-- Filtros para la tabla `factura`
--
ALTER TABLE `factura`
  ADD CONSTRAINT `FK_FACTURA_CAMPANIA` FOREIGN KEY (`campania`) REFERENCES `campania` (`id`);

--
-- Filtros para la tabla `localidad`
--
ALTER TABLE `localidad`
  ADD CONSTRAINT `FK_PROVINCIA` FOREIGN KEY (`provincia`) REFERENCES `provincia` (`id`);

--
-- Filtros para la tabla `pedido_avon`
--
ALTER TABLE `pedido_avon`
  ADD CONSTRAINT `pedido_avon_campania` FOREIGN KEY (`campania`) REFERENCES `campania` (`id`);

--
-- Filtros para la tabla `pedido_producto_catalogo`
--
ALTER TABLE `pedido_producto_catalogo`
  ADD CONSTRAINT `FK_PEDIDO_AVON_CAMPANIA` FOREIGN KEY (`pedido_avon`) REFERENCES `pedido_avon` (`id`),
  ADD CONSTRAINT `FK_PEDIDO_PRODUCTO_CATALOGO_CLIENTE` FOREIGN KEY (`cliente`) REFERENCES `cliente` (`id`),
  ADD CONSTRAINT `FK_PRODUCTO_CATALOGO_` FOREIGN KEY (`producto_catalogo`) REFERENCES `producto_catalogo` (`id`);

--
-- Filtros para la tabla `perfil_permiso`
--
ALTER TABLE `perfil_permiso`
  ADD CONSTRAINT `FK_PERFIL_PERMISO` FOREIGN KEY (`perfil`) REFERENCES `perfil` (`id`);

--
-- Filtros para la tabla `persona`
--
ALTER TABLE `persona`
  ADD CONSTRAINT `FK_TIPO_DOCUMENTO` FOREIGN KEY (`tipo_documento`) REFERENCES `tipo_documento` (`id`);

--
-- Filtros para la tabla `producto`
--
ALTER TABLE `producto`
  ADD CONSTRAINT `FK_CATEGORIA_PRODUCTO` FOREIGN KEY (`categoria`) REFERENCES `categoria_producto` (`id`),
  ADD CONSTRAINT `FK_UNIDAD_PRODUCTO` FOREIGN KEY (`unidad`) REFERENCES `unidad` (`id`);

--
-- Filtros para la tabla `producto_catalogo`
--
ALTER TABLE `producto_catalogo`
  ADD CONSTRAINT `FK_CATALOGO_CATALOGO` FOREIGN KEY (`catalogo`) REFERENCES `catalogo` (`id`),
  ADD CONSTRAINT `FK_PRODUCTO_CATALOGO` FOREIGN KEY (`producto`) REFERENCES `producto` (`id`);

--
-- Filtros para la tabla `provincia`
--
ALTER TABLE `provincia`
  ADD CONSTRAINT `FK_PAIS` FOREIGN KEY (`pais`) REFERENCES `pais` (`id`);

--
-- Filtros para la tabla `remito`
--
ALTER TABLE `remito`
  ADD CONSTRAINT `FK_REMITO_FACTURA` FOREIGN KEY (`factura`) REFERENCES `factura` (`id`);

--
-- Filtros para la tabla `remito_producto`
--
ALTER TABLE `remito_producto`
  ADD CONSTRAINT `FK_REMITO_PRODUCTO` FOREIGN KEY (`producto`) REFERENCES `producto` (`id`);

--
-- Filtros para la tabla `revendedora`
--
ALTER TABLE `revendedora`
  ADD CONSTRAINT `CATEGORIA_REVENDEDORA` FOREIGN KEY (`categoria_revendedora`) REFERENCES `categoria_revendedora` (`id`),
  ADD CONSTRAINT `PERSONA_REVENDEDORA` FOREIGN KEY (`persona`) REFERENCES `persona` (`id`);

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `FK_PERFIL_USUARIO` FOREIGN KEY (`perfil`) REFERENCES `perfil` (`id`),
  ADD CONSTRAINT `FK_USUARIO_REVENDEDORA` FOREIGN KEY (`revendedora`) REFERENCES `revendedora` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT = @OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS = @OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION = @OLD_COLLATION_CONNECTION */;
