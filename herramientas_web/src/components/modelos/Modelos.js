import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import ModelosGrid from './ModelosGrid.js'
import ModelosAbm from './ModelosAbm.js'


class Modelos extends Component {
	render() {
	    return (
			<div className="content-wrapper">
				<div className="content-header row">
					<div className="content-header-left col-md-6 col-12 mb-2">
      					<h3 className="content-header-title">Administración de Modelos</h3>
      				</div>
				</div>
				<div className="content-body">								
					<Switch>
						<Route exact path={`${this.props.match.url}`} component={ModelosGrid} />
						<Route exact path={`${this.props.match.url}/add`} render={(props) => <ModelosAbm {...props} action="ADD" />} />
						<Route exact path={`${this.props.match.url}/:id/edit`} render={(props) => <ModelosAbm {...props} action="EDIT" />} />
						<Route path={`${this.props.match.url}/:id`} render={(props) => <ModelosAbm {...props} action="VIEW" />} />
					</Switch>										
				</div>
			</div>
	    );
  	}
}

export default Modelos;
