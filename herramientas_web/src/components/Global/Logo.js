import React, { Component } from 'react';
import logo from './Imagenes/logo.svg';

class Logo extends Component {
    render() {
        return (<div> className="Logo"

                    <img src={logo} className="App-logo" alt="logo" />
                    <p>
                        Edit <code>src/Components/Header.js</code> and save to reload.
                    </p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                    </a>
            </div>


        );
    }
}

export default Header;