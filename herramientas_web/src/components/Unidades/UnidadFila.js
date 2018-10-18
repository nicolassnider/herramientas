import React from 'react';
import {Button} from 'reactstrap';
import {withRouter} from "react-router-dom";

const unidad = (props) => {
    const style = {
        textAlign: 'center'
    }

    return (
        <tr>
            <td>{props.unidad.descripcion}</td>
            <td style={style}>
                <Button size="sm"
                        onClick={() => props.history.push(`/configuracion/unidades/editar/${props.unidad.id}`)}
                        className="btn-outline-secondary"
                        color="secondary">
                    <i className="fa fa-pencil"></i>
                </Button>
            </td>
        </tr>
    );
}

export default withRouter(unidad);