import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import PreventivosGrid from './PreventivosGrid.js'
import PreventivosAbm from './PreventivosAbm.js'

class Vencimientos extends Component {
	render() {
	    return (
			<div className="content-wrapper">
				<div className="content-header row">
					<div className="content-header-left col-md-12 col-12 mb-2">
      					<h3 className="content-header-title"><i className="ft-calendar ml-1 mr-1 align-middle"></i>Administración de Controles de Mantenimiento Preventivo</h3>
      				</div>
				</div>
				<div className="content-body">
					<Switch>
						<Route exact path={`${this.props.match.url}`} component={PreventivosGrid} />
						<Route exact path={`${this.props.match.url}/add`} component={(props) => <PreventivosAbm {...props} action="ADD" />} />
						<Route exact path={`${this.props.match.url}/:id/edit`} component={(props) => <PreventivosAbm {...props} action="EDIT" />} />
						<Route path={`${this.props.match.url}/:id`} component={(props) => <PreventivosAbm {...props} action="VIEW" />} />
					</Switch>
				</div>
			</div>
	    );
  	}
}

export default Vencimientos;