import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import PlanMantenimientoServiciosGrid from './RegionesGrid.js'
import PlanMantenimientoServiciosAbm from './RegionesAbm.js'


class Regiones extends Component {
	render() {
	    return (
			<div className="content-wrapper">
				<div className="content-header row">
					<div className="content-header-left col-md-6 col-12 mb-2">
      					<h3 className="content-header-title">Administración de Planes de Mantenimientos Preventivos</h3>
      				</div>
				</div>
				<div className="content-body">								
					<Switch>
						<Route exact path={`${this.props.match.url}`} component={PlanMantenimientoServiciosGrid} />
						<Route exact path={`${this.props.match.url}/add`} render={(props) => <PlanMantenimientoServiciosAbm {...props} action="ADD" />} />
						<Route exact path={`${this.props.match.url}/:id/edit`} render={(props) => <PlanMantenimientoServiciosAbm {...props} action="EDIT" />} />
						<Route path={`${this.props.match.url}/:id`} render={(props) => <PlanMantenimientoServiciosAbm {...props} action="VIEW" />} />
					</Switch>										
				</div>
			</div>
	    );
  	}
}

export default Regiones;
