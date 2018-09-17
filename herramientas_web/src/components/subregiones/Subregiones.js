import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import SubRegionesGrid from './SubregionesGrid.js'
import SubRegionesAbm from './SubregionesAbm.js'


class SubRegiones extends Component {
	render() {
	    return (
			<div className="content-wrapper">
				<div className="content-header row">
					<div className="content-header-left col-md-6 col-12 mb-2">
      					<h3 className="content-header-title">Administración de Sub Regiones</h3>
      				</div>
				</div>
				<div className="content-body">								
					<Switch>
						<Route exact path={`${this.props.match.url}`} component={SubRegionesGrid} />
						<Route exact path={`${this.props.match.url}/add`} render={(props) => <SubRegionesAbm {...props} action="ADD" />} />
						<Route exact path={`${this.props.match.url}/:id/edit`} render={(props) => <SubRegionesAbm {...props} action="EDIT" />} />
						<Route path={`${this.props.match.url}/:id`} render={(props) => <SubRegionesAbm {...props} action="VIEW" />} />
					</Switch>										
				</div>
			</div>
	    );
  	}
}

export default SubRegiones;
