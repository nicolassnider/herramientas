import React from 'react';
import {Button, Badge} from 'reactstrap';
import {withRouter} from 'react-router-dom';

const catalogo = (props) => {
    const style = {
        textAlign: 'center'
    }

    return (
        <tr>
            <td>{props.catalogo.id}</td>
            <td>{props.catalogo.descripcion}</td>
            <td>{props.catalogo.observaciones}</td>
            <td>
                {props.catalogo.activo ?
                    <h5><Badge color="success">Activo</Badge></h5>
                    :
                    <h5><Badge color="danger">Inactivo</Badge></h5>
                }
            </td>
            <td style={style}>            
                <Button size="sm"
                        onClick={() => props.history.push(`/administracion/catalogos/editar/${props.catalogo.id}`)}
                        className="btn-outline-secondary">
                    <i className="fa fa-pencil"></i>
                </Button>
            </td>
        </tr>
    );
}

export default withRouter(catalogo);