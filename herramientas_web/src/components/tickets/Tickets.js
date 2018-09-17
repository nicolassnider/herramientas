import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import TicketsGrid from './TicketsGrid'
import TicketsAbm from './TicketsAbm'

class Tickets extends Component {
	render() {
	    return (
			<div className="content-wrapper">
				<div className="content-header row">
					<div className="content-header-left col-md-6 col-12 mb-2">
						<h3 className="content-header-title"><i className="la la-clipboard ml-1 mr-1 align-middle"></i>Administración de Tickets</h3>
					</div>
				</div>
				<div className="content-body">
					<Switch>
						<Route exact path={`${this.props.match.url}`} component={TicketsGrid} />
						<Route exact path={`${this.props.match.url}/:id/edit`} component={(props) => <TicketsAbm {...props} action="EDIT" />} />
						<Route path={`${this.props.match.url}/:id`} component={(props) => <TicketsAbm {...props} action="VIEW" />} />
					</Switch>
				</div>
			</div>
	    );
  	}
}

export default Tickets;