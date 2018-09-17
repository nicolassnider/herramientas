import React, { Component } from 'react'
import Security from '../../commons/security/Security.js'
import AjaxHandler from '../../commons/ajax/AjaxHandler.js'
import Loading from '../ui/Loading.js'
import moment from 'moment'
import 'moment/min/locales'
import '../../assets/css/timeline.css'

class TicketHistorico extends Component {
	constructor(props) {
    super(props);
    this.props = props;

    this.ajaxHandler = new AjaxHandler();

    moment.locale('es');

    if(props.ticket) {
      this.ticket = props.ticket;
    }

    this.state = {
      loading: false,
      historia: []
    }
  }

  componentDidMount() {
		if (Security.hasPermission('TICKETS_VER_HISTORIA')) {
      this.ajaxHandler.subscribe(this);
      this.loadFormData();
		} else {
			this.setState({
				redirectTo: '/error'
			});
		}
	}

  componentWillUnmount() {
    this.ajaxHandler.unsubscribe();
  }

  loadFormData() {
    let component = this;
    this.setState({ loading: true });
    this.ajaxHandler.getJson('/ticket-historico/ticket/' + this.ticket.id + '/grid')
    .then(data => {
      if(data) component.setState({
        historia: data
      });
    }).finally(() => {
      this.setState({ loading: false });
    });
  }

  getEventoDisplay (evento) {
    switch (evento) {
      case 'TICKETS_CREAR':
        return {txt: 'Creación del Ticket', iconClass: 'la la-dot-circle-o', iconColor: ''};
      case 'TICKETS_ASIGNAR_GERENCIADOR':
        return {txt: 'Asignación de Gerenciador', iconClass: 'la la-suitcase', iconColor: ''};
      case 'TICKETS_ASIGNAR_TALLER':
        return {txt: 'Asignación de Taller', iconClass: 'la la-wrench', iconColor: ''};
      case 'TICKETS_CREAR_COMENTARIO':
        return {txt: 'Ingreso de Comentario', iconClass: 'la la-comments', iconColor: ''};
      case 'TICKETS_CREAR_PRESUPUESTO':
        return {txt: 'Nuevo Presupuesto', iconClass: 'la la-file-text', iconColor: ''};
      case 'TICKETS_ASIGNAR_TURNO':
        return {txt: 'Asignación de Turno', iconClass: 'la la-calendar-check-o', iconColor: ''};
      case 'TICKETS_ESTADO_MODIFICAR':
        return {txt: 'Cambio de Estado', iconClass: 'la la-check-circle', iconColor: ''};
      default:
        return {txt: '', iconClass: '', iconColor: '#ccc'};
    }
  }

	render() {
    if(this.ticket) {
      return (
        <React.Fragment>
          {this.state.loading && <Loading />}
          <div className="content-wrapper">
            <div className="content-body">
              <section id="timeline" className="timeline-left timeline-wrapper">
                <ul className="timeline">
                  <li className="timeline-line"></li>
                  { this.state.historia.map((item, index)=>{
                      let persona = item.persona ? item.persona.nombre + ' ' + item.persona.apellido : 'Generado por el sistema';
                    return(
                      <li key={index} className="timeline-item">
                        <div className="timeline-badge">
                          <span className="bg-fleet bg-lighten-1" data-toggle="tooltip" data-placement="right">
                            <i className={ this.getEventoDisplay(item.evento).iconClass }></i>
                          </span>
                        </div>
                        <div className="timeline-card card border-grey border-lighten-2 card-history">
                          <div className="card-header">
                            <h4 className="card-title">{ item.fechaHora + ' - ' + this.getEventoDisplay(item.evento).txt + ' - ' + persona }</h4>
                            <p className="card-subtitle text-muted pt-1">
                              <span className="font-small-3">{ item.detalle }</span>
                            </p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            </div>
          </div>
        </React.Fragment>
      )
    } else {
      return null;
    }
  }
}

export default TicketHistorico;