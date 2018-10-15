//Dependencies
import React from 'react';
import {Route} from 'react-router-dom';
import {Switch} from 'react-router-dom';

//Components
import App from './Components/App';
import About from './Components/About/About';
import Contact from './Components/Contact/Contact';
import Home from './Components/Home/Home';
import Pedidos from './Components/Pedidos/Pedidos';
import Administracion from './Components/Administracion/Administracion';
import Page404 from './Components/Page404/Page404';

import Campanias from './Components/Administracion/Campanias/Campanias'


const AppRoutes = () =>
    <App>
        <Switch>
            <Route path="/about" component={About}/>
            <Route path="/contact" component={Contact}/>
            <Route path="/pedidos" component={Pedidos}/>
            <Route path="/administracion" component={Administracion}/>
            <Route path="/administracion/campanias" component={Campanias}/>
            <Route path="/" component={Home}/>
            <Route component={Page404}/>

        </Switch>


    </App>;
export default AppRoutes;

