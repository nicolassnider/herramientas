import React, { Component } from 'react'
import Security from '../../commons/security/Security.js'
import Switch from "react-switch"
import TicketModificarAsignacion from './TicketModificarAsignacion.js'
import $ from 'jquery'
import moment from 'moment'
import 'moment/min/locales'

class TicketAsignacion extends Component {
	constructor(props) {
    super(props);
    this.props = props;
    moment.locale('es');

    this.state = {
      modalModificarAsignacionKey: 0
    }
  }

  componentWillMount() {
    this.props.onRef(this);
    this.init();
  }

  init() {}

  canDo(action) {
    return this.props.actions.indexOf(action) >= 0;
  }

  handleModificarAsigacionSave () {
    let modalModificarAsignacionKey = this.state.modalModificarAsignacionKey + 1;
    this.setState({
      modalModificarAsignacionKey: modalModificarAsignacionKey
    });
    $('#modificar_asignacion_modal').modal('toggle');
    this.props.callbackSave();
  }

  handleModificarAsigacionClose () {
    let modalModificarAsignacionKey = this.state.modalModificarAsignacionKey + 1;
    this.setState({
      modalModificarAsignacionKey: modalModificarAsignacionKey
    });
    $('#modificar_asignacion_modal').modal('toggle');
    this.props.callbackClose();
  }

  handleEnTallerChange() {}

	render() {
    if(this.props.ticket) {
      return (
        <div>
          <div className="card pull-up">
            <div className="card-content">
              <div className="card-body">
                <h4 className="form-section">
                  <i className="ft-user-check"></i> Asignación
                </h4>
                {Security.hasPermission('TICKETS_MODIFICAR_ASIGNACION') ? (
                <div className="float-right ticket-buttons">
                  <a href="" className="btn btn-float-sm btn-round btn-fleet ml-1" data-tooltip="tooltip" data-placement="top" title="" data-original-title="Modificar" data-toggle="modal" data-target="#modificar_asignacion_modal">
                    <i className="la la-pencil align-middle"></i>
                  </a>
                </div>
                ) : ''}

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group row">
                      <label className="col-md-5 label-control col-form-label">Gerenciador:</label>
                      <div className="col-md-7">
                        <div className="form-control-static col-form-label form-value">{this.props.ticket.gerenciador ? this.props.ticket.gerenciador.razonSocial : ''}</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group row">
                      <label className="col-md-5 label-control col-form-label">Taller:</label>
                      <div className="col-md-7">
                        <div className="form-control-static col-form-label form-value">{this.props.ticket && this.props.ticket.taller ? this.props.ticket.taller.razonSocial : ''}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group row">
                      <label className="col-md-5 label-control col-form-label">Turno:</label>
                      <div className="col-md-7">
                        <div className="form-control-static col-form-label form-value">{this.props.ticket.fechaHoraTurno ? moment(this.props.ticket.fechaHoraTurno).format('L') : ''}</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group row">
                      <label className="col-md-5 label-control col-form-label">En Taller:</label>
                      <div className="col-md-7 mt-auto">
                        <Switch
                          onChange={this.handleEnTallerChange}
                          checked={this.props.ticket.enTaller ? this.props.ticket.enTaller: false }
                          id="enTaller"
                          name="enTaller"
                          disabled={true}
                          offColor="#FF4961"
                          onColor="#28D094"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group row">
                      <label className="col-md-2 label-control col-form-label pr-4" style={{whiteSpace:'nowrap'}}>Observaciones:</label>
                      <div className="col-md-10 pl-3">
                        <div className="form-control-static col-form-label form-value">{this.props.ticket.observacionesTaller}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal fade" tabIndex="-1" id="modificar_asignacion_modal" role="dialog" aria-labelledby="myModalLabel1">
            <div className="modal-xl modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header bg-fleet">
                  <h4 className="modal-title text-white" id="myModalLabel1"><i className="la la-history align-middle icon-modal-title"></i>{' Modificar asignación para el ticket: ' + this.props.ticket.id}</h4>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                </div>
                <div className="modal-body modal-grey modal-mh ovf-x-hidden">
                  <TicketModificarAsignacion key={this.state.modalModificarAsignacionKey} ticket={this.props.ticket} callbackClose={this.handleModificarAsigacionClose.bind(this)} callbackSave={this.handleModificarAsigacionSave.bind(this)} ></TicketModificarAsignacion>
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

export default TicketAsignacion;