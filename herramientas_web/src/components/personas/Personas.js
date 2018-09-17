import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import PersonasGrid from './PersonasGrid.js'
import PersonasAbm from './PersonasAbm.js'

class Personas extends Component {
	render() {
	    return (
			<div className="content-wrapper">
				<div className="content-header row">
					<div className="content-header-left col-md-6 col-12 mb-2">
      					<h3 className="content-header-title"><i className="la la-user ml-1 mr-1 align-middle"></i>Administración de Personas</h3>
      				</div>
				</div>
				<div className="content-body">
					<Switch>
						<Route exact path={`${this.props.match.url}`} component={PersonasGrid} />
						<Route exact path={`${this.props.match.url}/add`} component={(props) => <PersonasAbm {...props} action="ADD" />} />
						<Route exact path={`${this.props.match.url}/:id/edit`} component={(props) => <PersonasAbm {...props} action="EDIT" />} />
						<Route path={`${this.props.match.url}/:id`} component={(props) => <PersonasAbm {...props} action="VIEW" />} />
					</Switch>
				</div>
			</div>
	    );
  	}
}

export default Personas;