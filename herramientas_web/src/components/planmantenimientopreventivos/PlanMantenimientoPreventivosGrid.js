import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
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
import Config from '../../commons/config/Config.js'
import swal from 'sweetalert'
import jzip from 'xlsx/dist/jszip'
import 'xlsx/dist/xlsx.full.min.js'
import LogoCompany from '../../assets/images/logo-company.png'
import LogoVecFleet from '../../assets/images/logo-vecfleet.png'

$.DataTable = DataTable;
window.JSZip = jzip;
var pdfMake = require('pdfmake/build/pdfmake.js');
var pdfFonts = require('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;


class PlanMatenimientoPreventivosGrid extends Component {
	constructor(props) {
		super(props);
        this.dataService = '/plan-mantenimiento-preventivos/grid';
		this.apiBaseUrl = process.env.REACT_APP_VEC_FLEET_API_BASE_URL;

		this.state = {
			redirectTo: null
		}
	}

	componentDidMount(nextProps, nextState) {
		let component = this;
		let filters = null;
		this.table = $(this.refs.grid).DataTable(
			Object.assign({
				dom: '<t><"row mt-2"<"col-4" l><"col-4 text-center" i><"col-4" p>>',
				stateSave: true,
				stateSaveCallback: function(settings,data) {
					localStorage.setItem( 'DataTables_' + component.constructor.name, JSON.stringify(data) );
				},
				stateLoadCallback: function(settings) {
					return JSON.parse( localStorage.getItem( 'DataTables_' + component.constructor.name ) );
				},
				serverSide: true,
				ajax: {
					type: 'GET',
					url: Config.get('apiUrlBase') + this.dataService,
					
					headers: {
						'Authorization-Token': localStorage.getItem("token")
					},
					dataSrc: function (response) {
						return response.data;
					},
					error: function (xhr, error, thrown) {
					},
					cache: false
				},
				initComplete: function (settings) {
					let stateColumns = JSON.parse(localStorage.getItem('DataTables_' + component.constructor.name)).columns;

					var sets = settings;
					var index = 0;

					this.api().columns().every( function () {
						var column = this;

						if(sets.aoColumns[index].filterType){
							if(sets.aoColumns[index].filterType === 'select') {
								var select = $('<select class="btn-dt-filter" required><option value="" selected>Buscar...</option></select>')
									.appendTo( $(column.footer()).empty() )
									.on( 'change', function () {
										var val = $.fn.dataTable.util.escapeRegex($(this).val());
										column
											.search( val ? val : '', true, false )
											.draw();
									});								
								if(filters && sets.aoColumns[index].name && filters[sets.aoColumns[index].name]) {
									filters[sets.aoColumns[index].name].map(e => {
										select.append('<option value="'+e.value+'">'+e.label+'</option>');
										return true;
									});
								} else {
									column.data().unique().sort().each( function ( d, j ) {
										select.append( '<option value="'+d+'">'+d+'</option>' );
									});
								}
								if(stateColumns[index].search.search) select.val(stateColumns[index].search.search);
							}
							if(sets.aoColumns[index].filterType === 'input') {
								var input = $('<input type="text" class="btn-dt-filter" placeholder="Buscar..." />');
								if(stateColumns[index].search.search) input.val(stateColumns[index].search.search);
								input.appendTo($(column.footer()).empty());
								input.on( 'keyup change', function () {
									if ( column.search() !== this.value ) {
										column
										.search( this.value )
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
				columns: [
					{
						orderable: false,
						title: '',
						data: 'nombre',
						
						render: function (data, type, row) {
							return '<div class="dt-user-avatar">'+row.descripcion.substr(0,1).toUpperCase()+'</div>';
						},
						filterType: 'none'
					},{
							
							title: '',
							data: 'activo',
							width: 3,
							padding: 0,
							orderable: false,
							className: 'p-0',
							render: function (data, type, full, meta) {
								return '';
							},
							createdCell: function (td, cellData, rowData, row, col) {
								if (cellData) {
									$(td).addClass('status-green');
								} else {
									$(td).addClass('status-red');
								}
							},
							filterType: 'none'
					},{
							title: 'Plan',
							data: 'descripcion',
							filterType: 'input'
					},{
							title: 'Umbral',
							data: 'umbral',
							filterType: 'input'
							
					},{
							orderable: false,
							data: null,
							className: "text-center",
							width: '120px',
							render: function (data, type, full, meta) {
								return `
									<button class="action view btn btn-sm btn-icon btn-dt-grid text-success" title="Ver">
										<i class="fa fa-search fa-xs"></i>
									</button>
									<button class="action edit btn btn-sm btn-icon btn-dt-grid text-success" title="Editar">
										<i class="fa fa-pencil fa-xs"></i>
									</button>
									<button class="action delete btn btn-sm btn-icon btn-dt-grid text-danger" title="Eliminar">
										<i class="fa fa-trash fa-xs"></i>
									</button>
													`;
							}
					}],
					drawCallback: function () {
						$(this).find('.action').on('click', function () {
							let data = component.table.row($(this).parents('tr')).data();
							let redirectTo;
							if($(this).hasClass('view')) redirectTo = component.props.match.url + '/' + data.id;
							if($(this).hasClass('edit')) redirectTo = component.props.match.url + '/' + data.id + '/edit';
							component.setState({
								redirectTo: redirectTo
							});

							if($(this).hasClass('delete')) {
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
									fetch(Config.get('apiUrlBase') + '/regiones/' + data.id, {
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
					},
			}, datatablesConfig)
		);

		new $.fn.dataTable.Buttons( this.table, {
			buttons: [
				{
          extend: 'print',
          text: '<i class="ft-printer"></i>',
					title: '',
					customize: function(win)
					{
						var css = '@page { size: landscape; }',
							head = win.document.head || win.document.getElementsByTagName('head')[0],
							style = win.document.createElement('style');

						style.type = 'text/css';
						style.media = 'print';

						if (style.styleSheet) {
							style.styleSheet.cssText = css;
						}	else {
							style.appendChild(win.document.createTextNode(css));
						}

						head.appendChild(style);

						$(win.document.body)
							.css( 'font-size', '10pt' )
							.prepend(`<div class="container">
													<div class="row mb-2">
														<div class="col-6">
															<img style="height: 35px" src="`+LogoCompany+`" />
														</div>
														<div class="col-6	text-right">
															<img style="height: 40px" src="`+LogoVecFleet+`" />
														</div>
													</div>
													<div class="row mb-2">
														<div class="col-12" style="border-bottom: 1px solid #000;">
															<h2>Listado de Regiones</h2>
														</div>
													</div>
												</div>`);

						$(win.document.body).find( 'table' )
							.addClass( 'compact' )
							.css( 'font-size', 'inherit' );
			 		},
          exportOptions: {
              columns: [ 3,4,5,6 ]
          },
					titleAttr: 'Imprimir'
        },
        {
          extend: 'colvis',
					text: '<i class="la la-columns"></i>',
					titleAttr: 'Seleccionar columnas'
        },
        {
          extend: 'collection',
					text: '<i class="ft-download"></i>',
					titleAttr: 'Exportar',
          buttons: [
          {
            extend: 'copyHtml5',
            exportOptions: {
              columns: ':visible'
            },
						text: 'Copiar',
						titleAttr: 'Copiar'
          },
          {
            extend: 'excelHtml5',
            exportOptions: {
              columns: ':visible'
						},
						titleAttr: 'Exportar a Excel'
          },
          {
            extend: 'csvHtml5',
            exportOptions: {
              columns: ':visible'
						},
						titleAttr: 'Exportar en formato .csv'
          },
          {
            extend: 'pdfHtml5',
            exportOptions: {
              columns: ':visible'
						},
						titleAttr: 'Exportar a PDF'
					}
					]
				},
				{
					text: '<i class="ft-upload"></i>',
					titleAttr: 'Importar'
        },
			]
		});

		this.table.buttons( 0, null ).container().appendTo('#buttons');

		$('#dataTable tfoot th').each( function () {
			var title = $(this).text();
			if(title !== '') $(this).html( '<input type="text" class="btn-dt-filter" placeholder="Buscar ..." />' );
		});

		this.table.columns([3]).every( function () {
			var that = this;
			$( 'input', this.footer()).on( 'keyup change', function () {
				if ( that.search() !== this.value ) {
					that
						.search( this.value )
						.draw()
						.ajax.reload(null, false);
				}
			});
			return null;
		});
	}

	handleNewBase(event) {
		this.setState({
			redirectTo: this.props.match.url + '/add'
		});
	}

	componentWillUnmount() {
		if(this.table) this.table.destroy();
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
													<div className="btn btn-primary box-shadow-2 btn-round btn-lg btn-dt-main round-icon" onClick={this.handleNewBase.bind(this)}>
														<i className="ft-plus"></i>
													</div>
												</div>
												<div className="col-6" id="buttons"></div>
											</div>
										</div>
			    					<table id="dataTable" className="table nowrap server-side table-hover" ref="grid" width="100%">
											<tfoot>
												<tr style={{backgroundColor: '#fff'}}>
													
													<th className=""></th>
													<th className="p-0"></th>
													<th className="dt-search-header">Plan</th>
													<th className="dt-search-header">Umbral</th>
													
													<th className=""></th>
												</tr>
											</tfoot>
										</table>
									</div>
								</div>
							</div>
						</div>
					</div>
	    	</React.Fragment>
	    );
  	}
}

export default PlanMatenimientoPreventivosGrid;
