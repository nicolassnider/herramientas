import React from 'react';
import {Button, Badge} from 'reactstrap';
import {withRouter} from 'react-router-dom';

const cliente = (props) => {
    const style = {
        textAlign: 'center'
    }

    return (
        <tr>
            <td>{props.cliente.id}</td>
            <td>{props.cliente.categoriaCliente.descripcion}</td>
            <td>{props.cliente.persona.nombre + " " + props.cliente.persona.apellido}</td>
            <td>{props.cliente.revendedora.persona.nombre + " " + props.cliente.revendedora.persona.apellido}</td>
            <td>
                {props.cliente.activo ?
                    <h5><Badge color="success">Activo</Badge></h5>
                    :
                    <h5><Badge color="danger">Inactivo</Badge></h5>
                }
            </td>
            <td>
                {props.cliente.madre ?
                    <h5><Badge color="info">SI</Badge></h5>
                    :
                    <h5><Badge color="info"> </Badge></h5>
                }
            </td>
            <td>{props.cliente.fechaAltaCliente}</td>
            <td style={style}>
                <Button size="sm"
                        onClick={() => props.history.push(`/administracion/personas/clientes/editar/${props.cliente.id}`)}
                        className="btn-outline-secondary"
                        title="Nuevo cliente">
                    <i className="fa fa-pencil-square-o"></i>
                </Button>
                <Button size="sm"
                        onClick={() => props.history.push(`/administracion/personas/clientes/editar/${props.cliente.id}`)}
                        className="btn-outline-secondary"
                        title="Nuevo cliente">
                    <i className="fa fa-pencil-square"></i>
                </Button>
                <Button size="sm"
                        onClick={() => props.history.push(`/administracion/personas/clientes/editar/${props.cliente.id}`)}
                        className="btn-outline-secondary">
                    <i className="fa fa-pencil"></i>
                </Button>
            </td>
        </tr>
    );
}

export default withRouter(cliente);