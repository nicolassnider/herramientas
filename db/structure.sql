--1.0.0
--Creación de tablas
CREATE TABLE `herramientas`.`campania` (
  `id` INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id_campania`));

CREATE TABLE `herramientas`.`categoria_producto` (
  `id` INT NOT NULL AUTO_INCREMENT,  
  PRIMARY KEY (`id_categoria_producto`));

CREATE TABLE `herramientas`.`unidad_producto` (
  `id` INT NOT NULL AUTO_INCREMENT,  
  PRIMARY KEY (`id_unidad_producto`));

CREATE TABLE `herramientas`.`cliente` (
  `id` INT NOT NULL AUTO_INCREMENT,  
  PRIMARY KEY (`id_cliente`));

CREATE TABLE `herramientas`.`catalogo` (
  `id` INT NOT NULL AUTO_INCREMENT,  
  PRIMARY KEY (`id_catalogo`));

CREATE TABLE `herramientas`.`producto` (
  `id` INT NOT NULL AUTO_INCREMENT,  
  PRIMARY KEY (`id_producto`));

CREATE TABLE `herramientas`.`pedido_cliente` (
  `id` INT NOT NULL AUTO_INCREMENT,  
  PRIMARY KEY (`id_pedido_cliente`));

CREATE TABLE `herramientas`.`pedido_campania` (
  `id` INT NOT NULL AUTO_INCREMENT,  
  PRIMARY KEY (`id_pedido_campania`));

CREATE TABLE `herramientas`.`remito_producto` (
  `id` INT NOT NULL AUTO_INCREMENT,  
  PRIMARY KEY (`id_remito_producto`));

CREATE TABLE `herramientas`.`producto_catalogo` (
  `id` INT NOT NULL AUTO_INCREMENT,  
  PRIMARY KEY (`id_producto_catalogo`));

CREATE TABLE `herramientas`.`pedido_catalogo` (
  `id` INT NOT NULL AUTO_INCREMENT,  
  PRIMARY KEY (`id_pedido_catalogo`));

CREATE TABLE `herramientas`.`factura` (
  `id` INT NOT NULL AUTO_INCREMENT,  
  PRIMARY KEY (`id_factura`));

CREATE TABLE `herramientas`.`remito` (
  `id` INT NOT NULL AUTO_INCREMENT,  
  PRIMARY KEY (`id_remito`));

CREATE TABLE `herramientas`.`persona` (
  `id` INT NOT NULL AUTO_INCREMENT,  
  PRIMARY KEY (`id_persona`));

CREATE TABLE `herramientas`.`tipo_documento` (
  `id` INT NOT NULL AUTO_INCREMENT,  
  PRIMARY KEY (`id_tipo_documento`));

CREATE TABLE `herramientas`.`revendedora` (
  `id` INT NOT NULL AUTO_INCREMENT,  
  PRIMARY KEY (`id_revendedora`));

CREATE TABLE `herramientas`.`usuario` (
  `id` INT NOT NULL AUTO_INCREMENT,  
  PRIMARY KEY (`id_usuario`));

CREATE TABLE `herramientas`.`categoria_revendedora` (
  `id` INT NOT NULL AUTO_INCREMENT,  
  PRIMARY KEY (`id_categoria_revendedora`));

CREATE TABLE `herramientas`.`pedido_revendedora` (
  `id` INT NOT NULL AUTO_INCREMENT,  
  PRIMARY KEY (`id_pedido_revendedora`));



