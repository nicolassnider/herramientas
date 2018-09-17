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
import swal from 'sweetalert'

$.DataTable = DataTable;
window.JSZip = jzip;
var pdfMake = require('pdfmake/build/pdfmake.js');
var pdfFonts = require('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;


class VencimientosGrid extends Component {
	constructor(props) {
		super(props);

		this.ajaxHandler = new AjaxHandler();

		this.columnsToPrint = [1,2,3,4,5];
		moment.locale('es');

		this.state = {
			redirectTo: null
		}
	}

	componentDidMount(nextProps, nextState) {
		if(Security.hasPermission('VENCIMIENTOS_LISTAR')) {
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
		this.setState({
			redirectTo: this.props.match.url + '/add'
		});
	}

	handleKmChange() {
		alert('bla');
	}

	render() {
		return (
			<React.Fragment>
				{this.state.redirectTo && <Redirect push to={this.state.redirectTo} />}
				<div className="row mt-2">
					<div className="col-12">
						<div className="card">
							<div className="card-content collpase show">
								<div className="card-body card-dashboard">
									<div className="container-fluid">
										<div className="row dt-icons">
											<div className="col-6">
												{Security.renderIfHasPermission('VENCIMIENTOS_CREAR', (
												<div className="btn btn-primary box-shadow-2 btn-round btn-lg btn-dt-main round-icon" onClick={this.handleNew.bind(this)} data-toggle="tooltip" data-placement="right" title="Nuevo">
													<i className="ft-plus"></i>
												</div>
												))}
											</div>
											<div className="col-6" id="buttons"></div>
										</div>
									</div>
									<div className="table-responsive">
										<table id="dataTable" className="table nowrap server-side table-hover" ref="grid" width="100%">
											<tfoot>
												<tr style={{backgroundColor: '#fff'}}>
                          <th className="dt-search-header"></th>
													<th className="p-0"></th>
                          <th className="dt-search-header"></th>
													<th className="dt-search-header"></th>
													<th className="dt-search-header"></th>
													<th className="dt-search-header"></th>
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
			this.getData('/servicios/tipo-ticket/VENCIMIENTO/select'),
			this.getData('/bases/select'),
		]).then((data) => {
			let filters = {
				servicio: data[0] ? data[0] : [],
				base: data[1] ? data[1] : []
			};

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
					ajax: {
						type: 'GET',
						url: Config.get('apiUrlBase') + '/vencimientos/grid',
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
									var select = $('<select class="btn-dt-filter" required><option value="" selected>Buscar...</option></select>')
										.appendTo($(column.footer()).empty())
										.on('change', function() {
											var val = $.fn.dataTable.util.escapeRegex($(this).val());
											column
												.search(val ? val : '', true, false)
												.draw();
										});
									if (filters && sets.aoColumns[index].name && filters[sets.aoColumns[index].name]) {
										filters[sets.aoColumns[index].name].map(e => {
											select.append('<option value="' + e.value + '">' + e.label + '</option>');
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
									var input = $('<input type="text" class="btn-dt-filter" placeholder="Buscar..." />');
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
						title: '',
						data: 'estado',
						width: 3,
						padding: 0,
						orderable: false,
						className: 'p-0 all',
						render: function(data, type, full, meta) {
							return '';
						},
						createdCell: function(td, cellData, rowData, row, col) {
							$(td).attr('data-togle', 'tooltip');
							$(td).attr('data-placement', 'top');
              $(td).tooltip();
              switch (cellData) {
                case 'OK':
                  $(td).addClass('status-green');
                  $(td).attr('title', 'Ok');
                  break;
                case 'ALERTADO':
                  $(td).addClass('status-yellow');
                  $(td).attr('title', 'Alertado');
                  break;
                case 'VENCIMIENTO_CERCANO':
                  $(td).addClass('status-orange');
                  $(td).attr('title', 'Vencimiento Cercano');
                  break;
                case 'VENCIDO':
                  $(td).addClass('status-red');
                  $(td).attr('title', 'Vencido');
                  break;
                default:
                  $(td).addClass('status-grey');
                  $(td).attr('title', '');
                  break;
							}
						},
						filterType: 'none'
					}, {
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
						title: 'Número',
						className: 'all',
						data: 'numero',
						filterType: 'input'
					}, {
						title: 'Entidad',
						className: 'all',
            data: 'movilPersona',
            render: function(data, type, row) {
							if (type === 'filter') {
								return data && data.id ? data.id : '';
							} else {
								return data && data.descripcion ? data.descripcion : '';
							}
						},
						filterType: 'input'
					}, {
						title: 'Vencimiento',
						className: 'all',
						data: 'fechaVencimiento',
						render: function(data, type, full, meta) {
							return data ? moment(data).format('L') : '';
						},
						filterType: 'input'
					}, {
						orderable: false,
						data: null,
						className: "text-center all",
						width: '120px',
						render: function(data, type, full, meta) {
							let html =
								(Security.hasPermission('VENCIMIENTOS_VISUALIZAR') ? `
								<button class="action view btn btn-sm btn-icon btn-dt-grid text-success" data-title="Ver" data-togle="tooltip" data-placement="top">
									<i class="fa fa-search fa-xs"></i>
								</button>` : '') +
								(Security.hasPermission('VENCIMIENTOS_MODIFICAR') ? `
								<button class="action edit btn btn-sm btn-icon btn-dt-grid text-success" data-title="Editar" data-togle="tooltip" data-placement="top">
									<i class="fa fa-pencil fa-xs"></i>
								</button>` : '') +
								(Security.hasPermission('VENCIMIENTOS_ELIMINAR') ? `
								<button class="action delete btn btn-sm btn-icon btn-dt-grid text-danger" data-title="Eliminar" data-togle="tooltip" data-placement="top">
									<i class="ft ft-trash"></i>
								</button>` : '');
							return html;
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
							if ($(this).hasClass('edit')) redirectTo = component.props.match.url + '/' + data.id + '/edit';
							component.setState({
								redirectTo: redirectTo
							});
							if ($(this).hasClass('delete')) {
								swal({
										title: "¿Confirma la eliminación?",
										text: null,
										icon: "warning",
										buttons: {
											confirm: {
												text: "Si",
												value: true,
												visible: true,
												className: "btn btn-primary",
												closeModal: false
											},
											cancel: {
												text: "No",
												value: null,
												visible: true,
												className: "btn btn-danger",
												closeModal: true,
											}
										}
									})
									.then((isConfirm) => {
										if (isConfirm) {
											fetch(Config.get('apiUrlBase') + '/vencimientos/' + data.id, {
													method: 'DELETE',
													headers: {
														'Accept': 'application/json',
														'Content-Type': 'application/json',
														'Authorization-Token': localStorage.getItem("token")
													}
												})
												.then(function(response) {
													component.table.ajax.reload(null, false);
													swal("Eliminado!", "", "success");
												})
												.catch(function(error) {
													swal("Error", "", "error");
												});
										}
									});
							}
						});
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
														<h2>Listado de Vencimientos</h2>
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
				}, ]
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

	getData(service) {
		let serviceURL = Config.get('apiUrlBase') + service;
		return fetch(serviceURL, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization-Token': localStorage.getItem("token")
			}
		})
		.then(response => {
			return this.ajaxHandler.handleResponseErrorsIsValid(response) ? response.json() : null;
		});
	}
}

export default VencimientosGrid;