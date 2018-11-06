import React from 'react';
import {Button, Badge} from 'reactstrap';
import {withRouter} from 'react-router-dom';
import {
    checkCampaniaPedidoProductoCatalogo,
    removePedidoProductoCatalogo
} from "../../../services/PedidoProductoCatalogoServices";

const pedidoProductoCatalogo = (props) => {
    const style = {
        textAlign: 'center'
    }


    function checkCampania() {
        if (props.pedidoProductoCatalogo.estadoCampania) {
            console.log("estadoCampania");

            props.history.push(removePedidoProductoCatalogo(props.pedidoProductoCatalogo.id));

            document.location.reload();

        } else {
            alert("Campaña Cerrada, verificar");
        }


    }

    return (
        <tr>
            <td>{props.pedidoProductoCatalogo.productoCatalogo.id}</td>
            <td>{props.pedidoProductoCatalogo.productoCatalogo.producto.descripcion}</td>
            <td>{props.pedidoProductoCatalogo.productoCatalogo.precio}</td>
            <td>{props.pedidoProductoCatalogo.cantidad}</td>
            <td>
                {props.pedidoProductoCatalogo.cliente ?
                    <h5><Badge
                        color="success">{props.pedidoProductoCatalogo.cliente.persona.nombre + " " + props.pedidoProductoCatalogo.cliente.persona.apellido}</Badge>
                    </h5>
                    :
                    <h5><Badge color="danger">sin cliente</Badge></h5>
                }
            </td>
            <td>
                {props.pedidoProductoCatalogo.revendedora ?
                    <h5><Badge
                        color="success">{props.pedidoProductoCatalogo.revendedora.persona.nombre + " " + props.pedidoProductoCatalogo.revendedora.persona.apellido}</Badge>
                    </h5>
                    :
                    <h5><Badge color="danger">sin revendedora</Badge></h5>
                }
            </td>
            <td style={style}>
                <Button size="sm"
                        onClick={() => props.history.push('/areatrabajo/campania/campaniaactual/pedido/incluirenpedido/editar/  ' + this.props.pedidoProductoCatalogo.pedidoAvon.id + "/" + this.props.pedidoProductoCatalogo.id)}
                        className="btn-outline-secondary"
                        title="editar pedido">
                    <i className="fa fa-pencil"></i>
                </Button>
            </td>
            <td style={style}>

                <Button size="sm"
                        onClick={() => (checkCampania())}
                        className="btn-outline-secondary"
                        title="quitar de pedido">
                    <i className="fa fa-eraser"></i>
                </Button>
            </td>
        </tr>
    );
}

export default withRouter(pedidoProductoCatalogo);