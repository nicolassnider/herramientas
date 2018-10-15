//Dependencies
import React, { Component } from 'react';
import PropTypes from 'prop-types';

//Components
import Header from "./Global/Header";
import Content from "./Global/Content";
import Footer from "./Global/Footer";

//Data
import items from '../Data/Menu';

class App extends Component {
    static propTypes = {
        children: PropTypes.object.isRequired
};

    render() {
        const{children}=this.props;

        return (
            <div className="App">
                <Header title="Herramientas WEB" items={items}/>
                <Content body={children}/>
                <Footer copyright={"&copy; Nicolás Snider 2018"}/>


            </div>
        );
    }
}

export default App;