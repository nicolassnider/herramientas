import React from 'react';
import {Button, Badge} from 'reactstrap';
import {withRouter} from 'react-router-dom';
import {
    checkCobrarPedidoAvon, checkEntregarPedidoAvon,
    checkRecibirPedidoAvon,
    cobrarPedidoProductoCatalogo
} from "../../../services/PedidoProductoCatalogoServices";

const pedidoAnterior = (props) => {
    const style = {
        textAlign: 'center'
    }

    async function checkCobrado() {

        await checkCobrarPedidoAvon(props.pedidoAnterior.id);


        window.location.reload();


    }

    async function checkRecibido() {

        await checkRecibirPedidoAvon(props.pedidoAnterior.id);


        window.location.reload();


    }

    async function checkEntregado() {

        await checkEntregarPedidoAvon(props.pedidoAnterior.id);


        window.location.reload();


    }

    return (
        <tr>
            <td>{props.pedidoAnterior.id}</td>
            <td>{props.pedidoAnterior.fechaRecibido}</td>
            <td>
                {props.pedidoAnterior.recibido ?
                    <h5><Badge color="success">Recibido</Badge></h5>
                    :
                    <h5><Badge color="danger">Pendientes</Badge></h5>
                }
            </td>
            <Button size="sm"
                    onClick={() => props.history.push(checkRecibido())}
                    className="btn-outline-secondary"
                    title="check-recibidos">
                <i className="fa fa-check-circle"></i>
            </Button>
            <td>
                {props.pedidoAnterior.cobrado ?
                    <h5><Badge color="success">Cobrado</Badge></h5>
                    :
                    <h5><Badge color="danger">Sin cobrar</Badge></h5>
                }
            </td>
            <Button size="sm"
                    onClick={() => props.history.push(checkCobrado())}
                    className="btn-outline-secondary"
                    title="check-cobrados">
                <i className="fa fa-check"></i>
            </Button>
            <td>
                {props.pedidoAnterior.entregado ?
                    <h5><Badge color="success">Entregado</Badge></h5>
                    :
                    <h5><Badge color="danger">Pendientes</Badge></h5>
                }
            </td>
            <Button size="sm"
                    onClick={() => props.history.push(checkRecibido())}
                    className="btn-outline-secondary"
                    title="check-recibidos">
                <i className="fa fa-check-circle"></i>
            </Button>
            <td style={style}>
                <Button size="sm"
                        onClick={() => props.history.push(`/areatrabajo/pedidosanteriores/pedidosanteriores/${props.pedidoAnterior.id}`)}
                        className="btn-outline-secondary"
                        title="ver pedido">
                    <i className="fa fa-pencil"></i>
                </Button>
            </td>
        </tr>
    );
}

export default withRouter(pedidoAnterior);