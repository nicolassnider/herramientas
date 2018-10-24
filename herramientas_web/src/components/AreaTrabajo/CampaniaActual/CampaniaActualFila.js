import React from 'react';
import {Button, Badge} from 'reactstrap';
import {withRouter} from 'react-router-dom';

const campania = (props) => {
    const style = {
        textAlign: 'center'
    }

    return (
        <tr>
            <td>{props.campania.id}</td>
            <td>{props.campania.fechaInicio}</td>
            <td>{props.campania.fechaFin}</td>
            <td>{props.campania.descripcion}</td>
            <td>
                {props.campania.activo ?
                    <h5><Badge color="success">Activo</Badge></h5>
                    :
                    <h5><Badge color="danger">Inactivo</Badge></h5>
                }
            </td>
            <td style={style}>
                <Button size="sm"
                        onClick={() => props.history.push(`/administracion/campanias/editar/${props.campania.id}`)}
                        className="btn-outline-secondary">
                    <i className="fa fa-pencil"></i>
                </Button>
            </td>
        </tr>
    );
}

export default withRouter(campania);