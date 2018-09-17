import React, { Component } from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import 'bootstrap/dist/js/bootstrap.js';
import Config from '../commons/config/Config.js';
import Layout from './layout/Layout.js'
import Login from './auth/Login.js'
import Activate from './auth/Activate.js'
import ForgotPassword from './auth/ForgotPassword.js'
import RecoverPassword from './auth/RecoverPassword.js'

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			authorized: null
		}
	}

	componentDidMount() {
		this.getConfig()
		.then(() => {
			this.checkSession()
			.then(() => {
				this.getConfigBusiness()
			});
		});
	}

	getConfig() {
		// Carga configuración desde el archivo config.json.
		return fetch('./config/config.json', {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		})
		.then(response => response.json())
		.then(configData => {
			localStorage.setItem('config', JSON.stringify(configData));
		})
		.catch(function(error) {
			// TODO: Manejo de errores
			console.log(error);
		});
	}

	getConfigBusiness() {
		// Carga configuración de negocio.
		if(localStorage.getItem('token')) {
			return fetch(Config.get('apiUrlBase') + '/commons/config-business', {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization-Token': localStorage.getItem('token')
				}
			})
			.then(response => response.json())
			.then(data => {
				localStorage.setItem("configBusiness", JSON.stringify(data));
			})
			.catch(function(error) {
				// TODO: Manejo de errores
				console.log(error);
			});
		} else {
			return Promise.resolve();
		}
	}

	checkSession() {
		// Verifica si existe una sesión activa para el token.
		return new Promise((resolve, reject) => {
			if(localStorage.getItem('token')) {
				fetch(Config.get('apiUrlBase') + '/auth/check', {
					method: 'GET',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'Authorization-Token': localStorage.getItem('token')
					}
				}).then(response => {
					this.setState({
						authorized: response.status === 200
					});
					if(response.status === 200) resolve();
				}).catch(function(error) {
					// TODO: Manejo de errores
					console.log(error);
				});
			} else {
				this.setState({
					authorized: false
				});
			}
		});
	}

	render() {
		/*if(this.state.authorized === null) {
    		return null;
    	} else if(this.state.authorized === false) {
    		return(<Activate />);
    	} else if(this.state.authorized === false) {
    		return(<Login />);
    	} else if (this.state.authorized === true) {
    		return(<Layout authorized={this.state.authorized} />);
    	}*/

    	if(this.state.authorized === null) {
    		return null;
    	} else if(this.state.authorized === false) {
    		return(
    			<Router>
    				<Switch>
						<Route exact path='/' component={Login} />
						<Route path='/activacion/:activationKey' component={Activate} />
						<Route path='/olvide-clave' component={ForgotPassword} />
						<Route path='/recuperar-clave/:activationKey' component={RecoverPassword} />
						<Route component={Login} />
	    			</Switch>
	    		</Router>
    		);
    	} else if (this.state.authorized === true) {
    		return(<Layout authorized={this.state.authorized} />);
    	}
  	}
}

export default App;