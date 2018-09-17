import React, { Component } from 'react'
import Security from '../../commons/security/Security.js'
import AjaxHandler from '../../commons/ajax/AjaxHandler.js'
import Loading from '../ui/Loading.js'
import moment from 'moment'
import 'moment/min/locales'

class TicketVerPresupuestos extends Component {
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
      presupuestos: []
    }
  }

  componentDidMount() {
    if(Security.hasPermission('TICKETS_VER_PRESUPUESTOS')) {
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
    component.setState({ loading: true });
    component.ajaxHandler.getJson('/ticket-presupuestos/ticket/' + this.props.ticket.id + '/grid')
    .then(data => {
      if(data) component.setState({
        presupuestos: data
      });
    }).finally(() => {
      component.setState({ loading: false });
    });
  }

	render() {
    if(this.props.ticket) {
      return (
        <React.Fragment>
          {this.state.loading && <Loading />}
          {this.state.presupuestos ? (
            <div className="card pull-up">
              <div className="card-content">
                <div className="card-body">
                  <h4 className="form-section">
                    <i className="la la-list"></i> Presupuestos
                  </h4>
                  <div className="row">
                    <div className="col-md-12">
                      <table className="table">
                        <thead className="thead-fleet">
                          <tr>
                            <th scope="col">Fecha</th>
                            <th scope="col">Subido por</th>
                            <th scope="col">Mano de obra</th>
                            <th scope="col">Repuestos</th>
                            <th scope="col">Total</th>
                            <th scope="col">Adjunto</th>
                            <th scope="col">Adicional</th>
                          </tr>
                        </thead>
                        <tbody>
                        {this.state.presupuestos.map((presupuesto, index)=>{
                          return(
                            <tr key={index}>
                              <td className="align-middle">{presupuesto.fechaHora}</td>
                              <td className="align-middle">{presupuesto.persona.nombre + ' '  + presupuesto.persona.apellido }</td>
                              <td className="align-middle">{presupuesto.manoDeObra}</td>
                              <td className="align-middle">{presupuesto.repuestos}</td>
                              <td className="align-middle">{presupuesto.manoDeObra + presupuesto.repuestos}</td>
                              <td className="align-middle">{presupuesto.adjunto}</td>
                          <td className="align-middle">{presupuesto.adicional? (<div class="text-center success dt-info-icon"><i class="ft-check"></i></div>) : ''}</td>
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

export default TicketVerPresupuestos;