import React from 'react';
import {Button, Badge} from 'reactstrap';
import {withRouter} from 'react-router-dom';
import {
    checkCampaniaPedidoProductoCatalogo, cobrarPedidoProductoCatalogo, entregarProductoCatalogo,
    removePedidoProductoCatalogo
} from "../../../services/PedidoProductoCatalogoServices";
import {pagar} from "../../../services/FacturaServices";


const pedidoProductoCatalogo = (props) => {
    console.log(props.pedidoProductoCatalogo.revendedora);

    const style = {
        textAlign: 'center'
    }


    function checkCampaniaForRemove() {
        if (props.pedidoProductoCatalogo.estadoCampania) {
            console.log("estadoCampania");

            props.history.push(removePedidoProductoCatalogo(props.pedidoProductoCatalogo.id));

            document.location.reload();

        } else {
            alert("Campaña Cerrada, verificar");
        }


    }

    function checkCampaniaForUpdate() {
        if (props.pedidoProductoCatalogo.estadoCampania) {
            console.log("estadoCampania");

            document.location.reload();

        } else {
            alert("Campaña Cerrada, verificar");
        }


    }

    async function cobrarPedido() {

        await cobrarPedidoProductoCatalogo(props.pedidoProductoCatalogo.id);


        window.location.reload();


    }

    async function entregarPedido() {


        await entregarProductoCatalogo(props.pedidoProductoCatalogo.id)

        window.location.reload();


    }


    return (
        <tr>
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
                        color="danger">{props.pedidoProductoCatalogo.revendedora.persona.nombre + " " + props.pedidoProductoCatalogo.revendedora.persona.apellido + " (R)"}</Badge>
                    </h5>
                }
            </td>
            <td>{props.pedidoProductoCatalogo.saldo}</td>
            <td>
                {props.pedidoProductoCatalogo.recibido ?
                    <h5><Badge color="success">Rec</Badge></h5>
                    :
                    <h5><Badge color="danger">Pen</Badge></h5>
                }
            </td>
            <td>
                {props.pedidoProductoCatalogo.entregado ?
                    <h5><Badge color="success">Ent</Badge></h5>
                    :
                    <h5><Badge color="danger">Pen</Badge></h5>
                }
            </td>
            <td>
                {props.pedidoProductoCatalogo.cobrado ?
                    <h5><Badge color="success">Cob</Badge></h5>
                    :
                    <h5><Badge color="danger">Pen</Badge></h5>
                }
            </td>

            <td style={style}>
                <Button size="sm"
                        onClick={() => props.history.push('/administracion/pedido/saldar/' + props.pedidoProductoCatalogo.id)}
                        className="btn-outline-secondary"
                        title="Saldo Parcial">
                    <i className="fa fa-pencil"></i>
                </Button>
            </td>

            <td style={style}>
                <Button size="sm"
                        onClick={() => props.history.push(entregarPedido())}
                        className="btn-outline-secondary"
                        title="entregar pedido">
                    <i className="fa fa-user"></i>
                </Button>
            </td>
            <td style={style}>
                <Button size="sm"
                        onClick={() => props.history.push(cobrarPedido())}
                        className="btn-outline-secondary"
                        title="cobrar pedido">
                    <i className="fa fa-money"></i>
                </Button>
            </td>
            <td style={style}>

                <Button size="sm"
                        onClick={() => (checkCampaniaForRemove())}
                        className="btn-outline-secondary"
                        title="quitar de pedido">
                    <i className="fa fa-eraser"></i>
                </Button>
            </td>
        </tr>
    );
}

export default withRouter(pedidoProductoCatalogo);