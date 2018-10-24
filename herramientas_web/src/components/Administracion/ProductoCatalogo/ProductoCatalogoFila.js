import React from 'react';
import {Button, Badge} from 'reactstrap';
import {withRouter} from 'react-router-dom';

const productoCatalogo = (props) => {
    const style = {
        textAlign: 'center'
    }


    return (
        <tr>
            <td>{props.productoCatalogo.catalogo.descripcion}</td>
            <td>{props.productoCatalogo.precio}</td>
            <td>{props.productoCatalogo.activo}</td>

            <td style={style}>
                <Button size="sm"
                        onClick={() => props.history.push(`/administracion/productocatalogo/catalogosenproducto/${props.productoCatalogo.producto.id}`)}
                        className="btn-outline-secondary"
                        title="Incluir en Catalogos">
                    <i className="fa fa-pencil-square-o"></i>
                </Button>
            </td>
        </tr>
    );
}

export default withRouter(productoCatalogo);