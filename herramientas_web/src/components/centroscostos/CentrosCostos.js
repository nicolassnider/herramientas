import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import CentrosCostosGrid from './CentrosCostosGrid.js'
import CentrosCostosAbm from './CentrosCostosAbm.js'


class CentrosCostos extends Component {
	render() {
	    return (
			<div className="content-wrapper">
				<div className="content-header row">
					<div className="content-header-left col-md-6 col-12 mb-2">
      					<h3 className="content-header-title">Administración de Centros de Costos</h3>
      				</div>
				</div>
				<div className="content-body">								
					<Switch>
						<Route exact path={`${this.props.match.url}`} component={CentrosCostosGrid} />
						<Route exact path={`${this.props.match.url}/add`} render={(props) => <CentrosCostosAbm {...props} action="ADD" />} />
						<Route exact path={`${this.props.match.url}/:id/edit`} render={(props) => <CentrosCostosAbm {...props} action="EDIT" />} />
						<Route path={`${this.props.match.url}/:id`} render={(props) => <CentrosCostosAbm {...props} action="VIEW" />} />
					</Switch>										
				</div>
			</div>
	    );
  	}
}

export default CentrosCostos;
