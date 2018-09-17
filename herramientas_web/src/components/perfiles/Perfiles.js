import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import PerfilesGrid from './PerfilesGrid.js'
import PerfilesAbm from './PerfilesAbm.js'

class Perfiles extends Component {
	render() {
	    return (
			<div className="content-wrapper">
				<div className="content-header row">
					<div className="content-header-left col-md-6 col-12 mb-2">
      					<h3 className="content-header-title"><i className="ft-users ml-1 mr-1 align-middle"></i>Administración de Perfiles y Permisos</h3>
      				</div>
				</div>
				<div className="content-body">
					<Switch>
						<Route exact path={`${this.props.match.url}`} component={PerfilesGrid} />
						<Route exact path={`${this.props.match.url}/add`} component={(props) => <PerfilesAbm {...props} action="ADD" />} />
						<Route exact path={`${this.props.match.url}/:id/edit`} component={(props) => <PerfilesAbm {...props} action="EDIT" />} />
						<Route path={`${this.props.match.url}/:id`} component={(props) => <PerfilesAbm {...props} action="VIEW" />} />
					</Switch>
				</div>
			</div>
	    );
  	}
}

export default Perfiles;