import React from 'react';
import {Button, Badge} from 'reactstrap';
import {withRouter} from 'react-router-dom';
import {pagar} from "../../../services/FacturaServices";
import {removePedidoProductoCatalogo} from "../../../services/PedidoProductoCatalogoServices";
import {recibir} from "../../../services/RemitoProductoServices";

const factura = (props) => {
    const style = {
        textAlign: 'center'
    }

    function pagarFactura() {

        pagar(props.factura.id);

        setTimeout(2000);
        document.location.reload();


    }

    return (
        <tr>
            <td>{props.factura.nroFactura}</td>
            <td>{props.factura.total}</td>
            <td>{props.factura.fechaVencimiento}</td>
            <td>{props.factura.campania.descripcion}</td>
            <td>
                {props.factura.pagado ?
                    <h5><Badge color="success">Pagado</Badge></h5>
                    :
                    <h5><Badge color="danger">no Pagado</Badge></h5>
                }
            </td>

            <td style={style}>
                <Button size="sm"
                        onClick={() => props.history.push(`/areatrabajo/facturas/facturas/editar/${props.factura.id}`)}

                        className="btn-outline-secondary"
                        title="Editar Factura">
                    <i className="fa fa-pencil"></i>
                </Button>
                <Button size="sm"
                        onClick={() => props.history.push(pagarFactura())}
                        className="btn-outline-secondary"
                        title="Pagar Factura">
                    <i className="fa fa-money"></i>
                </Button>
                <Button size="sm"
                        onClick={() => props.history.push(`/areatrabajo/facturas/remitos/factura/${props.factura.id}`)}
                        className="btn-outline-secondary"
                        title="Administrar Remitos">
                    <i className="fa fa-file"></i>
                </Button>
            </td>
        </tr>
    );
}

export default withRouter(factura);