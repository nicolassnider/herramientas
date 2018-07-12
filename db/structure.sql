#1.0.0
#Creación esquema
CREATE SCHEMA `herramientas` DEFAULT CHARACTER SET utf8 COLLATE utf8_spanish2_ci;

#Creación de tablas

CREATE TABLE `herramientas`.`campania` (
    `id_campania` INT NOT NULL AUTO_INCREMENT,
    `fecha_inicio` DATE NOT NULL,
    `fecha_fin` DATE NOT NULL,
    `numero_campania` VARCHAR (20) NULL,
    `activo` BIT(1) NULL,
    PRIMARY KEY (`id_campania`));

CREATE TABLE `herramientas`.`categoria_producto` (
    `id_categoria_producto` INT NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(30) NOT NULL,
    PRIMARY KEY (`id_categoria_producto`));

CREATE TABLE `herramientas`.`unidad_producto` (
    `id_unidad_producto` INT NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(30) NOT NULL,
  PRIMARY KEY (`id_unidad_producto`));

CREATE TABLE `herramientas`.`cliente` (
    `id_cliente` INT NOT NULL AUTO_INCREMENT,
    `direccion_entrega` VARCHAR(30) NOT NULL,
    `ubicacion` INT NULL,
    `fecha_alta` DATE NOT NULL,
    `anio_nacimiento` DATE NOT NULL,
    `es_madre` BIT(1) NULL,
    `persona` INT NOT NULL,
    `activo` BIT(1) NULL,
  PRIMARY KEY (`id_cliente`));
  
CREATE TABLE `herramientas`.`ubicacion` (
    `id_ubicacion` INT NOT NULL AUTO_INCREMENT,
    `ubicacion` VARCHAR(30) NOT NULL,
    PRIMARY KEY (`id_ubicacion`));

CREATE TABLE `herramientas`.`catalogo` (
    `id_catalogo` INT NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(30) NOT NULL,
    `observaciones` TINYTEXT NULL,
    `activo` BIT(1) NULL,
    PRIMARY KEY (`id_catalogo`));
  
CREATE TABLE `herramientas`.`catalogo_campania` (
    `id_catalogo_campania` INT NOT NULL AUTO_INCREMENT,
    `catalogo` INT NOT NULL,
    `campania` INT NOT NULL,
    `activo` BIT(1) NULL,
    PRIMARY KEY (`id_catalogo`));

CREATE TABLE `herramientas`.`producto` (
    `id_producto` INT NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(30) NOT NULL,
    `categoria_producto` INT NOT NULL,
    `unidad` INT NOT NULL,
  PRIMARY KEY (`id_producto`));

CREATE TABLE `herramientas`.`pedido_cliente` (
    `id_pedido_cliente` INT NOT NULL AUTO_INCREMENT,
    `fecha_alta` DATE NOT NULL,
    `entregado` BIT(1) NOT NULL,
    `cobrado` BIT(1) NOT NULL,
    PRIMARY KEY (`id_pedido_cliente`));

CREATE TABLE `herramientas`.`pedido_cliente_producto_catalogo`

CREATE TABLE `herramientas`.`pedido_campania` (
    `id_pedido_campania` INT NOT NULL AUTO_INCREMENT,
    `numero_pedido` INT NOT NULL,
    `campania` INT NOT NULL,
    `fecha_alta` DATE NOT NULL,
    `fecha_cierre` DATE NOT NULL,
    `activo` BIT(1) NULL,
    PRIMARY KEY (`id_pedido_campania`));

CREATE TABLE `herramientas`.`pedido_campania_producto`(

	)
CREATE TABLE `herramientas`.`remito_producto` (
    `id_remito_producto` INT NOT NULL AUTO_INCREMENT,


    PRIMARY KEY (`id_remito_producto`));

CREATE TABLE `herramientas`.`producto_catalogo` (
    `id_producto_catalogo` INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (`id_producto_catalogo`));

CREATE TABLE `herramientas`.`pedido_catalogo` (
    `id_pedido_catalogo` INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (`id_pedido_catalogo`));

CREATE TABLE `herramientas`.`factura` (
    `id_factura` INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (`id_factura`));

CREATE TABLE `herramientas`.`remito` (
    `id` INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (`id_remito`));

CREATE TABLE `herramientas`.`persona` (
    `id_persona` INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (`id_persona`));

CREATE TABLE `herramientas`.`tipo_documento` (
    `id_tipo_documento` INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (`id_tipo_documento`));

CREATE TABLE `herramientas`.`revendedora` (
  `id_revendedora` INT NOT NULL AUTO_INCREMENT,  
  PRIMARY KEY (`id_revendedora`));

CREATE TABLE `herramientas`.`usuario` (
  `id_usuario` INT NOT NULL AUTO_INCREMENT,  
  PRIMARY KEY (`id_usuario`));

CREATE TABLE `herramientas`.`categoria_revendedora` (
  `id_categoria_revendedora` INT NOT NULL AUTO_INCREMENT,  
  PRIMARY KEY (`id_categoria_revendedora`));

CREATE TABLE `herramientas`.`pedido_revendedora` (
  `id_pedido_revendedora` INT NOT NULL AUTO_INCREMENT,  
  PRIMARY KEY (`id_pedido_revendedora`));



