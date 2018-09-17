import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import Security from '../../commons/security/Security.js'
import 'bootstrap4-duallistbox'
import 'bootstrap4-duallistbox/dist/bootstrap-duallistbox.css'
import AjaxHandler from '../../commons/ajax/AjaxHandler.js'
import Loading from '../ui/Loading.js'
import 'react-select/dist/react-select.css'
import moment from 'moment'
import 'moment/min/locales'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-dropzone-component/styles/filepicker.css'
import 'dropzone/dist/min/dropzone.min.css'
import '../../assets/css/vec-dropzone.css'
import TicketHeader from './TicketHeader.js'
import TicketDatosGenerales from './TicketDatosGenerales.js';
import TicketComentarios from './TicketComentarios.js';
import TicketAsignacion from './TicketAsignacion.js';
import TicketPresupuestos from './TicketPresupuestos.js';

class TicketsAbm extends Component {
  constructor(props) {
		super(props);

    this.ajaxHandler = new AjaxHandler();

    moment.locale('es');

		this.state = {
			redirectTo: null,
			props: this.props,
			formData: null,
      errors: [],
      loading: false,
      headerFields: null,
      actions: []
    }
  }

  componentDidMount() {
    if(Security.hasPermission('TICKETS_VISUALIZAR')) {
      this.ajaxHandler.subscribe(this);
      this.initForm();
    } else {
      this.setState({
        redirectTo: '/error'
      });
    }
  }

  componentWillUnmount() {
    this.ajaxHandler.unsubscribe();
  }

  initForm() {
    this.loadFormData();
    //window.scrollTo(0, 0);
    //$('#nombre').focus();
  }


  handlePresupuestoSave () {
    this.initForm();
    this.child.init();
  }

  handlePresupuestoClose () {
  }

  handleAsignacionSave () {
    this.initForm();
    this.child.init();
    this.childDG.init();
  }

  handleAsignacionClose () {
  }

  handleDataUpdate() {
    this.initForm();
    this.child.init();
  }

  handleComentariosUpdate() {
    this.initForm();
    this.childDG.init();
  }

  loadFormData() {
    let component = this;
    this.setState({ loading: true });
    Promise.all([
      component.ajaxHandler.getJson('/tickets/' + this.state.props.match.params.id),
      component.ajaxHandler.getJson('/tickets/' + this.state.props.match.params.id + '/actions')
    ]).then((data) => {
      let headerFields= [
        {
          row: 1,
          labelCols: 4,
          valueCols: 8,
          fields:[
            {
              label: 'Nro. Ticket',
              value: data[0].id
            },
            {
              label: 'Fecha Creación',
              value:  moment(data[0].fechaHoraAlta).format('L')
            }
          ]
        },
        {
          row: 2,
          labelCols: 4,
          valueCols: 8,
          fields:[
            {
              label: 'Tipo',
              value: data[0].ticketTipo
            },
            {
              label: 'Estado',
              value: data[0].estado
            }
          ]
        }
      ];

      if(data[0]) component.setState({
        formData: data[0],
        headerFields: headerFields,
        actions: data[1]
      });
    }).catch(function(error) {
			component.ajaxHandler.handleError(error);
    }).finally(() => {
      component.setState({ loading: false });
    });
  }

	handleCancel(event) {
		this.exit();
	}

	exit() {
		this.setState({
			redirectTo: '/tickets'
    });
	}

	render() {
		return (
			<React.Fragment>
        {this.state.redirectTo && <Redirect push to={this.state.redirectTo} />}
        {this.state.loading && <Loading />}
			  <div className="row">
          <div className="col-md-12">
            <div className="alert alert-danger" role="alert" hidden={this.state.errors.length===0}>
							{this.state.errors.map((e, i) => <li key={i}>{e}</li>)}
						</div>
            <div className="form form-horizontal">
              <div className="form-body">
                {this.state.headerFields ? (
                <TicketHeader ticket={this.state.formData} onRef={ref => (this.child = ref)} actions={this.state.actions} callbackDataUpdate={this.handleDataUpdate.bind(this)}></TicketHeader>
                ) : ( null )}
                {this.state.formData ? (
                <TicketDatosGenerales ticket={this.state.formData} onRef={ref => (this.childDG = ref)} actions={this.state.actions} callbackDataUpdate={this.handleDataUpdate.bind(this)}></TicketDatosGenerales>
                ) : ( null )}
                {(this.state.formData && !this.state.formData.autogestion) ? (
                  <div className="row">
                    <div className="col-md-6">
                      <TicketAsignacion ticket={this.state.formData} onRef={ref => (this.child = ref)} callbackClose={this.handleAsignacionClose.bind(this)} callbackSave={this.handleAsignacionSave.bind(this)} actions={this.state.actions}></TicketAsignacion>
                    </div>
                    <div className="col-md-6">
                      <TicketPresupuestos ticket={this.state.formData} onRef={ref => (this.child = ref)} callbackClose={this.handlePresupuestoClose.bind(this)} callbackSave={this.handlePresupuestoSave.bind(this)} actions={this.state.actions}></TicketPresupuestos>
                    </div>
                  </div>
                ) : ( null )}
                {this.state.formData ? (
                <TicketComentarios ticket={this.state.formData} callbackUpdate={this.handleComentariosUpdate.bind(this)} actions={this.state.actions}></TicketComentarios>
                ) : ( null )}
              </div>
            </div>
					</div>
				</div>
        <div className="card pull-up">
          <div className="card-content">
            <div className="card-body">
              <div className="text-cd text-right">
                <button type="button" className="btn btn-danger" onClick={this.handleCancel.bind(this)}>
                  <i className="fa fa-times-circle"></i> Volver
                </button>
              </div>
            </div>
          </div>
        </div>
			</React.Fragment>
		);
	}
}

export default TicketsAbm;