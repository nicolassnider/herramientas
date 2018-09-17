import React, { Component } from 'react'
import Config from '../../commons/config/Config.js'
import Security from '../../commons/security/Security.js'
import AjaxHandler from '../../commons/ajax/AjaxHandler.js'
import Loading from '../ui/Loading.js'
import moment from 'moment'
import 'moment/min/locales'
import '../../assets/css/chat-application.css'

class TicketComentarios extends Component {
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
      inputComentario: null,
      comentarios: [],
      fotoPersonasUrls: []
    };

    this.handleInputComentarioChange = this.handleInputComentarioChange.bind(this);
    this.handleEnviar = this.handleEnviar.bind(this);
  }

  componentDidMount(nextProps, nextState) {
    this.ajaxHandler.subscribe(this);
    this.loadFormData();
  }

  componentWillUnmount() {
    this.ajaxHandler.unsubscribe();
  }

  buildPhoto(foto) {
    if (foto) {
      let photoUrl = Config.get('apiUrlBase') + '/personas/foto/' + foto;
      fetch(photoUrl, {
        method: 'GET',
        headers: {
          'Authorization-Token': localStorage.getItem("token")
        }
      }).then(response => {
        if (response.status === 200) {
          response.blob().then(imageBlob => {
             return  URL.createObjectURL(imageBlob);
          });
        }
      });
    }
  }

  loadFormData() {
    let component = this;
    this.setState({ loading: true });
    this.ajaxHandler.getJson('/ticket-comentarios/ticket/' + this.ticket.id + '/grid')
    .then(data => {
      if(data) component.setState({
        comentarios: data
      });
    }).finally(() => {
      this.setState({ loading: false });
    });
  }

  handleInputComentarioChange(event) {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;

		this.setState({
			inputComentario: { comentario: value }
		});
  }

  handleEnviar(event) {
    this.setState({ loading: true });
		let component = this
		this.ajaxHandler.fetch('/ticket-comentarios/ticket/' + this.ticket.id, {
			method: 'POST',
			body: JSON.stringify(this.state.inputComentario)
		}).then(response => {
      if(response.status !== 400) {
        this.setState({
          inputComentario: null
        }, () => {
          component.loadFormData();
        });
      } else {
        response.json()
        .then(data => {
          this.setState({
            errors: data.detalle
          });
        });
      }
		}).catch((error) => {
			this.ajaxHandler.handleError(error);
		}).finally(() => {
      this.setState({ loading: false },
      () =>{
        this.props.callbackUpdate();
      });
		});
		event.preventDefault();
  }

	render() {
    if(this.ticket) {
      let persona = JSON.parse(localStorage.getItem('persona'));
      let usuarioLogueado = persona.usuario.usuario;
      return (
        <React.Fragment>
          {this.state.loading && <Loading />}
          <div className="card pull-up">
            <div className="card-content pl-1 pr-1">
              <div className="card-body">
                <h4 className="form-section">
                  <i className="la la-comments"></i> Comentarios
                </h4>
                <div className="row chat-application ml-0 mr-0 mb-1">
                  <div className="content-body">
                    {Security.hasPermission('TICKETS_COMENTAR') ? (
                    <section className="chat-app-form">
                      <div className="row">
                        <div className="col-md-11">
                          <input type="text" className="form-control ml-1" id="inputComentario" name="inputComentario" placeholder="Ingrese aquí su comentario" value={this.state.inputComentario ? this.state.inputComentario.comentario : ''} onChange={this.handleInputComentarioChange} />
                        </div>
                        <div className="col-md-1">
                          <a className={this.state.inputComentario ? 'btn btn-float-sm btn-round btn-fleet ml-1' : 'btn btn-float-sm btn-round btn-fleet ml-1 disabled' } data-tooltip="tooltip" data-placement="top" title="" data-original-title="Enviar" onClick={this.handleEnviar}>
                            <i className="la la-send align-middle"></i>
                          </a>
                        </div>
                      </div>
                    </section>
                    ) : ''}
                    <section className="chat-app-window">
                      <div className="chats">
                        <div className="chats">
                        {
                          this.state.comentarios.map((comentario, index)=>{
                          return(
                            <div className="pb-3" key={index}>
                              <p className="time">{comentario.fechaHora}</p>
                              <div className={comentario.usuario.usuario === usuarioLogueado ? "chat chat-left" : "chat"}>
                                <div className="chat-avatar">
                                  <a className="avatar" data-toggle="tooltip" data-placement={comentario.usuario.usuario === usuarioLogueado ? "left" : "right"} title="ble" data-original-title="">
                                    <img src="https://community.smartsheet.com/sites/default/files/default_user.jpg" alt="avatar" />
                                  </a>
                                  <p className="mb-0">{comentario.persona.nombre}</p>
                                  <p>{comentario.persona.apellido}</p>
                                </div>
                                <div className="chat-body">
                                  <div className="chat-content">
                                    <p>{comentario.comentario}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                          })
                        }
                        </div>
                      </div>
                    </section>
                  </div>
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

export default TicketComentarios;