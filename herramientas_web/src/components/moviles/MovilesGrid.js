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
import ConfigBusiness from '../../commons/config/ConfigBusiness.js'
import swal from 'sweetalert'

$.DataTable = DataTable;
window.JSZip = jzip;
var pdfMake = require('pdfmake/build/pdfmake.js');
var pdfFonts = require('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;


class MovilesGrid extends Component {
	constructor(props) {
		super(props);

		this.ajaxHandler = new AjaxHandler();

		this.dataService = '/moviles/grid';
		this.columnsToPrint = [2,3,4,5,7];
		moment.locale('es');

		this.state = {
			redirectTo: null,
			editKmEnabled: false,
			maxDifferenceKM: 0
		}
	}

	componentDidMount(nextProps, nextState) {
		if(Security.hasPermission('MOVILES_LISTAR')) {
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
												{Security.renderIfHasPermission('MOVILES_CREAR', (
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
													<th className=""></th>
													<th className="p-0"></th>
													<th className="dt-search-header"></th>
													<th className="dt-search-header"></th>
													<th className="dt-search-header"></th>
													<th className="dt-search-header"></th>
													<th className="dt-search-header"></th>
													<th className=""></th>
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
			this.getData('/marcas/select'),
			this.getData('/bases/select-filtered-by-user'),
			ConfigBusiness.get('moviles.editaKm.habilitado') === 'true' ? true : false,
			ConfigBusiness.get('moviles.editaKm.habilitado') === 'true' ? ConfigBusiness.get('moviles.editaKm.maximo') : 0
		]).then((data) => {
			let filters = {
				marca: data[0] ? data[0] : [],
				base: data[1] ? data[1] : []
			};
			component.setState({
				editKmEnabled: data[2],
				maxDifferenceKM: data[3]
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
					ajax: {
						type: 'GET',
						url: Config.get('apiUrlBase') + this.dataService,
						headers: {
							'Authorization-Token': localStorage.getItem("token")
						},
						dataSrc: function(response) {
							return response.data;
						},
						error: function(xhr, error, thrown) {},
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
						title: '',
						className: 'all',
						defaultContent: '',
						orderable: false,
						render: function(data, type, full, meta) {
							if(full.marca && full.marca.nombre) {
								return '<div id="avatar" data-placement="top" data-toggle="tooltip" title="' + full.marca.nombre + '"></div>';
							} else {
								return '<div id="avatar"></div>';
							}
						},
						createdCell: function(td, cellData, rowData, row, col) {
							$(td).find('div').tooltip();
						},
						filterType: 'none'
					}, {
						title: '',
						data: 'activo',
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
							$(td).attr('title', cellData ? 'Activo' : 'Inactivo');
							$(td).tooltip();
							if (cellData) {
								$(td).addClass('status-green');
							} else {
								$(td).addClass('status-red');
							}
						},
						filterType: 'none'
					}, {
						title: 'Dominio',
						className: 'all',
						data: 'dominio',
						filterType: 'input'
					}, {
						name: 'marca',
						title: 'Marca',
						className: 'all',
						data: 'marca',
						render: function(data, type, row) {
							if (type === 'filter') {
								return data && data.id ? data.id : '';
							} else {
								return data && data.nombre ? data.nombre : '';
							}
						},
						filterType: 'select'
					}, {
						name: 'modelo',
						title: 'Modelo',
						className: 'all',
						data: 'modelo',
						render: function(data, type, row) {
							return data && data.nombre ? data.nombre : '';
						},
						filterType: 'input'
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
						title: '',
						className: 'all',
						defaultContent: '',
						render: function(data, type, full, meta) {
							return full.persona ? '<div class="text-center success dt-info-icon"><i class="la la-clock-o" data-html="true" data-placement="top" data-toggle="tooltip" title="Ult. actualización KM: ' + moment(full.fechaHoraActualizacionKM).format('L') + ' <br/>Usuario: ' + full.persona.nombre + ' ' + full.persona.apellido + '"></i></div>' : '';
						},
						createdCell: function(td, cellData, rowData, row, col) {
							$(td).find('div > i').tooltip();
						},
						orderable: false,
						filterType: 'none'
					}, {
						title: 'KM',
						className: 'all',
						data: 'km',
						filterType: 'input',
						render: function(data, type, full, meta) {
							return data === 0 ? data + ' km' : data + ' kms';
						}
					}, {
						visible: component.state.editKmEnabled,
						title: 'Actualizar KM',
						data: '',
						className: 'all',
						render: function (data, type, full, meta) {
							return `
								<div class="dt-input-holder">
									<input
										type="text"
										class="dt-input-grid input-km"
										id="dt_input_` + full.id + `"
										data-id="` + full.id + `"
										name="dt_input_` + full.id + `"
										value=""
										size="10"
									/>
								</div>
							`;
						},
						filterType: 'none',
						orderable: false
					}, {
						orderable: false,
						data: null,
						className: "text-center all",
						width: '120px',
						render: function(data, type, full, meta) {
							let html =
								(Security.hasPermission('MOVILES_VISUALIZAR') ? `
								<button class="action view btn btn-sm btn-icon btn-dt-grid text-success" data-title="Ver" data-togle="tooltip" data-placement="top">
									<i class="fa fa-search fa-xs"></i>
								</button>` : '') +
								(Security.hasPermission('MOVILES_MODIFICAR') ? `
								<button class="action edit btn btn-sm btn-icon btn-dt-grid text-success" data-title="Editar" data-togle="tooltip" data-placement="top">
									<i class="fa fa-pencil fa-xs"></i>
								</button>` : '') +
								(Security.hasPermission('VENCIMIENTOS_VISUALIZAR') ? `
								<button class="action view btn btn-sm btn-icon btn-dt-grid text-success" data-title="Ver Mantenimientos y Vencimintos" data-togle="tooltip" data-placement="top">
									<i class="ft ft-clipboard"></i>
								</button>` : '') +
								(Security.hasPermission('MANTENIMIENTOS_CORRECTIVOS_CREAR') ? `
								<button class="action correctivo btn btn-sm btn-icon btn-dt-grid text-success" data-title="Crear Nuevo Mantenimiento Correctivo" data-togle="tooltip" data-placement="top">
									<i class="fa fa-wrench fa-xs"></i>
								</button>` : '') +
								(Security.hasPermission('VENCIMIENTOS_CREAR') ? `
								<button class="action view btn btn-sm btn-icon btn-dt-grid text-success" data-title="Crear Nuevo Vencimiento" data-togle="tooltip" data-placement="top">
									<i class="fa fa-calendar-plus-o fa-xs"></i>
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
							if ($(this).hasClass('correctivo')) redirectTo = '/correctivos/add/movil/' + data.id + '/' + data.dominio;
							component.setState({
								redirectTo: redirectTo
							});
						});
					},
					rowCallback: function(row, data) {
						if (data.marca) {
							if (data.marca.foto) {
								let photoUrl = Config.get('apiUrlBase') + '/marcas/foto/' + data.marca.foto;
								fetch(photoUrl, {
									method: 'GET',
									headers: {
										'Authorization-Token': localStorage.getItem("token")
									}
								}).then(response => {
									if (response.status === 200) {
										return response.blob();
									} else {
										$('#avatar', row).addClass('dt-user-avatar');
										$('#avatar', row).html(data.marca.nombre.substr(0, 2).toUpperCase());
									}
								}).then(imgBlob => {
									$('#avatar', row).addClass('dt-user-avatar-image');
									$('#avatar', row).css('background-image', 'url(' + URL.createObjectURL(imgBlob) + ')');
								}).catch(() => {
									$('#avatar', row).addClass('dt-user-avatar');
									$('#avatar', row).html(data.marca.nombre.substr(0, 2).toUpperCase());
								});
							} else {
								$('#avatar', row).addClass('dt-user-avatar');
								$('#avatar', row).html(data.marca.nombre.substr(0, 2).toUpperCase());
							}
						} else {
							$('#avatar', row).addClass('dt-user-avatar');
							$('#avatar', row).html('');
						}

						$('.input-km', row).change(function() {
							var input = this;
							var value = this.value;
							var maxDif = component.state.maxDifferenceKM;
							var kmActual = data.km;
							if(Math.abs(value - kmActual) > maxDif) {
								swal({
									title: "Diferencia de Km mayor a " + maxDif + " Km. Esta seguro que desea actualizar?",
									text: "",
									icon: "warning",
									showCancelButton: true,
									buttons: {
										confirm: {
											text: "Aceptar",
											value: true,
											visible: true,
											className: "btn btn-success",
											closeModal: false
										},
										cancel: {
											text: "Cancelar",
											value: null,
											visible: true,
											className: "btn btn-danger",
											closeModal: false,
										}
									}
								}).then(isConfirm => {
									if (isConfirm) {
										$.ajax({
											type: 'PUT',
											url: Config.get('apiUrlBase') + '/moviles/' + data.id + '/km',
											data: '{ "km": ' + value + '}',
											contentType: "application/json; charset=utf-8",
											headers: {
												'Authorization-Token': localStorage.getItem("token")
											},
											dataType: "json",
											success: function(result){
												component.table.cell(row,7).data(value);
												input.value = '';
												swal("Se actualizó con Éxito!", "", "success");
											}
										});
									} else {
										swal("Actualización Cancelada!", "", "error");
									}
									input.value = '';
								});
							} else {
								$.ajax({
									type: 'PUT',
									url: Config.get('apiUrlBase') + '/moviles/' + data.id + '/km',
									data: '{ "km": ' + value + '}',
									contentType: "application/json; charset=utf-8",
									headers: {
										'Authorization-Token': localStorage.getItem("token")
									},
									dataType: "json",
									success: function(result){
										component.table.cell(row,7).data(value);
										input.value = '';
										swal("Se actualizó con Éxito!", " ", "success");
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
														<h2>Listado de Móviles</h2>
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
			this.ajaxHandler.handleError(error);
		}).finally(() => {
			this.setState({
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

export default MovilesGrid;