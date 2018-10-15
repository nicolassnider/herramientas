//dependencies
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import MenuAdministracion from '../../Data/MenuAdministracion'
//assets
import '../Global/Css/index.css';

class Administracion extends Component {
    render() {
        const items = MenuAdministracion;
        console.log(items);
        return (
            <div className="Administracion">
                <h1>Administración</h1>

                <ul>
                    {items && items.map((item, key) => <li key={key}><Link to ={item.url}>{item.title}</Link></li>)}
                </ul>
            </div>
        );
    }
}

export default Administracion;