import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import Config from '../../commons/config/Config.js'
import Security from '../../commons/security/Security.js'
import AjaxHandler from '../../commons/ajax/AjaxHandler.js'
import $ from 'jquery'
import moment from 'moment'
import 'moment/min/locales'
import DataTable from 'datatables.net-bs4'
import 'datatables.net-bs4/css/dataTables.bootstrap4.css'
import 'datatables.net-autofill-bs4'
import 'datatables.net-buttons-bs4'
import 'datatables.net-buttons/js/buttons.colVis.js'
import 'datatables.net-buttons/js/buttons.flash.js'
import 'datatables.net-buttons/js/buttons.html5.js'
import 'datatables.net-buttons/js/buttons.print.js'
import 'datatables.net-colreorder-bs4/css/colReorder.bootstrap4.min.css'
import 'datatables.net-fixedcolumns-bs4/css/fixedColumns.bootstrap4.min.css'
import 'datatables.net-fixedheader-bs4/css/fixedHeader.bootstrap4.min.css'
import 'datatables.net-keytable-bs4/css/keyTable.bootstrap4.min.css'
import 'datatables.net-responsive-bs4'
import 'datatables.net-rowgroup-bs4/css/rowGroup.bootstrap4.min.css'
import 'datatables.net-rowreorder-bs4/css/rowReorder.bootstrap4.css'
import 'datatables.net-scroller-bs4/css/scroller.bootstrap4.min.css'
import 'datatables.net-select-bs4/css/select.bootstrap4.min.css'
import '../../assets/css/vec-datatables.css'
import datatablesConfig from '../../commons/datatables/DatatablesConfig.js'
import jzip from 'xlsx/dist/jszip'
import 'xlsx/dist/xlsx.full.min.js'
//import LogoCompany from '../../assets/images/logo-company-login-tc-print.png'
import LogoCompany from '../../assets/images/logo-company.png'
import LogoVecFleet from '../../assets/images/logo-vecfleet.png'

$.DataTable = DataTable;
window.JSZip = jzip;
var pdfMake = require('pdfmake/build/pdfmake.js');
var pdfFonts = require('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;

class TicketsGrid extends Component {
	constructor(props) {
		super(props);

		this.ajaxHandler = new AjaxHandler();

		this.columnsToPrint = [0,1,3,4,5,6,7,8,9,10,11,12];
		moment.locale('es');

		this.state = {
			redirectTo: null,
			now: new Date(),
			estadisticas: null
		}
	}

	componentDidMount(nextProps, nextState) {
		if(Security.hasPermission('TICKETS_LISTAR')) {
	      	this.ajaxHandler.subscribe(this);
			this.initGrid();
	    } else {
		    	this.setState({
		        redirectTo: '/error'
	      	});
	    }
	}

	componentWillUnmount() {
		this.ajaxHandler.unsubscribe();
		$('div.tooltip[role="tooltip"]').remove();
		if(this.table) this.table.destroy();
	}


	handleNew(event) {
		// TO DO: llamar a alta de correctivo?
		console.log(this.refs);
		this.setState({
			redirectTo: '../correctivos/add'
		});
	}

	handleFilterPreventivos(event) {
		if(this.table){
			this.table.column(0).search('PREVENTIVO', false, true).draw();
			$('#filter_tipoTicket').val('PREVENTIVO');
		}
	}

	handleFilterCorrectivos(event) {
		if(this.table){
			this.table.column(0).search('CORRECTIVO', false, true).draw();
			$('#filter_tipoTicket').val('CORRECTIVO');
		}
	}

	handleFilterVencimientos(event) {
		if(this.table){
			this.table.column(0).search('VENCIMIENTO', false, true).draw();
			$('#filter_tipoTicket').val('VENCIMIENTO');
		}
	}

	handleFilterEnTaller(event) {
		if(this.table){
			this.table.column(10).search(true, false, true).draw();
			$('#filter_enTaller').val('true');
		}
	}

	render() {
		return (
			<React.Fragment>
			{this.state.redirectTo && <Redirect push to={this.state.redirectTo} />}
			<section id="minimal-gradient-statistics-bg">
				<div className="row">
					<div className="col-xl-3 col-lg-6 col-12" style={{cursor: 'pointer'}} onClick={this.handleFilterPreventivos.bind(this)}>
						<div className="card bg-gradient-directional-preventivo">
							<div className="card-content">
								<div className="card-body">
									<div className="media d-flex">
										<div className="align-self-center">
											<i className="ft-check-circle text-white font-large-2 float-left"></i>
										</div>
										<div className="media-body text-white text-right">
											<h3 className="text-white">{this.state.estadisticas && this.state.estadisticas.cantidadPreventivos ? this.state.estadisticas.cantidadPreventivos : '0' }</h3>
											<span>Preventivos</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-xl-3 col-lg-6 col-12" style={{cursor: 'pointer'}} onClick={this.handleFilterCorrectivos.bind(this)}>
						<div className="card bg-gradient-directional-correctivo">
							<div className="card-content">
								<div className="card-body">
									<div className="media d-flex">
										<div className="align-self-center">
											<i className="icon-wrench text-white font-large-2 float-left"></i>
										</div>
										<div className="media-body text-white text-right">
											<h3 className="text-white">{this.state.estadisticas && this.state.estadisticas.cantidadCorrectivos ? this.state.estadisticas.cantidadCorrectivos : '0' }</h3>
											<span>Correctivos</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-xl-3 col-lg-6 col-12" style={{cursor: 'pointer'}} onClick={this.handleFilterVencimientos.bind(this)}>
						<div className="card bg-gradient-directional-vencimiento">
							<div className="card-content">
								<div className="card-body">
									<div className="media d-flex">
										<div className="align-self-center">
											<i className="icon-credit-card font-size-3-5rem text-white float-left"></i>
										</div>
										<div className="media-body text-white text-right">
											<h3 className="text-white">{this.state.estadisticas && this.state.estadisticas.cantidadVencimientos ? this.state.estadisticas.cantidadVencimientos : '0' }</h3>
											<span>Vencimientos</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-xl-3 col-lg-6 col-12" style={{cursor: 'pointer'}} onClick={this.handleFilterEnTaller.bind(this)}>
						<div className="card bg-gradient-directional-en-taller">
							<div className="card-content">
								<div className="card-body">
									<div className="media d-flex">
										<div className="align-self-center">
											<i className="fas fa-warehouse text-white font-large-2 float-left"></i>
										</div>
										<div className="media-body text-white text-right">
										<h3 className="text-white">{this.state.estadisticas && this.state.estadisticas.cantidadEnTaller ? this.state.estadisticas.cantidadEnTaller : '0' }</h3>
											<span>En Taller</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			<div className="row mt-2">
				<div className="col-12">
					<div className="card">
						<div className="card-content collpase show">
							<div className="card-body card-dashboard">
								<div className="container-fluid">
									<div className="row dt-icons">
										<div className="col-6">
											<div className="btn btn-primary box-shadow-2 btn-round btn-lg btn-dt-main round-icon" onClick={this.handleNew.bind(this)} data-toggle="tooltip" data-placement="right" title="Nuevo">
												<i className="ft-plus"></i>
											</div>
										</div>
										<div className="col-6" id="buttons"></div>
									</div>
								</div>
								<div className="table-responsive">
									<table id="dataTable" className="narrow table nowrap server-side table-hover" ref="grid" width="100%">
										<tfoot>
										<tr style={{backgroundColor: '#fff'}}>
											<th className=""></th>
											<th className=""></th>
											<th className="dt-search-header"></th>
											<th className="dt-search-header"></th>
											<th className="dt-search-header"></th>
											<th className="dt-search-header"></th>
											<th className="dt-search-header"></th>
											<th className="dt-search-header"></th>
											<th className="dt-search-header"></th>
											<th className="dt-search-header"></th>
											<th className="dt-search-header"></th>
											<th className="dt-search-header"></th>
											<th className="dt-search-header"></th>
											<th className="dt-search-header"></th>
											<th className=""></th>
											<th className=""></th>
										</tr>
										</tfoot>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			</React.Fragment>
		);
	}

	initGrid() {
		window.scrollTo(0, 0);
		let component = this;

		Promise.all([
			this.ajaxHandler.getJson('/bases/select-filtered-by-user'),
			this.ajaxHandler.getJson('/gerenciadores/select-filtered-by-user'),
			this.ajaxHandler.getJson('/servicios/select'),
			this.ajaxHandler.getJson('/tickets/estadisticas'),
		]).then((data) => {
			let filters = {
				base: data[0] ? data[0] : [],
				gerenciador: data[1] ? data[1] : [],
				servicio: data[2] ? data[2] : [],
				estado: [{value: 'PENDIENTES', label: 'PENDIENTES'},{value: '-', label: '─────────────'},{value: 'ABIERTO', label: 'ABIERTO'},{value: 'CERRADO', label: 'CERRADO'},{value: 'CANCELADO', label: 'CANCELADO'},{value: 'PRESUPUESTADO', label: 'PRESUPUESTADO'},{value: 'RECOTIZAR', label: 'RECOTIZAR'},{value: 'APROBADO', label: 'APROBADO'},{value: 'LISTO PARA RETIRAR', label: 'LISTO PARA RETIRAR'},{value: 'REALIZADO', label: 'REALIZADO'}],
				tipoTicket: [{value: 'CORRECTIVO', label: 'CORRECTIVO'},{value: 'PREVENTIVO', label: 'PREVENTIVO'},{value: 'VENCIMIENTO', label: 'VENCIMIENTO'}],
				enTaller: [{value: true, label: 'SI'}, {value: false, label: 'NO'}],
				fechaRealizado: [{value: true, label: 'SI'}, {value: false, label: 'NO'}],
			}
			let estadisticas = data[3] ? data[3] : [];
			component.setState({
				estadisticas: estadisticas
			});

			this.table = $(this.refs.grid).DataTable(
				Object.assign({
					dom: 'r<t><"row mt-2"<"col-4" l><"col-4 text-center" i><"col-4" p>>',
					stateSave: true,
					stateSaveCallback: function(settings, data) {
						localStorage.setItem('DataTables_' + component.constructor.name, JSON.stringify(data));
					},
					stateLoadCallback: function(settings) {
						return JSON.parse(localStorage.getItem('DataTables_' + component.constructor.name));
					},
					processing: true,
					serverSide: true,
					"order": [[ 1, "desc" ]],
					"searchCols": [
						null,
						null,
						null,
						{ "search": "PENDIENTES" },
					],
					ajax: {
						type: 'GET',
						url: Config.get('apiUrlBase') + '/tickets/grid',
						headers: {
							'Authorization-Token': localStorage.getItem("token")
						},
						dataSrc: function(response) {
							return response.data;
						},
						error: function(xhr, error, thrown) {
							this.ajaxHandler.handleResponseErrorsIsValid(xhr);
						},
						cache: false
					},
					initComplete: function(settings) {
						let stateColumns = JSON.parse(localStorage.getItem('DataTables_' + component.constructor.name)).columns;

						var sets = settings;
						var index = 0;

						this.api().columns().every(function() {
							var column = this;

							if (sets.aoColumns[index].filterType) {
								if (sets.aoColumns[index].filterType === 'select') {
									var select = $('<select id="filter_' + sets.aoColumns[index].name + '" class="btn-dt-filter" required><option value="" selected>Buscar...</option></select>')
										.appendTo($(column.footer()).empty())
										.on('change', function() {
											var val = $.fn.dataTable.util.escapeRegex($(this).val());
											column
												.search(val ? val : '', true, false)
												.draw();
										});
									if (filters && sets.aoColumns[index].name && filters[sets.aoColumns[index].name]) {
										filters[sets.aoColumns[index].name].map(e => {
											if(e.value === '-'){
												select.append('<option disabled value="' + e.value + '">' + e.label + '</option>');
											} else {
												select.append('<option value="' + e.value + '">' + e.label + '</option>');
											}
											return true;
										});
									} else {
										column.data().unique().sort().each(function(d, j) {
											select.append('<option value="' + d + '">' + d + '</option>');
										});
									}
									if (stateColumns[index].search.search) select.val(stateColumns[index].search.search);
								}
								if (sets.aoColumns[index].filterType === 'input') {
									var input = $('<input type="text" id="filter_' + sets.aoColumns[index].name + '" class="btn-dt-filter" placeholder="Buscar..." />');
									if (stateColumns[index].search.search) input.val(stateColumns[index].search.search);
									input.appendTo($(column.footer()).empty());
									input.on('keyup change', function() {
										if (column.search() !== this.value) {
											column
												.search(this.value)
												.draw()
												.ajax.reload(null, false);
										}
									});
								}
							}
							index++;
							return '';
						});

						$('tfoot tr').appendTo('thead');
					},
					columns: [{
						name: 'tipoTicket',
						title: 'Tipo',
						data: 'tipoTicket',
						className: 'all',
						orderable: true,
						render: function(data, type, full, meta) {
							if (type === 'filter') {
								return data
							} else {
								return '<div id="avatar"></div>';
							}
						},
						filterType: 'select'
					}, {
						title: 'Tkt',
						className: 'all',
						data: 'id',
						orderable: true,
						filterType: 'input'
					}, {
						name: 'indicador',
						title: '',
						data: 'semaforo',
						width: '10px',
						padding: 0,
						orderable: false,
						className: 'all',
						render: function(data, type, full, meta) {
							return '';
						},
						createdCell: function(td, cellData, rowData, row, col) {
							switch(true){
								case (cellData === 'VERDE'):
									$(td).addClass('status-green');
									break;
								case (cellData === "AMARILLO"):
									$(td).addClass('status-yellow');
									break;
								case (cellData === "ROJO"):
									$(td).addClass('status-red');
									break;
								default:
									$(td).addClass('status-grey');
									break;
							}
						},
						filterType: 'none'
					}, {
						name: 'estado',
						title: 'Estado',
						className: 'all',
						data: 'estado',
						filterType: 'select'
					}, {
						title: 'Creado',
						className: 'all',
						data: 'fechaHoraAlta',
						render: function(data, type, full, meta) {
							return data ? moment(data).format('L') : '';
						},
						filterType: 'input'
					}, {
						name: 'detalle',
						title: 'Detalle',
						className: 'all',
						data: 'detalle',
						width: '120px',
						filterType: 'input'
					},{
						name: 'servicio',
						title: 'Servicio',
						className: 'all',
						data: 'servicio',
						render: function(data, type, row) {
							if (type === 'filter') {
								return data && data.id ? data.id : '';
							} else {
								return data && data.nombre ? data.nombre : '';
							}
						},
						filterType: 'select'
					}, {
						title: 'Entidad',
						className: 'all',
						data: 'movilPersona',
						width: '60px',
						render: function(data, type, row) {
							return data && data.descripcion ? data.descripcion : '';
						},
						filterType: 'input'
					}, {
						name: 'gerenciador',
						title: 'Gerenciador',
						className: 'all',
						data: 'gerenciador',
						render: function(data, type, row) {
							if (type === 'filter') {
								return data && data.id ? data.id : '';
							} else {
								return data && data.razonSocial ? data.razonSocial : '';
							}
						},
						filterType: 'select'
					}, {
						name: 'base',
						title: 'Base',
						className: 'all',
						data: 'base',
						render: function(data, type, row) {
							if (type === 'filter') {
								return data && data.id ? data.id : '';
							} else {
								return data && data.descripcion ? data.descripcion : '';
							}
						},
						filterType: 'select'
					}, {
						name: 'enTaller',
						title: 'Taller',
						data: 'enTaller',
						className: 'all',
						render: function(data, type, full, meta) {
							if (type === 'filter') {
								return data
							} else {
								return data ? '<div class="text-center success dt-info-icon"><i class="ft-check" data-togle="tooltip" data-placement="top" title="En Taller"></i></div>' : '';
							}
						},
						createdCell: function(td, cellData, rowData, row, col) {
							$(td).find('div > i').tooltip();
						},
						filterType: 'select'
					}, {
						name: 'mttTotal',
						title: 'TT',
						className: 'all',
						data: 'mttTotal',
						filterType: 'input'
					}, {
						name: 'mttParcial',
						title: 'TP',
						className: 'all',
						data: 'mttParcial',
						filterType: 'input'
					}, {
						name: 'fechaRealizado',
						title: 'Realizado',
						className: 'all',
						data: 'fechaRealizado',
						render: function(data, type, full, meta) {
							return data ? '<div class="text-center success dt-info-icon"><i class="ft-check" data-togle="tooltip" data-placement="top" title="'+ moment(data).format('L') + '"></i></div>' : '';
						},
						createdCell: function(td, cellData, rowData, row, col) {
							$(td).find('div > i').tooltip();
						},
						filterType: 'select'
					}, {
						orderable: false,
						title: '',
						data: 'comentario',
						className: 'all',
						render: function(data, type, full, meta) {
							return data ? '<div class="text-center success dt-info-icon"><i class="ft-message-square" data-togle="tooltip" data-placement="top" title="'+ data.comentario + '"></i></div>' : '';
						},
						createdCell: function(td, cellData, rowData, row, col) {
							$(td).find('div > i').tooltip();
						},
						filterType: 'none'
					}, {
						orderable: false,
						data: null,
						className: "text-center all",
						width: '120px',
						render: function(data, type, full, meta) {
							return `
								<button class="action view btn btn-sm btn-icon btn-dt-grid text-success" title="Trabajar con ticket" data-togle="tooltip" data-placement="top">
									<i class="fa fa-pencil fa-xs"></i>
								</button>
							`;
						},
						createdCell: function(td, cellData, rowData, row, col) {
							$(td).find('button').tooltip();
						},
						filterType: 'none'
					}],
					drawCallback: function() {
						$(this).find('.action').on('click', function() {
							let data = component.table.row($(this).parents('tr')).data();
							let redirectTo;
							if ($(this).hasClass('view')) redirectTo = component.props.match.url + '/' + data.id;
							component.setState({
								redirectTo: redirectTo
							});
						});
					},
					rowCallback: function(row, data) {
						$('#avatar', row).addClass('dt-user-avatar');
						switch(data.ticketTipo){
							case 'PREVENTIVO':
								$('#avatar', row).addClass('avatar-red');
								break;
							case 'VENCIMIENTO':
								$('#avatar', row).addClass('avatar-blue');
								break;
							case 'GESTORIA':
								$('#avatar', row).addClass('avatar-yellow');
								break;
							case 'CORRECTIVO':
								$('#avatar', row).addClass('avatar-green');
								break;
							default:
								break;
						}
						$('#avatar', row).html(data.ticketTipo.substr(0, 1).toUpperCase());
					}
				}, datatablesConfig)
			);

			new $.fn.dataTable.Buttons(this.table, {
				buttons: [{
					extend: 'print',
					name: 'print',
					text: '<i class="ft-printer"></i>',
					title: '',
					customize: function(win) {
						var css = '@page { size: landscape; }',
							head = win.document.head || win.document.getElementsByTagName('head')[0],
							style = win.document.createElement('style');

						style.type = 'text/css';
						style.media = 'print';

						if (style.styleSheet) {
							style.styleSheet.cssText = css;
						} else {
							style.appendChild(win.document.createTextNode(css));
						}

						head.appendChild(style);

						$(win.document.body)
							.css('font-size', '10pt')
							.prepend(`<div class="container">
												<div class="row mb-2">
													<div class="col-6">
														<img style="height: 40px" src="` + LogoCompany + `" />
													</div>
													<div class="col-6	text-right">
														<img style="height: 40px" src="` + LogoVecFleet + `" />
													</div>
												</div>
												<div class="row mb-2">
													<div class="col-12" style="border-bottom: 1px solid #000;">
														<h2>Listado de Tickets</h2>
													</div>
												</div>
											</div>`);

						$(win.document.body).find('table')
							.addClass('compact')
							.css('font-size', 'inherit');
					},
					exportOptions: {
						columns: component.columnsToPrint
					},
					titleAttr: 'Imprimir'
				}, {
					extend: 'colvis',
					name: 'columns',
					text: '<i class="la la-columns"></i>',
					titleAttr: 'Seleccionar columnas'
				}, {
					extend: 'collection',
					name: 'export',
					text: '<i class="ft-download"></i>',
					titleAttr: 'Exportar',
					buttons: [{
						extend: 'copyHtml5',
						exportOptions: {
							columns: ':visible'
						},
						text: 'Copiar',
						titleAttr: 'Copiar'
					}, {
						extend: 'excelHtml5',
						exportOptions: {
							columns: ':visible'
						},
						titleAttr: 'Exportar a Excel'
					}, {
						extend: 'csvHtml5',
						exportOptions: {
							columns: ':visible'
						},
						titleAttr: 'Exportar en formato .csv'
					}, {
						extend: 'pdfHtml5',
						exportOptions: {
							columns: ':visible'
						},
						titleAttr: 'Exportar a PDF'
					}]
				}, {
					name: 'import',
					text: '<i class="ft-upload"></i>',
					titleAttr: 'Importar'
				}]
			});

			this.table.buttons(0, null).container().appendTo('#buttons');

			this.table.button('print:name')
				.nodes()
				.attr('data-toggle', 'tooltip')
				.attr('data-position', 'top');
			this.table.button('columns:name')
				.nodes()
				.attr('data-toggle', 'tooltip')
				.attr('data-position', 'top');
			this.table.button('export:name')
				.nodes()
				.attr('data-toggle', 'tooltip')
				.attr('data-position', 'top');
			this.table.button('import:name')
				.nodes()
				.attr('data-toggle', 'tooltip')
				.attr('data-position', 'top');
			$('[data-toggle="tooltip"]').tooltip();
		}).catch(function(error) {
			component.ajaxHandler.handleError(error);
		}).finally(() => {
			component.setState({
				loading: false
			});
		});
	}
}

export default TicketsGrid;