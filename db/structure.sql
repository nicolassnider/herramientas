CREATE SCHEMA `herramientas` DEFAULT CHARACTER SET utf8 COLLATE utf8_spanish2_ci ;

CREATE TABLE `herramientas`.`personas` (
  `id` BIGINT(4) UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(15) NULL,
  `apellido` VARCHAR(45) NULL,
  `tipo_documento` BIGINT(4) NOT NULL,
  `documento` VARCHAR(10) NOT NULL,
  `telefono` VARCHAR(10) NOT NULL,
  `calle` VARCHAR(15) NOT NULL,
  `numero` VARCHAR(6) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

