import React, { Component } from 'react'
// import { Route, Switch } from 'react-router-dom'
import Config from '../../commons/config/Config.js'
import Iframe from 'react-iframe'

class Avl extends Component {
    constructor(props) {
        super(props);
        this.props = props;
    }

	render() {
	    return (
        <Iframe url={Config.get('urlAvl') +  localStorage.getItem("token")}
        
        width="100%"
        height="800px"
        id="myId"
        className="embed-responsive-item"
        display="initial"
		position="relative"
        allowFullScreen/>
	    );
  	}
}

export default Avl;
