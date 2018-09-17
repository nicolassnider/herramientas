import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import VencimientosGrid from './VencimientosGrid.js'
import VencimientosAbm from './VencimientosAbm.js'

class Vencimientos extends Component {
	render() {
	    return (
			<div className="content-wrapper">
				<div className="content-header row">
					<div className="content-header-left col-md-6 col-12 mb-2">
      					<h3 className="content-header-title"><i className="ft-calendar ml-1 mr-1 align-middle"></i>Administración de Vencimientos</h3>
      				</div>
				</div>
				<div className="content-body">
					<Switch>
						<Route exact path={`${this.props.match.url}`} component={VencimientosGrid} />
						<Route exact path={`${this.props.match.url}/add`} component={(props) => <VencimientosAbm {...props} action="ADD" />} />
						<Route exact path={`${this.props.match.url}/:id/edit`} component={(props) => <VencimientosAbm {...props} action="EDIT" />} />
						<Route path={`${this.props.match.url}/:id`} component={(props) => <VencimientosAbm {...props} action="VIEW" />} />
					</Switch>
				</div>
			</div>
	    );
  	}
}

export default Vencimientos;