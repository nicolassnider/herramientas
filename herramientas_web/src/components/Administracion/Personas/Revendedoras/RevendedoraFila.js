import React from 'react';
import {Button, Badge} from 'reactstrap';
import {withRouter} from 'react-router-dom';
import {descargaClientesPorRevendedora} from "../../../../services/ClientesServices";

const revendedora = (props) => {
    const style = {
        textAlign: 'center'
    }

    return (
        <tr>
            <td>{props.revendedora.id}</td>
            <td>{props.revendedora.categoriaRevendedora.descripcion}</td>
            <td>{props.revendedora.persona.nombre + " " + props.revendedora.persona.apellido}</td>
            <td>
                {props.revendedora.activo ?
                    <h5><Badge color="success">Activo</Badge></h5>
                    :
                    <h5><Badge color="danger">Inactivo</Badge></h5>
                }
            </td>
            <td style={style}>
                <Button size="sm"
                        onClick={() => props.history.push(`/administracion/personas/revendedora/editar/${props.revendedora.id}`)}
                        className="btn-outline-secondary"
                        title="Editar Revendedora">
                    <i className="fa fa-pencil-square-o"></i>
                </Button>
                <Button size="sm"
                        onClick={() => props.history.push(`/administracion/personas/revendedoras/usuarios/editar/${props.revendedora.usuario.id}`)}
                        className="btn-outline-secondary"
                        title="Editar Usuario">
                    <i className="fa fa-pencil-square"></i>
                </Button>
                <Button size="sm"
                        onClick={() => props.history.push(descargaClientesPorRevendedora(props.revendedora.id))}
                        className="btn-outline-secondary"
                        title="Clientes por Revendedora">
                    <i className="fa fa-smile-o"></i>
                </Button>

            </td>
        </tr>
    );
}

export default withRouter(revendedora);