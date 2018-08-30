CREATE DATABASE  IF NOT EXISTS `herramientas` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_spanish2_ci */;
USE `herramientas`;
-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: localhost    Database: herramientas
-- ------------------------------------------------------
-- Server version	5.5.5-10.1.33-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `campania`
--

DROP TABLE IF EXISTS `campania`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `campania` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `descripcion` varchar(20) DEFAULT NULL,
  `activo` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campania`
--

LOCK TABLES `campania` WRITE;
/*!40000 ALTER TABLE `campania` DISABLE KEYS */;
/*!40000 ALTER TABLE `campania` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `catalogo`
--

DROP TABLE IF EXISTS `catalogo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `catalogo` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(30) NOT NULL,
  `observaciones` text,
  `activo` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catalogo`
--

LOCK TABLES `catalogo` WRITE;
/*!40000 ALTER TABLE `catalogo` DISABLE KEYS */;
/*!40000 ALTER TABLE `catalogo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `catalogo_campania`
--

DROP TABLE IF EXISTS `catalogo_campania`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `catalogo_campania` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `catalogo` int(30) NOT NULL,
  `campania` int(30) NOT NULL,
  `activo` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`id`),
  KEY `FK_CATALOGO` (`catalogo`),
  KEY `FK_CAMPANIA` (`campania`),
  CONSTRAINT `FK_CAMPANIA` FOREIGN KEY (`campania`) REFERENCES `campania` (`id`),
  CONSTRAINT `FK_CATALOGO` FOREIGN KEY (`catalogo`) REFERENCES `catalogo` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catalogo_campania`
--

LOCK TABLES `catalogo_campania` WRITE;
/*!40000 ALTER TABLE `catalogo_campania` DISABLE KEYS */;
/*!40000 ALTER TABLE `catalogo_campania` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categoria_cliente`
--

DROP TABLE IF EXISTS `categoria_cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categoria_cliente` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria_cliente`
--

LOCK TABLES `categoria_cliente` WRITE;
/*!40000 ALTER TABLE `categoria_cliente` DISABLE KEYS */;
/*!40000 ALTER TABLE `categoria_cliente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categoria_producto`
--

DROP TABLE IF EXISTS `categoria_producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categoria_producto` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria_producto`
--

LOCK TABLES `categoria_producto` WRITE;
/*!40000 ALTER TABLE `categoria_producto` DISABLE KEYS */;
/*!40000 ALTER TABLE `categoria_producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categoria_revendedora`
--

DROP TABLE IF EXISTS `categoria_revendedora`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categoria_revendedora` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(30) COLLATE utf8_spanish2_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria_revendedora`
--

LOCK TABLES `categoria_revendedora` WRITE;
/*!40000 ALTER TABLE `categoria_revendedora` DISABLE KEYS */;
INSERT INTO `categoria_revendedora` VALUES (1,'CATEGORIA_TEST01'),(2,'CATEGORIA_TEST02'),(3,'CATEGORIA_TEST03'),(4,'CATEGORIA_TEST04');
/*!40000 ALTER TABLE `categoria_revendedora` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cliente`
--

DROP TABLE IF EXISTS `cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cliente` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `categoria_cliente` int(30) NOT NULL,
  `direccion_entrega` varchar(30) NOT NULL,
  `ubicacion` int(30) DEFAULT NULL,
  `fecha_alta_cliente` date NOT NULL,
  `anio_nacimiento` date DEFAULT NULL,
  `madre` bit(1) DEFAULT NULL,
  `apodo` varchar(15) DEFAULT NULL,
  `persona` int(30) NOT NULL,
  `activo` bit(1) NOT NULL DEFAULT b'1',
  `revendedora` int(30) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_TIPO_CLIENTE` (`categoria_cliente`),
  KEY `FK_UBICACION` (`ubicacion`),
  KEY `FK_REVENDEDORA` (`revendedora`),
  CONSTRAINT `FK_REVENDEDORA` FOREIGN KEY (`revendedora`) REFERENCES `revendedora` (`id`),
  CONSTRAINT `FK_TIPO_CLIENTE` FOREIGN KEY (`categoria_cliente`) REFERENCES `categoria_cliente` (`id`),
  CONSTRAINT `FK_UBICACION` FOREIGN KEY (`ubicacion`) REFERENCES `ubicacion` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente`
--

LOCK TABLES `cliente` WRITE;
/*!40000 ALTER TABLE `cliente` DISABLE KEYS */;
/*!40000 ALTER TABLE `cliente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `factura`
--

DROP TABLE IF EXISTS `factura`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `factura` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `total` decimal(13,3) NOT NULL,
  `fecha_vencimiento` date NOT NULL,
  `campania` int(30) NOT NULL,
  `cobrado` bit(1) NOT NULL DEFAULT b'0',
  `nro_factura` varchar(15) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_FACTURA_CAMPANIA` (`campania`),
  CONSTRAINT `FK_FACTURA_CAMPANIA` FOREIGN KEY (`campania`) REFERENCES `campania` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `factura`
--

LOCK TABLES `factura` WRITE;
/*!40000 ALTER TABLE `factura` DISABLE KEYS */;
/*!40000 ALTER TABLE `factura` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `localidad`
--

DROP TABLE IF EXISTS `localidad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `localidad` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(30) NOT NULL,
  `provincia` int(30) NOT NULL,
  `codigo_postal` varchar(8) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNICO_CODIGO_POSTAL` (`codigo_postal`),
  KEY `FK_PROVINCIA` (`provincia`),
  CONSTRAINT `FK_PROVINCIA` FOREIGN KEY (`provincia`) REFERENCES `provincia` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `localidad`
--

LOCK TABLES `localidad` WRITE;
/*!40000 ALTER TABLE `localidad` DISABLE KEYS */;
INSERT INTO `localidad` VALUES (1,'Pilar',1,'1629'),(2,'Jose C. Paz',1,'1665'),(3,'Presidente Derqui',1,'1635');
/*!40000 ALTER TABLE `localidad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pais`
--

DROP TABLE IF EXISTS `pais`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pais` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pais`
--

LOCK TABLES `pais` WRITE;
/*!40000 ALTER TABLE `pais` DISABLE KEYS */;
INSERT INTO `pais` VALUES (1,'Argentina'),(2,'Paraguay');
/*!40000 ALTER TABLE `pais` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parametro`
--

DROP TABLE IF EXISTS `parametro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `parametro` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `parametro` varchar(100) NOT NULL,
  `valor` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parametro`
--

LOCK TABLES `parametro` WRITE;
/*!40000 ALTER TABLE `parametro` DISABLE KEYS */;
/*!40000 ALTER TABLE `parametro` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedido_avon`
--

DROP TABLE IF EXISTS `pedido_avon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pedido_avon` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `cliente` int(30) DEFAULT NULL,
  `revendedora` int(30) DEFAULT NULL,
  `fecha_alta` date NOT NULL,
  `fecha_recibido` date NOT NULL,
  `recibido` bit(1) NOT NULL DEFAULT b'0',
  `entregado` bit(1) NOT NULL DEFAULT b'0',
  `cobrado` bit(1) NOT NULL DEFAULT b'0',
  PRIMARY KEY (`id`),
  KEY `FK_CLIENTE_PEDIDO_AVON` (`cliente`),
  KEY `FK_REVENDEDORA_PEDIDO_AVON` (`revendedora`),
  CONSTRAINT `FK_CLIENTE_PEDIDO_AVON` FOREIGN KEY (`cliente`) REFERENCES `cliente` (`id`),
  CONSTRAINT `FK_REVENDEDORA_PEDIDO_AVON` FOREIGN KEY (`revendedora`) REFERENCES `revendedora` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedido_avon`
--

LOCK TABLES `pedido_avon` WRITE;
/*!40000 ALTER TABLE `pedido_avon` DISABLE KEYS */;
/*!40000 ALTER TABLE `pedido_avon` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedido_producto_catalogo`
--

DROP TABLE IF EXISTS `pedido_producto_catalogo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pedido_producto_catalogo` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `pedido_avon` int(30) NOT NULL,
  `producto_catalogo` int(30) NOT NULL,
  `cantidad` int(30) NOT NULL,
  `recibido` bit(1) NOT NULL DEFAULT b'0',
  PRIMARY KEY (`id`),
  KEY `FK_PEDIDO_AVON_CAMPANIA` (`pedido_avon`),
  KEY `FK_PRODUCTO_CATALOGO_` (`producto_catalogo`),
  CONSTRAINT `FK_PEDIDO_AVON_CAMPANIA` FOREIGN KEY (`pedido_avon`) REFERENCES `pedido_avon` (`id`),
  CONSTRAINT `FK_PRODUCTO_CATALOGO_` FOREIGN KEY (`producto_catalogo`) REFERENCES `producto_catalogo` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedido_producto_catalogo`
--

LOCK TABLES `pedido_producto_catalogo` WRITE;
/*!40000 ALTER TABLE `pedido_producto_catalogo` DISABLE KEYS */;
/*!40000 ALTER TABLE `pedido_producto_catalogo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `perfil`
--

DROP TABLE IF EXISTS `perfil`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `perfil` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(30) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `DESCRIPCION_PERFIL_UNICO` (`descripcion`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `perfil`
--

LOCK TABLES `perfil` WRITE;
/*!40000 ALTER TABLE `perfil` DISABLE KEYS */;
INSERT INTO `perfil` VALUES (1,'ADMINISTRADOR');
/*!40000 ALTER TABLE `perfil` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `perfil_permiso`
--

DROP TABLE IF EXISTS `perfil_permiso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `perfil_permiso` (
  `perfil` int(30) NOT NULL,
  `permiso` varchar(100) NOT NULL,
  PRIMARY KEY (`perfil`,`permiso`),
  CONSTRAINT `FK_PERFIL_PERMISO` FOREIGN KEY (`perfil`) REFERENCES `perfil` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `perfil_permiso`
--

LOCK TABLES `perfil_permiso` WRITE;
/*!40000 ALTER TABLE `perfil_permiso` DISABLE KEYS */;
INSERT INTO `perfil_permiso` VALUES (1,'PERFILES_CREAR'),(1,'PERFILES_ELIMINAR'),(1,'PERFILES_LISTAR'),(1,'PERFILES_MODIFICAR'),(1,'PERFILES_VISUALIZAR'),(1,'PERFIL_CREAR'),(1,'PERFIL_ELIMINAR'),(1,'PERFIL_LISTAR'),(1,'PERFIL_MODIFICAR'),(1,'PERFIL_VISUALIZAR'),(1,'PERMISOS_LISTAR'),(1,'PERSONA_CREAR'),(1,'PERSONA_ELIMINAR'),(1,'PERSONA_LISTAR'),(1,'PERSONA_MODIFICAR'),(1,'PERSONA_VISUALIZAR');
/*!40000 ALTER TABLE `perfil_permiso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `persona`
--

DROP TABLE IF EXISTS `persona`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `persona` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `tipo_documento` int(30) NOT NULL,
  `documento` varchar(10) NOT NULL,
  `telefono` varchar(11) NOT NULL,
  `email` varchar(50) NOT NULL,
  `activo` bit(1) NOT NULL DEFAULT b'1',
  `localidad` int(30) NOT NULL,
  `fecha_alta_persona` date NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNICO_DOCUMENTO` (`documento`),
  KEY `FK_TIPO_DOCUMENTO` (`tipo_documento`),
  CONSTRAINT `FK_TIPO_DOCUMENTO` FOREIGN KEY (`tipo_documento`) REFERENCES `tipo_documento` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `persona`
--

LOCK TABLES `persona` WRITE;
/*!40000 ALTER TABLE `persona` DISABLE KEYS */;
INSERT INTO `persona` VALUES (1,1,'28133204','9703792480','ewerlock0@ihg.com','\0',1,'2018-03-09'),(2,1,'34786302','3548193210','lblakemore1@marketwatch.com','',1,'2017-08-01'),(3,3,'93231089','5787293296','sodowling2@deviantart.com','\0',2,'2018-08-28'),(4,1,'66867622','6815063075','jweitzel3@tmall.com','\0',3,'2018-06-15'),(5,1,'75025718','3077772829','cyashin4@bbb.org','\0',3,'2018-07-28'),(6,2,'85004811','6745413278','gpentelow5@oaic.gov.au','\0',3,'2017-12-03'),(7,1,'90073313','4640592772','gevershed6@deliciousdays.com','\0',1,'2018-01-10'),(8,1,'69988967','5376586556','mbottleson7@bravesites.com','\0',2,'2018-01-25'),(9,1,'64885368','6129980316','dserchwell8@youtube.com','\0',2,'2018-03-27'),(10,1,'31174467','7644458996','khaggar9@slate.com','',1,'2018-07-23'),(11,3,'82365380','7838146037','lhughlocka@pbs.org','\0',2,'2017-12-24'),(12,3,'65174215','9662494310','estateb@oakley.com','',3,'2018-03-17'),(13,1,'75314440','8521819474','jkemmonsc@flickr.com','',2,'2018-01-15'),(14,3,'32570958','9244316876','mtynemouthd@shutterfly.com','\0',1,'2018-04-21'),(15,1,'53988175','5231930023','jashurste@zimbio.com','',1,'2018-04-18'),(16,3,'69695048','2897283828','acooneyf@mtv.com','',2,'2018-01-04'),(17,2,'65907758','5559816526','adockwrag@amazon.de','\0',3,'2018-03-06'),(18,2,'84670423','5162736700','abynoldh@miibeian.gov.cn','',2,'2017-10-01'),(19,3,'60315842','4043638205','crippingalei@blogspot.com','',1,'2018-07-05'),(20,1,'87446861','4076178243','acapounj@amazon.co.jp','',1,'2017-10-28'),(21,2,'78782009','9120954819','pcarrierk@blogs.com','',2,'2018-06-15'),(22,2,'57089395','3382142458','gbridsonl@yelp.com','',2,'2018-06-22'),(23,3,'29116046','6237521564','dghelerdinim@microsoft.com','',2,'2018-03-30'),(24,2,'26432172','3180683954','ahaglintonn@elpais.com','',2,'2018-05-09'),(25,3,'74736339','7752144988','glinkletero@indiatimes.com','',2,'2018-07-22'),(26,3,'54271819','8991328969','hdearmanp@cmu.edu','',3,'2018-07-26'),(27,1,'63759242','9344937837','eorbellq@trellian.com','',3,'2018-07-05'),(28,1,'34592110','1940433755','asdf@trellian.com','\0',2,'2018-07-14'),(29,1,'40369986','1520094407','qwer@trellian.com','',1,'2017-10-02'),(30,1,'21889725','2009730782','cvitteryt@usda.gov','\0',1,'2018-08-19'),(31,1,'63925392','8162980359','bdelatremoilleu@goo.ne.jp','',3,'2018-05-06'),(32,3,'93966592','3443761725','ncuxsonv@ca.gov','\0',3,'2018-04-23'),(33,3,'52356287','3366257295','adalliwaterw@altervista.org','',1,'2017-10-07'),(34,1,'99152560','1706806835','jcubberleyx@bluehost.com','\0',3,'2018-06-13'),(35,2,'44099547','5950901939','amaudey@ameblo.jp','',3,'2017-09-13'),(36,3,'82236452','7970834074','rstonerz@sciencedirect.com','',2,'2017-09-09'),(37,1,'53118455','3186844875','ipayn10@bbc.co.uk','',1,'2017-12-08'),(38,1,'74004233','9325819085','cdallander11@google.cn','\0',3,'2018-06-20'),(39,2,'46649152','2796305878','kmosedall12@quantcast.com','',1,'2018-07-15'),(40,3,'89231877','7194291612','harman13@comsenz.com','\0',1,'2017-09-02'),(41,3,'56065617','4690376179','jmenier14@digg.com','\0',3,'2018-04-03'),(42,3,'60554056','8955730884','abohike15@cdc.gov','\0',2,'2017-11-16'),(43,1,'74892130','4820363717','mroskelley16@bizjournals.com','\0',1,'2018-05-07'),(44,2,'23633776','7413342145','aeads17@github.io','',2,'2017-10-29'),(45,2,'77879966','9445138923','rruilton18@tuttocitta.it','',1,'2017-12-04'),(46,3,'66115613','9597391851','sfeasley19@google.fr','',1,'2017-11-03'),(47,2,'28766495','8365781700','cadamczewski1a@rambler.ru','\0',3,'2017-08-05'),(48,2,'65282439','2057019655','cmccloughen1b@msn.com','\0',3,'2018-04-21'),(49,1,'89565157','5887206807','tferrea1c@slate.com','\0',1,'2018-03-30'),(50,1,'70830465','5466501970','hhadfield1d@cdc.gov','\0',3,'2017-08-04');
/*!40000 ALTER TABLE `persona` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `producto`
--

DROP TABLE IF EXISTS `producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `producto` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(30) NOT NULL,
  `categoria` int(30) NOT NULL,
  `unidad` int(30) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_CATEGORIA_PRODUCTO` (`categoria`),
  KEY `FK_UNIDAD_PRODUCTO` (`unidad`),
  CONSTRAINT `FK_CATEGORIA_PRODUCTO` FOREIGN KEY (`categoria`) REFERENCES `categoria_producto` (`id`),
  CONSTRAINT `FK_UNIDAD_PRODUCTO` FOREIGN KEY (`unidad`) REFERENCES `unidad` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto`
--

LOCK TABLES `producto` WRITE;
/*!40000 ALTER TABLE `producto` DISABLE KEYS */;
/*!40000 ALTER TABLE `producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `producto_catalogo`
--

DROP TABLE IF EXISTS `producto_catalogo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `producto_catalogo` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `producto` int(30) NOT NULL,
  `catalogo` int(30) NOT NULL,
  `precio` decimal(13,3) NOT NULL,
  `activo` bit(1) DEFAULT b'1',
  PRIMARY KEY (`id`),
  KEY `FK_PRODUCTO_CATALOGO` (`producto`),
  KEY `FK_CATALOGO_CATALOGO` (`catalogo`),
  CONSTRAINT `FK_CATALOGO_CATALOGO` FOREIGN KEY (`catalogo`) REFERENCES `catalogo` (`id`),
  CONSTRAINT `FK_PRODUCTO_CATALOGO` FOREIGN KEY (`producto`) REFERENCES `producto` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto_catalogo`
--

LOCK TABLES `producto_catalogo` WRITE;
/*!40000 ALTER TABLE `producto_catalogo` DISABLE KEYS */;
/*!40000 ALTER TABLE `producto_catalogo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `provincia`
--

DROP TABLE IF EXISTS `provincia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `provincia` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(30) NOT NULL,
  `pais` int(30) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_PAIS` (`pais`),
  CONSTRAINT `FK_PAIS` FOREIGN KEY (`pais`) REFERENCES `pais` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `provincia`
--

LOCK TABLES `provincia` WRITE;
/*!40000 ALTER TABLE `provincia` DISABLE KEYS */;
INSERT INTO `provincia` VALUES (1,'Buenos Aires',1),(2,'Entre Rios',1),(3,'Paraguay',2);
/*!40000 ALTER TABLE `provincia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `remito`
--

DROP TABLE IF EXISTS `remito`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `remito` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `factura` int(30) NOT NULL,
  `numero_remito` int(30) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_REMITO_FACTURA` (`factura`),
  CONSTRAINT `FK_REMITO_FACTURA` FOREIGN KEY (`factura`) REFERENCES `factura` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `remito`
--

LOCK TABLES `remito` WRITE;
/*!40000 ALTER TABLE `remito` DISABLE KEYS */;
/*!40000 ALTER TABLE `remito` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `remito_producto`
--

DROP TABLE IF EXISTS `remito_producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `remito_producto` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `remito` int(11) NOT NULL,
  `producto_catalogo` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(13,3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_REMITO_REMITO` (`remito`),
  KEY `FK_REMITO_PRODUCTO` (`producto_catalogo`),
  CONSTRAINT `FK_REMITO_PRODUCTO` FOREIGN KEY (`producto_catalogo`) REFERENCES `producto_catalogo` (`id`),
  CONSTRAINT `FK_REMITO_REMITO` FOREIGN KEY (`remito`) REFERENCES `remito` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `remito_producto`
--

LOCK TABLES `remito_producto` WRITE;
/*!40000 ALTER TABLE `remito_producto` DISABLE KEYS */;
/*!40000 ALTER TABLE `remito_producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `revendedora`
--

DROP TABLE IF EXISTS `revendedora`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `revendedora` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `categoria_revendedora` int(30) NOT NULL,
  `fecha_alta_revendedora` date NOT NULL,
  `activo` bit(1) NOT NULL DEFAULT b'1',
  `persona` int(30) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `CATEGORIA_REVENDEDORA` (`categoria_revendedora`),
  CONSTRAINT `CATEGORIA_REVENDEDORA` FOREIGN KEY (`categoria_revendedora`) REFERENCES `categoria_revendedora` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `revendedora`
--

LOCK TABLES `revendedora` WRITE;
/*!40000 ALTER TABLE `revendedora` DISABLE KEYS */;
INSERT INTO `revendedora` VALUES (1,1,'2018-08-29','',0);
/*!40000 ALTER TABLE `revendedora` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_documento`
--

DROP TABLE IF EXISTS `tipo_documento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tipo_documento` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_documento`
--

LOCK TABLES `tipo_documento` WRITE;
/*!40000 ALTER TABLE `tipo_documento` DISABLE KEYS */;
INSERT INTO `tipo_documento` VALUES (1,'DU'),(2,'LE'),(3,'PASAPORTE');
/*!40000 ALTER TABLE `tipo_documento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ubicacion`
--

DROP TABLE IF EXISTS `ubicacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ubicacion` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `ubicacion` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ubicacion`
--

LOCK TABLES `ubicacion` WRITE;
/*!40000 ALTER TABLE `ubicacion` DISABLE KEYS */;
/*!40000 ALTER TABLE `ubicacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `unidad`
--

DROP TABLE IF EXISTS `unidad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `unidad` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unidad`
--

LOCK TABLES `unidad` WRITE;
/*!40000 ALTER TABLE `unidad` DISABLE KEYS */;
/*!40000 ALTER TABLE `unidad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuario` (
  `id` int(30) NOT NULL AUTO_INCREMENT,
  `revendedora` int(30) DEFAULT NULL,
  `usuario` varchar(50) NOT NULL,
  `clave` varchar(100) NOT NULL,
  `clave_activacion_codigo` varchar(16) DEFAULT NULL,
  `clave_activacion_expiracion` datetime DEFAULT NULL,
  `perfil` int(30) NOT NULL,
  `notificaciones_activas` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `USUARIO_UNICO` (`usuario`),
  KEY `FK_PERFIL_USUARIO` (`perfil`),
  KEY `FK_USUARIO_REVENDEDORA` (`revendedora`),
  CONSTRAINT `FK_PERFIL_USUARIO` FOREIGN KEY (`perfil`) REFERENCES `perfil` (`id`),
  CONSTRAINT `FK_USUARIO_REVENDEDORA` FOREIGN KEY (`revendedora`) REFERENCES `revendedora` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'herramientas'
--

--
-- Dumping routines for database 'herramientas'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-08-29 22:11:18
