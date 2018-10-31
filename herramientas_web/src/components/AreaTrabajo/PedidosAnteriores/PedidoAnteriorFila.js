import React from 'react';
import {Button, Badge} from 'reactstrap';
import {withRouter} from 'react-router-dom';

const pedidoAnterior = (props) => {
    const style = {
        textAlign: 'center'
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
            <td>
                {props.pedidoAnterior.cobrado ?
                    <h5><Badge color="success">Cobrado</Badge></h5>
                    :
                    <h5><Badge color="danger">Sin cobrar</Badge></h5>
                }
            </td>
            <td style={style}>
                <Button size="sm"
                        onClick={() => props.history.push(`/areatrabajo/pedidosanteriores/pedidosanteriores/${props.pedidoAnterior.id}`)}
                        className="btn-outline-secondary"
                        title="ver pedido">;
                    <i className="fa fa-pencil"></i>
                </Button>
            </td>
        </tr>
    );
}

export default withRouter(pedidoAnterior);