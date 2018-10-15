//Dependencies
import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter} from 'react-router-dom';

//Routes
import AppRoutes from './Routes';

//Assets
import './Components/Global/Css/index.css';


render(
    <BrowserRouter>
        <AppRoutes/>
    </BrowserRouter>,
    document.getElementById('root')


);


