import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import ModeloTiposGrid from './ModeloTiposGrid.js'
import ModeloTiposAbm from './ModeloTiposAbm.js'


class ModeloTipos extends Component {
	render() {
	    return (
			<div className="content-wrapper">
				<div className="content-header row">
					<div className="content-header-left col-md-6 col-12 mb-2">
      					<h3 className="content-header-title">Administración de Tipos de Modelo</h3>
      				</div>
				</div>
				<div className="content-body">								
					<Switch>
						<Route exact path={`${this.props.match.url}`} component={ModeloTiposGrid} />
						<Route exact path={`${this.props.match.url}/add`} render={(props) => <ModeloTiposAbm {...props} action="ADD" />} />
						<Route exact path={`${this.props.match.url}/:id/edit`} render={(props) => <ModeloTiposAbm {...props} action="EDIT" />} />
						<Route path={`${this.props.match.url}/:id`} render={(props) => <ModeloTiposAbm {...props} action="VIEW" />} />
					</Switch>										
				</div>
			</div>
	    );
  	}
}

export default ModeloTipos;
