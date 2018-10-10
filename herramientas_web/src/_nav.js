export default {
  items: [
    {
      name: 'Personas',
      url: '/personas',
      icon: 'icon-person'
    },
    {
      title: true,
      name: 'Administración',
      wrapper: {
        element: '',
        attributes: {},
      }
    },    
    {
      name: 'Series',
      url: '/administracion/series',
      permissions: ["SERIES_LISTAR"]
    },
    {
      title: true,
      name: 'Configuración',
      wrapper: {
        element: '',
        attributes: {},
      }
    },
    {
      name: 'Determinaciones',
      url: '/configuracion/determinaciones',
      permissions: ["DETERMINACIONES_LISTAR"]
    },
    {
      name: 'Laboratorios',
      url: '/configuracion/laboratorios',
      permissions: ["LABORATORIOS_LISTAR"]
    },
    {
      name: 'Metodos',
      url: '/configuracion/metodos',
      permissions: ["METODOS_LISTAR"]
    },
    {
      name: 'Unidades de Medida',
      url: '/configuracion/unidades',
      permissions: ["UNIDADES_LISTAR"]
    }
  ],
};
