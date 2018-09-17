import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import GerenciadoresGrid from './GerenciadoresGrid.js'
import GerenciadoresAbm from './GerenciadoresAbm.js'


class Gerenciadores extends Component {
	render() {
	    return (
			<div className="content-wrapper">
				<div className="content-header row">
					<div className="content-header-left col-md-6 col-12 mb-2">
      					<h3 className="content-header-title">Administración de Gerenciadores</h3>
      				</div>
				</div>
				<div className="content-body">								
					<Switch>
						<Route exact path={`${this.props.match.url}`} component={GerenciadoresGrid} />
						<Route exact path={`${this.props.match.url}/add`} render={(props) => <GerenciadoresAbm {...props} action="ADD" />} />
						<Route exact path={`${this.props.match.url}/:id/edit`} render={(props) => <GerenciadoresAbm {...props} action="EDIT" />} />
						<Route path={`${this.props.match.url}/:id`} render={(props) => <GerenciadoresAbm {...props} action="VIEW" />} />
					</Switch>										
				</div>
			</div>
	    );
  	}
}

export default Gerenciadores;
