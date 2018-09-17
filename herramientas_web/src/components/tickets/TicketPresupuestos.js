import React, { Component } from 'react'
import Security from '../../commons/security/Security.js'
import TicketVerPresupuestos from './TicketVerPresupuestos.js'
import TicketCargarPresupuesto from './TicketCargarPresupuesto.js'
import $ from 'jquery'
import AjaxHandler from '../../commons/ajax/AjaxHandler.js'

class TicketPresupuestos extends Component {
	constructor(props) {
    super(props);
    this.props = props;
    this.ajaxHandler = new AjaxHandler();

    this.state = {
      modalCargarPresupuestoKey: 0
    }
  }

  componentDidMount() {
    this.ajaxHandler.subscribe(this);
  }

  componentWillMount() {
    this.props.onRef(this);
    this.init();
  }

  componentWillUnmount() {
    this.ajaxHandler.unsubscribe();
  }

  init() {

  }

  canDo(action) {
    return this.props.actions.indexOf(action) >= 0;
  }

  handleCargarPresupuestoSave() {
    let modalCargarPresupuestoKey = this.state.modalCargarPresupuestoKey + 1;
    this.setState({
      modalCargarPresupuestoKey: modalCargarPresupuestoKey
    });
    $('#cargar_presupuesto_modal').modal('toggle');
    this.props.callbackSave();
  }

  handleCargarPresupuestoClose() {
    let modalCargarPresupuestoKey = this.state.modalCargarPresupuestoKey + 1;
    this.setState({
      modalCargarPresupuestoKey: modalCargarPresupuestoKey
    });
    $('#cargar_presupuesto_modal').modal('toggle');
    this.props.callbackClose();
  }

  handleVerAdjunto(e) {
    this.ajaxHandler.fetch('/ticket-presupuestos/adjunto/' + this.props.ticket.adjunto, {
      method: 'GET',
      headers: {
        'Authorization-Token': localStorage.getItem("token")
      }
    }).then(response => {
      if (response.status === 200) {
        return response.blob();
      }
    }).then(fileBlob => {
      let fileUrl = URL.createObjectURL(fileBlob);
      window.open(fileUrl);
    }).catch(() => {
    });
    e.preventDefault();
  }

	render() {
    let ticket = this.props.ticket;
    if(ticket) {
      return (
        <div>
          <div className="card pull-up">
            <div className="card-content">
              <div className="card-body">
                <h4 className="form-section">
                  <i className="la la-file-text"></i> Presupuesto
                </h4>
                <div className="float-right ticket-buttons">
                  {ticket.adjunto ? (
                  <a href="" className="btn btn-float-sm btn-round btn-fleet ml-1" data-tooltip="tooltip" data-placement="top" title="" data-original-title="Ver Adjunto" onClick={e => this.handleVerAdjunto(e)}>
                    <i className="la la-paperclip align-middle"></i>
                  </a>
                  ) : ''}
                  {(this.canDo('PRESUPUESTAR') || this.canDo('PRESUPUESTAR_ADIC'))&& Security.hasPermission('TICKETS_CARGAR_PRESUPUESTO') && ticket && ticket.gerenciador ? (
                  <a href="" className="btn btn-float-sm btn-round btn-fleet ml-1" data-tooltip="tooltip" data-placement="top" title="" data-original-title="Cargar Presupuesto" data-toggle="modal" data-target="#cargar_presupuesto_modal">
                    <i className="la la-cloud-upload align-middle"></i>
                  </a>
                  ) : ''}
                  {Security.hasPermission('TICKETS_VER_PRESUPUESTOS') ? (
                  <a href="" className="btn btn-float-sm btn-round btn-fleet ml-1" data-tooltip="tooltip" data-placement="top" title="" data-original-title="Ver Presupuestos" data-toggle="modal" data-target="#ver_presupuestos_modal">
                    <i className="la la-list align-middle"></i>
                  </a>
                  ) : ''}
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group row">
                      <label className="col-md-6 label-control col-form-label">Mano de Obra:</label>
                      <div className="col-md-6">
                        <div className="form-control-static col-form-label form-value text-right pr-1">{ticket.manoDeObra ? parseFloat(ticket.manoDeObra).toFixed(2) : ''}</div>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-md-6 label-control col-form-label">Repuestos:</label>
                      <div className="col-md-6">
                        <div className="form-control-static col-form-label form-value text-right pr-1">{ticket.repuestos ? parseFloat(ticket.repuestos).toFixed(2) : ''}</div>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-md-6 label-control col-form-label">Total:</label>
                      <div className="col-md-6">
                        <div className="form-control-static col-form-label form-value text-right pr-1">{(ticket.manoDeObra && ticket.repuestos) ? parseFloat(ticket.manoDeObra + ticket.repuestos).toFixed(2) : ''}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal fade" tabIndex="-1" id="cargar_presupuesto_modal" role="dialog" aria-labelledby="myModalLabel1">
            <div className="modal-xl modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header bg-fleet">
                  <h4 className="modal-title text-white" id="myModalLabel1"><i className="la la-history align-middle icon-modal-title"></i>{' Cargar presupuesto para el ticket: ' + ticket.id}</h4>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                </div>
                <div className="modal-body modal-grey modal-mh ovf-x-hidden">
                  <TicketCargarPresupuesto key={this.state.modalCargarPresupuestoKey} ticket={ticket} callbackClose={this.handleCargarPresupuestoClose.bind(this)} callbackSave={this.handleCargarPresupuestoSave.bind(this)} ></TicketCargarPresupuesto>
                </div>
              </div>
            </div>
          </div>
          <div className="modal fade" tabIndex="-1" id="ver_presupuestos_modal" role="dialog" aria-labelledby="myModalLabel2">
            <div className="modal-xl modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header bg-fleet">
                  <h4 className="modal-title text-white" id="myModalLabel2"><i className="la la-history align-middle icon-modal-title"></i>{' Ver Presupuestos del Ticket: ' + ticket.id}</h4>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                </div>
                <div className="modal-body modal-grey modal-mh ovf-x-hidden">
                  <TicketVerPresupuestos key={this.state.modalCargarPresupuestoKey * 17} ticket={ticket}></TicketVerPresupuestos>
                </div>
                <div className="modal-footer modal-grey">
                  <button type="button" className="btn btn-default btn-fleet" data-dismiss="modal">Ok</button>
                </div>
              </div>
            </div>
          </div>
        </div>

      )
    } else {
      return null;
    }
  }
}

export default TicketPresupuestos;