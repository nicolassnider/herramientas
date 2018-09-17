import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

class Error extends Component {
	constructor(props) {
		super(props);

		this.state = {
			redirectTo: null
		}
	}

	handleGoHome() {
		this.setState({
	      redirectTo: '/'
	    });
	}

	render() {
	    return (
	    	<React.Fragment>
		    	{this.state.redirectTo && <Redirect push to={this.state.redirectTo} />}
		    	<div className="container">
				    <div className="jumbotron align-middle" style={{backgroundColor:'#eee'}}>
				        <div className="text-center"><i className="fa fa-5x fa-frown-o" style={{color:'#d9534f'}}></i></div>
				        <h1 className="text-center"><p><small className="text-center"> No tiene permisos para realizar esta acción.</small></p></h1>
				        <p className="text-center">Contacte al administrador.</p>
				        <p className="text-center"><button className="btn btn-primary" onClick={this.handleGoHome.bind(this)}><i className="fa fa-arrow-circle-left"></i> Ir al Inicio</button></p>
				    </div>
				</div>
			</React.Fragment>
	    );
  	}
}

export default Error;