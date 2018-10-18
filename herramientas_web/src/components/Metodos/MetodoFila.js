import React from 'react';
import {Button, Badge} from 'reactstrap';
import {withRouter} from 'react-router-dom';

const metodo = (props) => {
    const style = {
        textAlign: 'center'
    }

    return (
        <tr>
            <td>{props.metodo.titulo}</td>
            <td>{props.metodo.descripcion}</td>
            <td>{props.metodo.determinacionDescripcion}</td>
            <td>
                {props.metodo.activo ?
                    <h5><Badge color="success">Activo</Badge></h5>
                    :
                    <h5><Badge color="danger">Inactivo</Badge></h5>
                }
            </td>
            <td style={style}>
                <Button size="sm"
                        onClick={() => props.history.push(`/configuracion/metodos/editar/${props.metodo.id}`)}
                        className="btn-outline-secondary">
                    <i className="fa fa-pencil"></i>
                </Button>
            </td>
        </tr>
    );
}

export default withRouter(metodo);