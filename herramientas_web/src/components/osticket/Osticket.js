import React, { Component } from 'react'
// import { Route, Switch } from 'react-router-dom'
import Iframe from 'react-iframe'

class Osticket extends Component {
    
    
	render() {
           
	    return (
			<Iframe url="https://soporte.vec.com.ar/tickets_autologin.php"
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

export default Osticket;
