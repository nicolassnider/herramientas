import React from 'react';
import { Button, Badge } from 'reactstrap';
import { withRouter } from 'react-router-dom';

const determinacion = (props) => {
    const style = {
        textAlign: 'center'
    }

    return(
        <tr>
            <td>{props.determinacion.titulo}</td>
            <td>{props.determinacion.descripcion}</td>
            <td>
                {props.determinacion.activo ?
                    <h5><Badge color="success">Activo</Badge></h5>
                :
                    <h5><Badge color="danger">Inactivo</Badge></h5>
                }
            </td>
            <td style={style}>
                <Button size = "sm"
                        onClick = {()=>props.history.push(`/configuracion/determinaciones/editar/${props.determinacion.id}`)}
                        className = "btn-outline-secondary"
                        color = "secondary" >
                    <i className = "fa fa-pencil"></i>
                </Button>
            </td>
        </tr>
    );
}

export default withRouter(determinacion);