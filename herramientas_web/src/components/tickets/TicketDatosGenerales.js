import React, { Component } from 'react'
import Switch from "react-switch"
import AjaxHandler from '../../commons/ajax/AjaxHandler.js'
import Security from '../../commons/security/Security.js'
import $ from 'jquery'
import TicketHistorico from './TicketHistorico.js';
import TicketTareas from './TicketTareas.js';
import OtrosTickets from './OtrosTickets.js';
import TicketInformarFechaRealizado from './TicketInformarFechaRealizado.js';
import MovilesAbm from './../moviles/MovilesAbm.js';
import PersonasAbm from './../personas/PersonasAbm.js';
import TicketsAbm from './TicketsAbm.js';
import moment from 'moment'
import 'moment/min/locales'

class TicketDatosGenerales extends Component {
	constructor(props) {
    super(props);
    this.props = props;
    this.ajaxHandler = new AjaxHandler();

    if(props.ticket) {
      this.ticket = props.ticket;
    }

    moment.locale('es');

    this.state = {
      propsMatch: null,
      modalInformacion: 0,
      modalHistorico: 0,
      ticketPropsMatch: null,
      modalVerOtrosTickets: 0,
      modalFechaRealizadoKey: 0
    }
  }

  handleAutogestionChange (){}
  handleForzadoChange (){}

  componentWillMount() {
    this.props.onRef(this);
    this.init();
  }

  componentDidMount() {
    $('[data-tooltip="tooltip"]').tooltip({ trigger: "hover" });
  }

  componentWillUnmount() {
    $('[data-tooltip="tooltip"]').remove();
    this.props.onRef(undefined);
    this.ajaxHandler.unsubscribe();
  }

  init() {
    this.ajaxHandler.subscribe(this);
    let modalInformacion = this.state.modalInformacion + 1;
    let modalHistorico = this.state.modalHistorico + 1;
    let entidad = this.props.ticket.movil ? "moviles" : "personas";
    let id = this.props.ticket.movil ? this.props.ticket.movil.id : this.props.ticket.persona.id;

    this.setState({
      modalInformacion: modalInformacion,
      modalHistorico: modalHistorico,
      propsMatch: {
        isExact: true,
        params: {
          id: id
        },
        path: "/" + entidad + "/:" + id,
        url: "/" + entidad + "/" + id
      }
    });
  }

  handleCallbackOtrosTickets(id){
    let modalVerOtrosTickets = this.state.modalVerOtrosTickets + 1;
    this.setState({
      modalVerOtrosTickets: modalVerOtrosTickets,
      ticketPropsMatch: {
        isExact: true,
        params: {
          id: id
        },
        path: "/tickets/:" + id,
        url: "/tickets/" + id
      },
    }, () => {
      $('#ver_otros_tickets_modal').modal({backdrop: 'static'});
    });
  }

  handleFechaRealizadoOpen(e) {
    e.preventDefault();
    let modalFechaRealizadoKey = this.state.modalFechaRealizadoKey + 1;
    this.setState({
      modalFechaRealizadoKey: modalFechaRealizadoKey
    }, () => {
      $('#fecha_realizado_modal').modal({backdrop: 'static'});
    });
  }


  handleFechaRealizadoSave(obj) {
    console.log(obj);
    $('#fecha_realizado_modal').modal('toggle');
    this.ajaxHandler.fetch('/tickets/update-realizado/' + this.props.ticket.id, {
      method: 'POST',
      body: JSON.stringify({
        ...obj
      }),
    }).then(response => {
      if(response.status === 204) {
        this.props.callbackDataUpdate();
      } else {
        response.json()
        .then(data => {
          this.setState({
            errors: data.detalle
          });
        });
      }
      window.scrollTo(0,0);
    }).catch((error) => {
      this.ajaxHandler.handleError(error);
    });
  }

  handleFechaRealizadoClose() {
    $('#fecha_realizado_modal').modal('toggle');
  }


  handleVerInformacion(e) {
    e.preventDefault();
    let modalInformacion = this.state.modalInformacion + 1;
    let modalHistorico = this.state.modalHistorico + 1;
    let entidad = this.props.ticket.movil ? "moviles" : "personas";
    let id = this.props.ticket.movil ? this.props.ticket.movil.id : this.props.ticket.persona.id;

    this.setState({
      modalInformacion: modalInformacion,
      modalHistorico: modalHistorico,
      propsMatch: {
        isExact: true,
        params: {
          id: id
        },
        path: "/" + entidad + "/:" + id,
        url: "/" + entidad + "/" + id
      }
    }, () => {
      $('#informacion_modal').modal({backdrop: 'static'});
    });
  }

	render() {
    if(this.props.ticket) {
      let ticket = this.props.ticket;
      return (
        <React.Fragment>
          <div className="card pull-up">
            <div className="card-content">
              <div className="card-body">
                <h4 className="form-section">
                  <i className="la la-info-circle"></i> Datos Generales
                </h4>
                <div className="float-right ticket-buttons">
                {Security.hasPermission('TICKETS_MODIFICAR_FECHA_REALIZADO') ? (
                  <a href="" className="btn btn-float-sm btn-round btn-fleet ml-1" data-tooltip="tooltip" data-placement="top" title="" data-original-title="Informar Fecha de Realizado" onClick={this.handleFechaRealizadoOpen.bind(this)}><i className="la la-calendar-check-o align-middle"></i></a>
                  ) : ''}
                  {Security.hasPermission('TICKETS_VER_HISTORIA') ? (
                  <a href="" className="btn btn-float-sm btn-round btn-fleet ml-1" data-tooltip="tooltip" data-placement="top" title="" data-original-title="Ver Historia" data-toggle="modal" data-target="#historico_modal"><i className="la la-history align-middle"></i></a>
                  ) : ''}
                  {Security.hasPermission('TICKETS_VER_OTROS_TICKETS') ? (
                  <a href="" className="btn btn-float-sm btn-round btn-fleet ml-1" data-tooltip="tooltip" data-placement="top" title="" data-original-title="Ver Otros Tickets" data-toggle="modal" data-target="#otros_tickets_modal"><i className="la la-ticket"></i></a>
                  ) : ''}
                  {Security.hasPermission('TICKETS_VER_INFORMACION') ? (
                  <a href="" className="btn btn-float-sm btn-round btn-fleet ml-1" data-tooltip="tooltip" data-placement="top" title="" data-original-title="Ver Información" onClick={this.handleVerInformacion.bind(this)}><i className="la la-info-circle"></i></a>
                  ) : ''}
                  {Security.hasPermission('TICKETS_VER_TAREAS') ? (
                  <a href="" className="btn btn-float-sm btn-round btn-fleet ml-1" data-tooltip="tooltip" data-placement="top" title="" data-original-title="Ver Tareas" data-toggle="modal" data-target="#tareas_modal"><i className="la la-tasks"></i></a>
                  ) : ''}
                </div>

                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group row">
                      <label className="col-md-4 label-control col-form-label">Base:</label>
                      <div className="col-md-8">
                        <div className="form-control-static col-form-label form-value">{ticket.movil ? (ticket.movil.base ? ticket.movil.base.descripcion : '') : (ticket.persona.base ? ticket.persona.base.descripcion : '')}</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="row">
                      <div className="col-md-7">
                        <div className="form-group row">
                          <label className="col-md-7 label-control col-form-label">Autogestión:</label>
                          <div className="col-md-5 mt-auto">
                            <Switch
                              onChange={this.handleAutogestionChange}
                              checked={ticket.autogestion ? ticket.autogestion : false }
                              id="autogestion"
                              name="autogestion"
                              disabled={true}
                              offColor="#FF4961"
                              onColor="#28D094"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-5">
                        <div className="form-group row">
                          <label className="col-md-6 label-control col-form-label pl-0 pr-0">Forzado:</label>
                          <div className="col-md-6 mt-auto">
                            <Switch
                              onChange={this.handleForzadoChange}
                              checked={ticket.forzado ? ticket.forzado : false }
                              id="forzado"
                              name="forzado"
                              disabled={true}
                              offColor="#FF4961"
                              onColor="#28D094"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group row">
                      <label className="col-md-4 label-control col-form-label">Fecha Realizado:</label>
                      <div className="col-md-8">
                        <div className="form-control-static col-form-label form-value">{ticket.fechaHoraRealizado ? moment(ticket.fechaHoraRealizado).format('L') : ''}</div>
                      </div>
                    </div>
                  </div>
                </div>
                { ticket.movil ? (
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group row">
                      <label className="col-md-4 label-control col-form-label">Km. Actual:</label>
                      <div className="col-md-8">
                        <div className="form-control-static col-form-label form-value">{ticket.movil.kmActual}</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group row">
                      <label className="col-md-4 label-control col-form-label">Km. Generado:</label>
                      <div className="col-md-8">
                        <div className="form-control-static col-form-label form-value">{ticket.kmGenerado}</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group row">
                      <label className="col-md-4 label-control col-form-label">Km. Realizado:</label>
                      <div className="col-md-8">
                        <div className="form-control-static col-form-label form-value">{ticket.kmRealizado}</div>
                      </div>
                    </div>
                  </div>
                </div>
                ) : null
                }
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group row ml-2">
                      <label className="col-md-1 label-control col-form-label">Detalle:</label>
                      <div className="col-md-11">
                        <div className="form-control-static col-form-label form-value">{ticket.detalle ? ticket.detalle : ''}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal fade" tabIndex="-1" id="historico_modal" role="dialog" aria-labelledby="myModalLabel1">
            <div className="modal-xl modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header bg-fleet">
                  <h4 className="modal-title text-white" id="myModalLabel1"><i className="la la-history align-middle icon-modal-title"></i>{' Histórico del Ticket: ' + this.ticket.id}</h4>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                </div>
                <div className="modal-body modal-grey modal-mh ovf-x-hidden">
                  {<TicketHistorico key={this.state.modalHistorico} ticket={ticket}></TicketHistorico>}
                </div>
                <div className="modal-footer modal-grey">
                  <button type="button" className="btn btn-default btn-fleet" data-dismiss="modal">Ok</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal fade" tabIndex="-1" id="otros_tickets_modal" role="dialog" aria-labelledby="myModalLabel2">
            <div className="modal-xl modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header bg-fleet">
                  <h4 className="modal-title text-white" id="myModalLabel2"><i className="la la-ticket align-middle icon-modal-title"></i>{'Tickets asociados a: ' + this.ticket.id}</h4>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                </div>
                <div className="modal-body modal-grey modal-mh ovf-x-hidden">
                  <div className="container-fluid">
                    {<OtrosTickets ticket={ticket} callback={this.handleCallbackOtrosTickets.bind(this)}></OtrosTickets>}
                  </div>
                </div>
                <div className="modal-footer modal-grey">
                  <button type="button" className="btn btn-default btn-fleet" data-dismiss="modal">Ok</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal fade" tabIndex="-1" id="informacion_modal" role="dialog" aria-labelledby="myModalLabel3">
            <div className="modal-xl modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header bg-fleet">
                  <h4 className="modal-title text-white" id="myModalLabel3"><i className="la la-info-circle align-middle icon-modal-title"></i>{'Información asociada al Ticket: ' + this.ticket.id}</h4>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                </div>
                <div className="modal-body modal-grey modal-mh ovf-x-hidden">
                {ticket.movil && (this.state.propsMatch !== null) ? (
                  <MovilesAbm key={this.state.modalInformacion} action="VIEW" match={this.state.propsMatch}></MovilesAbm>
                ) : (
                  <PersonasAbm key={this.state.modalInformacion} action="VIEW" match={this.state.propsMatch}></PersonasAbm>
                 // null
                )}
                </div>
                <div className="modal-footer modal-grey">
                  <button type="button" className="btn btn-default btn-fleet" data-dismiss="modal">Ok</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal fade" tabIndex="-1" id="tareas_modal" role="dialog" aria-labelledby="myModalLabel4">
            <div className="modal-xl modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header bg-fleet">
                  <h4 className="modal-title text-white" id="myModalLabel4"><i className="la la-tasks align-middle icon-modal-title"></i>{'Tareas del Ticket: ' + this.ticket.id}</h4>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                </div>
                <div className="modal-body modal-grey modal-mh ovf-x-hidden">
                  <div className="container-fluid">
                    {<TicketTareas ticket={this.ticket}></TicketTareas>}
                  </div>
                </div>
                <div className="modal-footer modal-grey">
                  <button type="button" className="btn btn-default btn-fleet" data-dismiss="modal">Ok</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal fade" tabIndex="-1" id="ver_otros_tickets_modal" role="dialog" aria-labelledby="myModalLabel5">
            <div className="modal-xl modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header bg-fleet">
                  <h4 className="modal-title text-white" id="myModalLabel5"><i className="la la-history align-middle icon-modal-title"></i>{'Ticket: ' + this.ticket.id}</h4>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                </div>
                <div className="modal-body modal-grey modal-mh ovf-x-hidden">
                <br/>
                { this.state.ticketPropsMatch !== null ? <TicketsAbm key={this.state.modalVerOtrosTickets} action="VIEW" match={this.state.ticketPropsMatch}></TicketsAbm> : ''}
                </div>
                <div className="modal-footer modal-grey">
                  <button type="button" className="btn btn-default btn-fleet" data-dismiss="modal">Ok</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal fade" tabIndex="-1" id="fecha_realizado_modal" role="dialog" aria-labelledby="myModalFechaRealiado">
            <div className="modal-xl modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header bg-fleet">
                  <h4 className="modal-title text-white" id="myModalFechaRealiado"><i className="la la-history align-middle icon-modal-title"></i>{' Cargar presupuesto para el ticket: ' + ticket.id}</h4>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                </div>
                <div className="modal-body modal-grey modal-mh ovf-x-hidden">
                  <TicketInformarFechaRealizado key={this.state.modalFechaRealizadoKey} ticket={ticket} callbackClose={this.handleFechaRealizadoClose.bind(this)} callbackSave={this.handleFechaRealizadoSave.bind(this)} ></TicketInformarFechaRealizado>
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      )
    } else {
      return null;
    }
  }
}

export default TicketDatosGenerales;