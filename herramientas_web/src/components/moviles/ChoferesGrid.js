import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import Config from '../../commons/config/Config.js'
import Security from '../../commons/security/Security.js'
import AjaxHandler from '../../commons/ajax/AjaxHandler.js'
import $ from 'jquery'
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
import LogoCompany from '../../assets/images/logo-company-login-tc-print.png'
import LogoVecFleet from '../../assets/images/logo-vecfleet.png'

$.DataTable = DataTable;
window.JSZip = jzip;
var pdfMake = require('pdfmake/build/pdfmake.js');
var pdfFonts = require('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;

class ChoferesGrid extends Component {
	constructor(props) {
		super(props);

		this.ajaxHandler = new AjaxHandler();

		this.dataService = '/moviles/' + this.props.movilId + '/choferes/grid';
		this.columnsToPrint = [0,1,2,3,4,5];

		this.state = {
			redirectTo: null
		}
	}

	componentDidMount(nextProps, nextState) {
		if(Security.hasPermission('MOVILES_CHOFERES_HISTORICO_LISTAR')) {
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

	render() {
		return (
			<React.Fragment>
				{this.state.redirectTo && <Redirect push to={this.state.redirectTo} />}
				<div className="row mt-2">
					<div className="col-12">
						<div className="container-fluid">
							<div className="row dt-icons">
								<div className="col-6">
								</div>
								<div className="col-6" id="buttons"></div>
							</div>
						</div>
						<div className="table-responsive">
							<table id="dataTable" className="table nowrap server-side table-hover" ref="grid" width="100%">
								<tfoot>
									<tr style={{backgroundColor: '#fff'}}>
										<th className="dt-search-header"></th>
										<th className="dt-search-header"></th>
										<th className="dt-search-header"></th>
										<th className="dt-search-header"></th>
										<th className="dt-search-header"></th>
										<th className="dt-search-header"></th>
									</tr>
								</tfoot>
							</table>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}

	initGrid() {
		try{
			let filters = null;
			let component = this;

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
						error: function(xhr, error, thrown) {
							this.ajaxHandler.handleResponseErrorsIsValid(xhr)
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

						$('tfoot tr').appendTo('#dataTable > thead');
					},
					columns: [{
						title: 'Fecha',
						className: 'all',
						data: 'fechaHoraModificacion',
						filterType: 'input'
					}, {
						title: 'Responsable 1',
						className: 'all',
						data: 'responsable1',
						render: function(data, type, row) {
							return data && data.nombreApellido ? data.nombreApellido : '';
						},
						filterType: 'input'
					}, {
						title: 'Responsable 2',
						className: 'all',
						data: 'responsable2',
						render: function(data, type, row) {
							return data && data.nombreApellido ? data.nombreApellido : '';
						},
						filterType: 'input'
					}, {
						title: 'Supervisor',
						className: 'all',
						data: 'supervisor',
						render: function(data, type, row) {
							return data && data.nombreApellido ? data.nombreApellido : '';
						},
						filterType: 'input'
					}, {
						title: 'Temporal',
						className: 'all',
						data: 'temporal',
						render: function(data, type, row) {
							return data && data.nombreApellido ? data.nombreApellido : '';
						},
						filterType: 'input'
					},{
						title: 'Usuario',
						className: 'all',
						data: 'usuarioModificacion',
						render: function(data, type, row) {
							return data && data.nombreApellido ? data.nombreApellido : '';
						},
						filterType: 'input'
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
														<img style="height: 45px" src="` + LogoCompany + `" />
													</div>
													<div class="col-6	text-right">
														<img style="height: 40px" src="` + LogoVecFleet + `" />
													</div>
												</div>
												<div class="row mb-2">
													<div class="col-12" style="border-bottom: 1px solid #000;">
														<h2>Listado de Personas</h2>
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
		}
		catch(error) {
			AjaxHandler.handleError(error);
		}
		finally{
			this.setState({
				loading: false
			});
		}
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
			return AjaxHandler.handleResponseErrorsIsValid(response) ? response.json() : null;
		});
	}
}

export default ChoferesGrid;