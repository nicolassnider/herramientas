//Dependences
import React, { Component } from 'react';
import PropTypes from 'prop-types';

//Assets
import logo from './Imagenes/logo.svg';
import './Css/Header.css';

class Header extends Component {

  render() {
        const  {title, items}=this.props;
    return (
      <div className="Header">
        <div className="Logo">
          <div className="App-logo">
            <img src={logo} alt="logo" />
          </div>
          <h2>
              {title}
          </h2>
            <ul className="Menu">
                {items && items.map((item,key)=><li key={key}>{item.title}</li>)}
            </ul>
        </div>
      </div>
    );
  }
}

export default Header;
