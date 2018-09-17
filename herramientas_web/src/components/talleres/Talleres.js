import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import TalleresGrid from './TalleresGrid.js'
import TalleresAbm from './TalleresAbm.js'


class Talleres extends Component {
	render() {
	    return (
			<div className="content-wrapper">
				<div className="content-header row">
					<div className="content-header-left col-md-6 col-12 mb-2">
      					<h3 className="content-header-title">Administración de Talleres</h3>
      				</div>
				</div>
				<div className="content-body">								
					<Switch>
						<Route exact path={`${this.props.match.url}`} component={TalleresGrid} />
						<Route exact path={`${this.props.match.url}/add`} render={(props) => <TalleresAbm {...props} action="ADD" />} />
						<Route exact path={`${this.props.match.url}/:id/edit`} render={(props) => <TalleresAbm {...props} action="EDIT" />} />
						<Route path={`${this.props.match.url}/:id`} render={(props) => <TalleresAbm {...props} action="VIEW" />} />
					</Switch>										
				</div>
			</div>
	    );
  	}
}

export default Talleres;
