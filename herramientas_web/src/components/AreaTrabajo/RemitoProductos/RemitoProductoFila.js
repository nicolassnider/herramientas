import React from 'react';
import {Button, Badge} from 'reactstrap';
import {withRouter} from 'react-router-dom';
import {pagar} from "../../../services/RemitoServices";
import {removePedidoProductoCatalogo} from "../../../services/PedidoProductoCatalogoServices";
import {recibir} from "../../../services/RemitoProductoServices";
import {selectProductos} from "../../../services/ProductoServices";

const remito = (props) => {
    const style = {
        textAlign: 'center'
    }

    function recibirItem() {

        recibir(props.remitoProducto.id);

        setTimeout(2000);
        document.location.reload();


    }

    return (
        <tr>
            <td>{props.remitoProducto.remito.numeroRemito}</td>
            <td>{props.remitoProducto.producto.id}</td>
            <td>{props.remitoProducto.producto.descripcion}</td>
            <td>{props.remitoProducto.cantidad}</td>
            <td>
                {props.remitoProducto.recibido ?
                    <h5><Badge color="success">Recibido</Badge></h5>
                    :
                    <h5><Badge color="danger">Pendiente</Badge></h5>
                }
            </td>


            <td style={style}>
                <Button size="sm"
                        onClick={() => props.history.push(`/areatrabajo/facturass/remitos/editar/${props.remitoProducto.id}`)}

                        className="btn-outline-secondary"
                        title="Editar Remito">
                    <i className="fa fa-pencil"></i>
                </Button>
                <Button size="sm"
                        onClick={() => props.history.push(`/areatrabajo/facturass/remitos/incluirproductosenremito/${props.remito.id}`)}

                        className="btn-outline-secondary"
                        title="Editar Remito">
                    <i className="fa fa-plus-square"></i>
                </Button>
                <Button size="sm"
                        onClick={() => props.history.push(recibirItem())}

                        className="btn-outline-secondary"
                        title="Recibir Producto">
                    <i className="fa fa-check"></i>
                </Button>

            </td>
        </tr>
    );
}

export default withRouter(remito);