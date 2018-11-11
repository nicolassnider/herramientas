import React from 'react';
import {Button, Badge} from 'reactstrap';
import {withRouter} from 'react-router-dom';
import {pagar} from "../../../services/RemitoServices";
import {removePedidoProductoCatalogo} from "../../../services/PedidoProductoCatalogoServices";

const remito = (props) => {
    const style = {
        textAlign: 'center'
    }

    return (
        <tr>
            <td>{props.remito.numeroRemito}</td>

            <td style={style}>
                <Button size="sm"
                        onClick={() => props.history.push(`/areatrabajo/facturass/remitos/editar/${props.remito.id}`)}

                        className="btn-outline-secondary"
                        title="Editar Remito">
                    <i className="fa fa-pencil"></i>
                </Button>
                <Button size="sm"
                        onClick={() => props.history.push(`/areatrabajo/facturass/remitos/remitoproductos/${props.remito.id}`)}

                        className="btn-outline-secondary"
                        title="Listar productos">
                    <i className="fa fa-plus-square"></i>
                </Button>
            </td>
        </tr>
    );
}

export default withRouter(remito);