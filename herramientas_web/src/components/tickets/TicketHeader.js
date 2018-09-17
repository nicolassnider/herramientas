import React, { Component } from 'react'
import AjaxHandler from '../../commons/ajax/AjaxHandler.js'
import Security from '../../commons/security/Security.js'
import Config from '../../commons/config/Config.js'
import TicketDatosCierreVencimiento from './TicketDatosCierreVencimiento.js'
import moment from 'moment'
import 'moment/min/locales'
import $ from 'jquery'
import swal from 'sweetalert2'

class TicketHeader extends Component {
	constructor(props) {
    super(props);
    this.props = props;
    this.ajaxHandler = new AjaxHandler();

    moment.locale('es');

    this.state = {
      fotoMarcaUrl: null,
      comentarioCancelacion: 'test',
      fechaCancelacion: null,
      modalDatosCierreVencimientoKey: 0,
      errors: []
    }
  }

  componentWillMount() {
    this.props.onRef(this);
    this.init();
  }

  componentDidMount() {
    $('[data-tooltip="tooltip"]').tooltip({ trigger: "hover" });
  }

  init() {
    this.ajaxHandler.subscribe(this);
    let ticket = this.props.ticket;
    if (ticket && ticket.movil && ticket.movil.marca && ticket.movil.marca.foto) {
      let component = this;
      let photoUrl = Config.get('apiUrlBase') + '/marcas/foto/' + ticket.movil.marca.foto;
      fetch(photoUrl, {
        method: 'GET',
        headers: {
          'Authorization-Token': localStorage.getItem("token")
        }
      }).then(response => {
        if (response.status === 200) {
          response.blob().then(imageBlob => {
            component.setState({
              fotoMarcaUrl: URL.createObjectURL(imageBlob)
            });
          });
        }
      });
    }
  }

  canDo(action) {
    return this.props.actions.indexOf(action) >= 0;
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
    this.ajaxHandler.unsubscribe();
  }

  handleAprobar() {
    this.ajaxHandler.fetch('/tickets/aprobar/' + this.props.ticket.id, {
      method: 'POST'
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

  handleCancelar() {
    swal({
      input: 'textarea',
      inputPlaceholder: 'Por favor, ingrese un comentario acerca de la cancelación',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Ok',
      inputValidator: function(value) {
        return !value && 'Campo requerido';
      }
    }).then((result) =>{
      if(result.value) {
      console.log(result);
        this.ajaxHandler.fetch('/tickets/cancelar/' + this.props.ticket.id, {
          method: 'POST',
          body: JSON.stringify({
            comentario: result.value
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
    });
  }

  handleCerrar(e) {
    e.preventDefault();
    if( this.props.ticket.ticketTipo === 'VENCIMIENTO') {
      let modalDatosCierreVencimientoKey = this.state.modalDatosCierreVencimientoKey + 1;
      this.setState({
        modalDatosCierreVencimientoKey: modalDatosCierreVencimientoKey
      }, () => {
        $('#datos_vencimiento_modal').modal({backdrop: 'static'});
      });
    } else {
      this.ajaxHandler.fetch('/tickets/cerrar/' + this.props.ticket.id, {
        method: 'POST'
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
  }

  handleRecotizar() {
    this.ajaxHandler.fetch('/tickets/solicitar-recotizacion/' + this.props.ticket.id, {
      method: 'POST'
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

  handleListoParaRetirar() {
    this.ajaxHandler.fetch('/tickets/listo-para-retirar/' + this.props.ticket.id, {
      method: 'POST'
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

  handleAdicional() {
    this.ajaxHandler.fetch('/tickets/solicitar-adicional/' + this.props.ticket.id, {
      method: 'POST'
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

  handleDatosCierreVencimientoSave(obj) {
    console.log(obj);
    $('#datos_vencimiento_modal').modal('toggle');
    this.ajaxHandler.fetch('/tickets/cerrar/' + this.props.ticket.id, {
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

  handleDatosCierreVencimientoClose() {
    $('#datos_vencimiento_modal').modal('toggle');
  }

	render() {
      let ticket = this.props.ticket;
      let classAvatar = 'dt-user-avatar mr-1 ';
      switch(ticket.ticketTipo){
        case 'PREVENTIVO':
          classAvatar += 'avatar-red';
          break;
        case 'VENCIMIENTO':
          classAvatar += 'avatar-blue';
          break;
        case 'GESTORIA':
          classAvatar += 'avatar-yelow';
          break;
        case 'CORRECTIVO':
          classAvatar += 'avatar-green';
          break;
        default:
          break;
      }
      let classTP = '';
      switch (ticket.semaforo) {
        case 'VERDE':
          classTP = 'bg-success';
          break;
        case 'AMARILLO':
          classTP = 'bg-yellow';
          break;
        case 'ROJO':
          classTP = 'bg-alert';
          break;
        default:
          classTP = 'bg-blue-grey';
          break;
      }
	    return (
        <div className="card">
          <div className="card-content">
            <div className="card-body">
              <div className="row">
                <div className="col-md-10">
                  <h5 className="header-card">
                    <div className="item" style={{display:'flex'}}><div id="avatar" className={classAvatar}>{ticket.ticketTipo.substr(0, 1).toUpperCase()}</div>{'TKT '+ticket.id}</div>
                    <div className="divider"></div>
                    <div className="item text-uppercase" style={{display:'flex'}}>{this.state.fotoMarcaUrl ? (
                      <div id="avatar" className="dt-user-avatar-image mr-1" style={{backgroundImage: 'url(' + this.state.fotoMarcaUrl + ')'}}></div>
                    ):(
                      <div id="avatar" className="dt-user-avatar mr-1">{ticket.movil ? (ticket.movil.marca ? ticket.movil.marca.nombre.substr(0, 2).toUpperCase() : ' ') : ticket.persona.nombre.substr(0, 1).toUpperCase() + ' ' + ticket.persona.apellido.substr(0, 1).toUpperCase()}</div>
                    )} {ticket.movil ? ticket.movil.dominio : ticket.persona.nombre + ' ' + ticket.persona.apellido}
                    </div>
                    <div className="divider"></div>
                    <div className="item text-uppercase">{ticket.servicio.nombre}</div>
                    <div className="divider"></div>
                    <div className="item text-uppercase">{ticket.estado}</div>
                    <div className="divider"></div>
                    <div className="item text-uppercase">{moment(ticket.fechaHoraAlta).format('L')}</div>
                    <div className="divider"></div>
                    <div className="item text-uppercase">{'TT '}<h3 className="display-inline"><div className="badge badge-pill bg-blue-grey">{ticket.mttTotal}</div></h3></div>
                    {(ticket.estado !== 'CERRADO' && ticket.estado !== 'CANCELADO') ? (
                    <div className="divider"></div>
                    ):(
                      ''
                    )}
                    {(ticket.estado !== 'CERRADO' && ticket.estado !== 'CANCELADO') ? (
                    <div className="item text-uppercase">{'TP '}<h3 className="display-inline">
                      <div className={"badge badge-pill " + classTP }>{ticket.mttParcial}</div>
                      </h3></div>
                    ):(
                      ''
                    )}
                  </h5>
                </div>
                <div className="col-md-2 p-0">
                  <div>
                    <div className="row dt-icons">
                      <div className="col-12 text-right pr-2">
                        {this.canDo('A_RECOTIZAR') && Security.hasPermission('TICKETS_RECOTIZAR') ? (
                        <div className="btn btn-primary box-shadow-2 btn-round btn-lg btn-dt-main round-icon" data-tooltip="tooltip" data-placement="top" title="Recotizar" onClick={this.handleRecotizar.bind(this)}>
                          <i className="ft-refresh-ccw"></i>
                        </div>
                        ) : ''}
                        {this.canDo('APROBAR') && Security.hasPermission('TICKETS_APROBAR') ? (
                        <div className="btn btn-success box-shadow-2 btn-round btn-lg btn-dt-main round-icon" data-tooltip="tooltip" data-placement="top" title="Aprobar Prespupuesto" onClick={this.handleAprobar.bind(this)}>
                          <i className="ft-thumbs-up"></i>
                        </div>
                        ) : ''}
                        {this.canDo('LISTO_PARA_RETIRAR') && Security.hasPermission('TICKETS_PASAR_LISTO_PARA_RETIRAR') ? (
                        <div className="btn btn-primary box-shadow-2 btn-round btn-lg btn-dt-main round-icon" data-tooltip="tooltip" data-placement="top" title="Listo para retirar" onClick={this.handleListoParaRetirar.bind(this)}>
                          <i className="ft-flag"></i>
                        </div>
                        ) : ''}
                        {this.canDo('SOLICITAR_ADICIONAL') && Security.hasPermission('TICKETS_COTIZAR_ADICIONAL') ? (
                        <div className="btn btn-primary box-shadow-2 btn-round btn-lg btn-dt-main round-icon" data-tooltip="tooltip" data-placement="top" title="Solicitar cotización adicional" onClick={this.handleAdicional.bind(this)}>
                          <i className="ft-file-plus"></i>
                        </div>
                        ) : ''}
                        {this.canDo('CERRAR') && Security.hasPermission('TICKETS_CERRAR') && ticket.fechaHoraRealizado !== null ? (
                        <div className="btn btn-primary box-shadow-2 btn-round btn-lg btn-dt-main round-icon" data-tooltip="tooltip" data-placement="top" title="Cerrar" onClick={this.handleCerrar.bind(this)}>
                          <i className="ft-lock"></i>
                        </div>
                        ) : ''}
                        {this.canDo('CANCELAR') && Security.hasPermission('TICKETS_CANCELAR') ? (
                        <div className="btn btn-danger box-shadow-2 btn-round btn-lg btn-dt-main round-icon" data-tooltip="tooltip" data-placement="top" title="Cancelar Ticket" onClick={this.handleCancelar.bind(this)}>
                          <i className="ft-thumbs-down"></i>
                        </div>
                        ) : ''}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal fade" tabIndex="-1" id="datos_vencimiento_modal" role="dialog" aria-labelledby="myModalLabel133">
            <div className="modal-xl modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header bg-fleet">
                  <h4 className="modal-title text-white" id="myModalLabel133"><i className="la la-history align-middle icon-modal-title"></i>{' Cargar presupuesto para el ticket: ' + ticket.id}</h4>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                </div>
                <div className="modal-body modal-grey modal-mh ovf-x-hidden">
                  <TicketDatosCierreVencimiento key={this.state.modalDatosCierreVencimientoKey} ticket={ticket} callbackClose={this.handleDatosCierreVencimientoClose.bind(this)} callbackSave={this.handleDatosCierreVencimientoSave.bind(this)} ></TicketDatosCierreVencimiento>
                </div>
              </div>
            </div>
          </div>
        </div>
	    );
  	}
}

export default TicketHeader;