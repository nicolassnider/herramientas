import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import CentrosBeneficiosGrid from './CentrosBeneficiosGrid.js'
import CentrosBeneficiosAbm from './CentrosBeneficiosAbm.js'


class CentrosBeneficios extends Component {
	render() {
	    return (
			<div className="content-wrapper">
				<div className="content-header row">
					<div className="content-header-left col-md-6 col-12 mb-2">
      					<h3 className="content-header-title">Administración de Centros de Beneficios</h3>
      				</div>
				</div>
				<div className="content-body">								
					<Switch>
						<Route exact path={`${this.props.match.url}`} component={CentrosBeneficiosGrid} />
						<Route exact path={`${this.props.match.url}/add`} render={(props) => <CentrosBeneficiosAbm {...props} action="ADD" />} />
						<Route exact path={`${this.props.match.url}/:id/edit`} render={(props) => <CentrosBeneficiosAbm {...props} action="EDIT" />} />
						<Route path={`${this.props.match.url}/:id`} render={(props) => <CentrosBeneficiosAbm {...props} action="VIEW" />} />
					</Switch>										
				</div>
			</div>
	    );
  	}
}

export default CentrosBeneficios;
