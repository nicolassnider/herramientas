import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import CorrectivosAbm from './CorrectivosAbm'

class Correctivos extends Component {
	render() {
	    return (
			<div className="content-wrapper">
				<div className="content-header row">
					<div className="content-header-left col-md-6 col-12 mb-2">
						<h3 className="content-header-title"><i className="icon-wrench ml-1 mr-1 align-middle"></i>Generación de Mantenimiento Correctivo</h3>
					</div>
				</div>
				<div className="content-body">
					<Switch>
						<Route exact path={`${this.props.match.url}/add`} component={(props) => <CorrectivosAbm {...props} action="ADD" />} />
						<Route exact path={`${this.props.match.url}/add/movil/:movilId/:movilDominio`} component={(props) => <CorrectivosAbm {...props} action="ADD" />} />
					</Switch>
				</div>
			</div>
	    );
  	}
}

export default Correctivos;