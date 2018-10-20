import React from 'react';
import {Button, Badge} from 'reactstrap';
import {withRouter} from 'react-router-dom';

const persona = (props) => {
    const style = {
        textAlign: 'center'
    }

    return (
        <tr>
            <td>{props.persona.id}</td>
            <td>{props.persona.tipoDocumento.descripcion}</td>
            <td>{props.persona.documento}</td>
            <td>{props.persona.nombre}</td>
            <td>{props.persona.apellido}</td>
            <td>
                {props.persona.activo ?
                    <h5><Badge color="success">Activo</Badge></h5>
                    :
                    <h5><Badge color="danger">Inactivo</Badge></h5>
                }
            </td>
            <td>
                {props.persona.esUsuario ?
                    <h5><Badge color="info">Vendedora</Badge></h5>
                    :
                    <h5><Badge color="info">Cliente</Badge></h5>
                }
            </td>
            <td>{props.persona.fechaAltaPersona}</td>
            <td style={style}>
                <Button size="sm"
                        onClick={() => props.history.push(`/administracion/personas/editar/${props.persona.id}`)}
                        className="btn-outline-secondary">
                    <i className="fa fa-pencil"></i>
                </Button>
            </td>
        </tr>
    );
}

export default withRouter(persona);