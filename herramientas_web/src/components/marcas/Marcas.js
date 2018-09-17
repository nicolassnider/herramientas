import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import MarcasGrid from './MarcasGrid.js'
import MarcasAbm from './MarcasAbm.js'


class Marcas extends Component {
	render() {
	    return (
			<div className="content-wrapper">
				<div className="content-header row">
					<div className="content-header-left col-md-6 col-12 mb-2">
      					<h3 className="content-header-title">Administración de Marcas</h3>
      				</div>
				</div>
				<div className="content-body">								
					<Switch>
						<Route exact path={`${this.props.match.url}`} component={MarcasGrid} />
						<Route exact path={`${this.props.match.url}/add`} render={(props) => <MarcasAbm {...props} action="ADD" />} />
						<Route exact path={`${this.props.match.url}/:id/edit`} render={(props) => <MarcasAbm {...props} action="EDIT" />} />
						<Route path={`${this.props.match.url}/:id`} render={(props) => <MarcasAbm {...props} action="VIEW" />} />
					</Switch>										
				</div>
			</div>
	    );
  	}
}

export default Marcas;
