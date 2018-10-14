import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

import './App.css';
// Styles
// CoreUI Icons Set
import '@coreui/icons/css/coreui-icons.min.css';
// Import Flag Icons Set
import 'flag-icon-css/css/flag-icon.min.css';
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
// Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css';
// Import Main styles for this application
import '../scss/style.css'

// Containers
import { DefaultLayout, AuthLayout } from '../containers';
import PrivateRoute from '../hoc/PrivateRoute';
import { setConfig } from '../utils/Storage';
import { checkSession } from '../services/AuthServices';

class App extends Component {

  constructor(props) {
		super(props);

		this.state = {
			authVerified: null
		}
	}

	componentDidMount() {
		this.getConfig()
		.then(() => {
      checkSession()
      .then((result) => {
        this.setState({ authVerified: result });
      });
		});
	}

  getConfig = () =>{
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
			setConfig(configData);
		})
		.catch(function(error) {
			// TODO: Manejo de errores
			console.log(error);
		});
  }

  render() {

    if (this.state.authVerified === null)
      return null;

    return (
      <HashRouter>
        <Switch>
          <Route path="/auth" name="Home" component={AuthLayout} />
          <PrivateRoute path="/" name="Home" component={DefaultLayout} />
        </Switch>
      </HashRouter>
    );
  }
}

export default App;
