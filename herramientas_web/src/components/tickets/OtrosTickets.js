import React, { Component } from 'react'
import Security from '../../commons/security/Security.js'
import AjaxHandler from '../../commons/ajax/AjaxHandler.js'
import Loading from '../ui/Loading.js'
import moment from 'moment'
import 'moment/min/locales'

class OtrosTickets extends Component {
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
      tickets: []
    }
  }

  componentDidMount() {
		if (Security.hasPermission('TICKETS_VER_OTROS_TICKETS')) {
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
    let serviceURL = this.ticket.movil ? '/tickets/movil/' + this.ticket.movil.id + '/grid' : '/tickets/persona/' + this.ticket.persona.id + '/grid';
    this.ajaxHandler.getJson(serviceURL)
    .then(data => {
      if(data) component.setState({
        tickets: data
      });
    }).finally(() => {
      this.setState({ loading: false });
    });
  }

  handleViewTicket(id) {
    this.props.callback(id);
  }

	render() {
    if(this.ticket) {
      return (
        <React.Fragment>
          {this.state.loading && <Loading />}
          {this.state.tickets ? (
            <div className="card pull-up">
              <div className="card-content">
                <div className="card-body">
                  <h4 className="form-section">
                    <i className="la la-ticket"></i> Tickets
                  </h4>
                  <div className="row">
                    <div className="col-md-12">
                      <table className="table">
                        <thead className="thead-fleet">
                          <tr>
                            <th scope="col">Ticket</th>
                            <th scope="col">Fecha</th>
                            <th scope="col">Tipo</th>
                            <th scope="col">Servicio</th>
                            <th scope="col">Estado</th>
                            <th scope="col"></th>
                          </tr>
                        </thead>
                        <tbody>
                        {this.state.tickets.map((ticket, index)=>{
                          return(
                            <tr key={index} style={{backgroundColor: ticket.id === this.ticket.id ? '#00c0bd24' : ''}}>
                              <td className="align-middle">{ticket.id}</td>
                              <td className="align-middle">{ticket.fechaHoraAlta}</td>
                              <td className="align-middle">{ticket.ticketTipo}</td>
                              <td className="align-middle">{ticket.servicio.nombre}</td>
                              <td className="align-middle">{ticket.estado}</td>
                              <td className="align-middle">
                              {ticket.id !== this.ticket.id ? (
                                <a className="btn btn-icon text-fleet p-0 m-0" role="button" onClick={(e) => this.handleViewTicket(ticket.id)}>
                                  <i className="fa fa-search fa-xs"></i>
                                </a>
                              ) : (
                                null
                              )}
                              </td>
                            </tr>
                          );
                        })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : ( null )}
        </React.Fragment>
      )
    } else {
      return null;
    }
  }
}

export default OtrosTickets;