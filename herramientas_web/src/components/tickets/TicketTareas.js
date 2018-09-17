import React, { Component } from 'react'
import Security from '../../commons/security/Security.js'
import AjaxHandler from '../../commons/ajax/AjaxHandler.js'
import Loading from '../ui/Loading.js'
import moment from 'moment'
import 'moment/min/locales'

class TicketTareas extends Component {
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
      tareas: []
    }
  }

  componentDidMount(nextProps, nextState) {
    if(Security.hasPermission('TICKETS_VER_TAREAS')) {
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
    this.ajaxHandler.getJson('/tareas/ticket/' + this.ticket.id + '/grid')
    .then(data => {
      if(data) component.setState({
        tareas: data
      });
    }).finally(() => {
      this.setState({ loading: false });
    });
  }

	render() {
    if(this.ticket) {
      return (
        <React.Fragment>
          {this.state.loading && <Loading />}
          {this.state.tareas ? (
            <div className="card pull-up">
              <div className="card-content">
                <div className="card-body">
                  <h4 className="form-section">
                    <i className="la la-tasks"></i> Tareas
                  </h4>
                  <div className="row">
                    <div className="col-md-12">
                      <table className="table">
                        <thead className="thead-fleet">
                          <tr>
                            <th scope="col">Servicio</th>
                            <th scope="col">Tareas</th>
                          </tr>
                        </thead>
                        <tbody>
                        {this.state.tareas.map((tarea, index)=>{
                          return(
                            <tr key={index}>
                              <td className="align-middle">{tarea.servicio.nombre}</td>
                              <td className="align-middle">{tarea.nombre}</td>
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

export default TicketTareas;