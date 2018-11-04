import React from 'react';
import {Button, Badge} from 'reactstrap';
import {withRouter} from 'react-router-dom';

const categoriaProducto = (props) => {
    const style = {
        textAlign: 'center'
    }


    return (
        <tr>
            <td>{props.categoriaProducto.id}</td>
            <td>{props.categoriaProducto.descripcion}</td>


            <td style={style}>
                <Button size="sm"
                        onClick={() => props.history.push(`/administracion/productocatalogo/categoriaproductos/${props.categoriaProducto.id}`)}
                        className="btn-outline-secondary"
                        title="Editar">
                    <i className="fa fa-pencil-square-o"></i>
                </Button>
            </td>
        </tr>
    );
}

export default withRouter(categoriaProducto);