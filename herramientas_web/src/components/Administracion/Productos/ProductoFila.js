import React from 'react';
import {Button, Badge} from 'reactstrap';
import {withRouter} from 'react-router-dom';

const producto = (props) => {
    const style = {
        textAlign: 'center'
    }

    return (
        <tr>
            <td>{props.producto.id}</td>
            <td>{props.producto.categoria.descripcion}</td>
            <td>{props.producto.descripcion}</td>
            <td>{props.producto.unidad.descripcion}</td>


            <td style={style}>
                <Button size="sm"
                        onClick={() => props.history.push(`/administracion/productos/catalogosenproducto/${props.producto.id}`)}
                        className="btn-outline-secondary"
                        title="Incluir en Catalogos">
                    <i className="fa fa-pencil-square-o"></i>
                </Button>
                <Button size="sm"
                        onClick={() => props.history.push(`/administracion/productos/editar/${props.producto.id}`)}
                        className="btn-outline-secondary"
                        title="Nuevo cliente">
                    <i className="fa fa-pencil-square"></i>
                </Button>
                <Button size="sm"
                        onClick={() => props.history.push(`/administracion/productos/editar/${props.producto.id}`)}
                        className="btn-outline-secondary">
                    <i className="fa fa-pencil"></i>
                </Button>
            </td>
        </tr>
    );
}

export default withRouter(producto);