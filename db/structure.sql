#1.0.0
#Creación esquema
CREATE SCHEMA 'herramientas'
  DEFAULT CHARACTER SET utf8
  COLLATE utf8_spanish2_ci;

#Creación de tablas
#01
CREATE TABLE herramientas.campania
(
  id           INT              NOT NULL AUTO_INCREMENT,
  fecha_inicio DATE             NOT NULL,
  fecha_fin    DATE             NOT NULL,
  descripcion  VARCHAR(20)      NULL,
  activo       BIT(1) DEFAULT 1 NOT NULL,
  PRIMARY KEY (id)
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;
#02
CREATE TABLE herramientas.catalogo (
  id            INT              NOT NULL AUTO_INCREMENT,
  descripcion   VARCHAR(30)      NOT NULL,
  observaciones TEXT(200)        NULL,
  activo        BIT(1) DEFAULT 1 NOT NULL,
  PRIMARY KEY (id)
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;
#03
CREATE TABLE herramientas.categoria_producto (
  id          INT         NOT NULL AUTO_INCREMENT,
  descripcion VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;
#04
CREATE TABLE herramientas.unidad (
  id          INT         NOT NULL AUTO_INCREMENT,
  descripcion VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;
;
#05
CREATE TABLE herramientas.tipo_documento (
  id          INT         NOT NULL AUTO_INCREMENT,
  descripcion VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;
#06
CREATE TABLE herramientas.categoria_cliente (
  id          INT         NOT NULL AUTO_INCREMENT,
  descripcion VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;
#07
CREATE TABLE herramientas.ubicacion (
  id        INT         NOT NULL AUTO_INCREMENT,
  ubicacion VARCHAR(50) NOT NULL,
  PRIMARY KEY (id)
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;
#08
CREATE TABLE herramientas.pais (
  id          INT         NOT NULL AUTO_INCREMENT,
  descripcion VARCHAR(30) NOT NULL
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;
#09
CREATE TABLE herramientas.provincia (
  id          INT         NOT NULL AUTO_INCREMENT,
  descripcion VARCHAR(30) NOT NULL,
  pais        INT         NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT FK_PAIS FOREIGN KEY (pais)
  REFERENCES herramientas.pais (id)
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;
#10
CREATE TABLE herramientas.localidad (
  id            INT         NOT NULL AUTO_INCREMENT,
  descripcion   VARCHAR(30) NOT NULL,
  provincia     INT         NOT NULL,
  codigo_postal VARCHAR(8)  NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT FK_PROVINCIA FOREIGN KEY (provincia)
  REFERENCES herramientas.provincia (id),
  CONSTRAINT UNICO_CODIGO_POSTAL UNIQUE (codigo_postal)
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;
#11
CREATE TABLE herramientas.persona (
  id                 INT              NOT NULL AUTO_INCREMENT,
  tipo_documento     INT              NOT NULL,
  documento          VARCHAR(10)      NOT NULL,
  telefono           VARCHAR(11)      NOT NULL,
  email              VARCHAR(15)      NULL,
  activo             BIT(1) DEFAULT 1 NOT NULL,
  localidad          INT              NOT NULL,
  fecha_alta_persona DATE             NOT NULL,

  PRIMARY KEY (id),
  CONSTRAINT FK_TIPO_DOCUMENTO FOREIGN KEY (tipo_documento)
  REFERENCES herramientas.tipo_documento (id),
  CONSTRAINT UNICO_DOCUMENTO UNIQUE (documento)
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;
#12
CREATE TABLE perfil (
  id          INT         NOT NULL AUTO_INCREMENT,
  descripcion VARCHAR(30) NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT DESCRIPCION_PERFIL_UNICO UNIQUE (descripcion)
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;
#13
CREATE TABLE perfil_permiso (
  perfil  INT(30)      NOT NULL,
  permiso varchar(100) NOT NULL,
  PRIMARY KEY (perfil, permiso),
  KEY perfil (perfil),
  CONSTRAINT FK_PERFILES_PERMISOS FOREIGN KEY (perfil) REFERENCES perfiles (id)
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;
#14
CREATE TABLE herramientas.usuario (
  id                          INT(30)     NOT NULL AUTO_INCREMENT,
  revendedora                 INT(30)     NOT NULL,
  usuario                     VARCHAR(50) NOT NULL,
  clave                       VARCHAR(100),
  clave_activacion_codigo     VARCHAR(16) NULL,
  clave_activacion_expiracion DATETIME    NULL,
  perfil                      INT(30)     NOT NULL,
  notificaciones_activas      BIT         NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  CONSTRAINT FK_REVENDEDORA FOREIGN KEY fkIdx_112 (revendedora) REFERENCES revendedora (id),
  CONSTRAINT FK_PERFIL FOREIGN KEY fkIdx_470 (perfil) REFERENCES perfil (id),
  CONSTRAINT USUARIO_UNICO UNIQUE (usuario)
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;
#15
CREATE TABLE herramientas.categoria_revendedora (
  id          INT(30)     NOT NULL AUTO_INCREMENT,
  descripcion VARCHAR(30) NOT NULL,
  PRIMARY KEY ('id')
);
#16
CREATE TABLE herramientas.revendedora (
  id                     INT  NOT NULL AUTO_INCREMENT,
  categoria_revendedora  INT  NOT NULL,
  fecha_alta_revendedora DATE NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT CATEGORIA_REVENDEDORA FOREIGN KEY (categoria_revendedora)
  REFERENCES herramientas.categoria_revendedora (id)
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;
#17
CREATE TABLE herramientas.cliente (
  id                 INT(30)     NOT NULL AUTO_INCREMENT,
  categoria_cliente  INT(30)     NOT NULL,
  direccion_entrega  VARCHAR(30) NOT NULL,
  ubicacion          INT(30)     NULL,
  fecha_alta_cliente DATE        NOT NULL,
  anio_nacimiento    DATE        NULL,
  madre              BIT(1)      NULL,
  apodo              VARCHAR(15) NULL,
  persona            INT(30)     NOT NULL,
  activo             BIT(1)      NOT NULL DEFAULT 1,
  revendedora        INT         NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT FK_TIPO_CLIENTE FOREIGN KEY (categoria_cliente)
  REFERENCES herramientas.categoria_cliente (id),
  CONSTRAINT FK_UBICACION FOREIGN KEY (ubicacion)
  REFERENCES herramientas.ubicacion (id),
  CONSTRAINT FK_REVENDEDORA FOREIGN KEY (revendedora)
  REFERENCES herramientas.revendedora (id)
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;
#18
CREATE TABLE herramientas.catalogo_campania (
  id       INT(30)          NOT NULL AUTO_INCREMENT,
  catalogo INT(30)          NOT NULL,
  campania INT(30)          NOT NULL,
  activo   BIT(1) DEFAULT 1 NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT FK_CATALOGO FOREIGN KEY (catalogo)
  REFERENCES herramientas.catalogo (id),
  CONSTRAINT FK_CAMPANIA FOREIGN KEY (campania)
  REFERENCES herramientas.campania (id)
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;
#19
CREATE TABLE herramientas.producto (
  id          INT(30)     NOT NULL AUTO_INCREMENT,
  descripcion VARCHAR(30) NOT NULL,
  categoria   INT(30)     NOT NULL,
  unidad      INT(30)     NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT FK_CATEGORIA_PRODUCTO FOREIGN KEY (categoria)
  REFERENCES herramientas.categoria_producto (id)
);
#15
CREATE TABLE herramientas.producto_catalogo (
  id       INT(30)          NOT NULL AUTO_INCREMENT,
  producto INT(30)          NOT NULL,
  catalogo INT(30)          NOT NULL,
  precio   DECIMAL(13, 3)   NOT NULL,
  activo   BIT(1) DEFAULT 1 NULL,
  PRIMARY KEY ('id'),
  CONSTRAINT FK_PRODUCTO_CATALOGO FOREIGN KEY (producto)
  REFERENCES herramientas.producto (id),
  CONSTRAINT FK_CATALOGO_CATALOGO FOREIGN KEY (catalogo)
  REFERENCES herramientas.catalogo (id)
);
#16
CREATE TABLE herramientas.pedido_avon (
  id          INT(30)          NOT NULL AUTO_INCREMENT,
  cliente     INT(30)          NULL,
  revendedora INT(30)          NULL,
  fecha_alta  DATE             NOT NULL,
  entregado   BIT(1) DEFAULT 0 NOT NULL,
  cobrado     BIT(1) DEFAULT 0 NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT FK_CLIENTE FOREIGN KEY (cliente)
  REFERENCES herramientas.cliente (id),
  CONSTRAINT FK_REVENDEDORA FOREIGN KEY (revendedora)
  REFERENCES herramientas.revendedora (id)
);

#18
CREATE TABLE herramientas.pedido_producto_catalogo (
  id INT(30) NOT NULL AUTO_INCREMENT,
  pedido_cliente                      INT NOT NULL,
  producto_catalogo                   INT NOT NULL,
  cantidad                            INT NOT NULL,
  PRIMARY KEY (id)
);
#19
CREATE TABLE 'herramientas'.'factura' (
  'id_factura' INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY ('id_factura')
);
#20
CREATE TABLE 'herramientas'.'remito' (
  'id' INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY ('id_remito')
);
#21
CREATE TABLE 'herramientas'.'remito_producto' (
  'id_remito_producto' INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY ('id_remito_producto')
);


CREATE TABLE 'herramientas'.'pedido_revendedora' (
  'id_pedido_revendedora' INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY ('id_pedido_revendedora')
);
