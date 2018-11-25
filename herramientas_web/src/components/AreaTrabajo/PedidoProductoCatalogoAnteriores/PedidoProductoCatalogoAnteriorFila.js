import React from 'react';
import {Button, Badge} from 'reactstrap';
import {withRouter} from 'react-router-dom';

const pedidoProductoCatalogo = (props) => {
    const style = {
        textAlign: 'center'
    }

    console.log(props)

    return (
        <tr>
            <td>{props.pedidoProductoCatalogo.id}</td>
            <td>{props.pedidoProductoCatalogo.productoCatalogo.producto.id}</td>
            <td>{props.pedidoProductoCatalogo.productoCatalogo.producto.descripcion}</td>
            <td>{props.pedidoProductoCatalogo.productoCatalogo.precio}</td>
            <td>{props.pedidoProductoCatalogo.cantidad}</td>
            <td>
                {props.pedidoProductoCatalogo.cliente ?
                    <h5><Badge
                        color="success">{props.pedidoProductoCatalogo.cliente.persona.nombre + " " + props.pedidoProductoCatalogo.cliente.persona.apellido}</Badge>
                    </h5>
                    :
                    <h5><Badge
                        color="danger">{props.pedidoProductoCatalogo.revendedora.persona.nombre + " " + props.pedidoProductoCatalogo.revendedora.persona.apellido}</Badge>
                    </h5>
                }
            </td>
            <td style={style}>
                <Button size="sm"
                        onClick={() => props.history.push('/areatrabajo/campania/campaniaactual/pedido/incluirenpedido/editar/  ' + this.props.pedidoProductoCatalogo.pedidoAvon.id + "/" + this.props.pedidoProductoCatalogo.id)}
                        className="btn-outline-secondary">
                    <i className="fa fa-pencil"></i>
                </Button>
            </td>
        </tr>
    );
}

export default withRouter(pedidoProductoCatalogo);