import React from 'react';
import {Button, Badge} from 'reactstrap';
import {withRouter} from 'react-router-dom';


const unidad = (props) => {


    const style = {
        textAlign: 'center'
    }


    return (
        <tr>
            <td>{props.unidad.id}</td>
            <td>{props.unidad.descripcion}</td>


            <td style={style}>
                <Button size="sm"
                        onClick={() => props.history.push(`/administracion/productocatalogo/unidades/${props.unidad.id}`)}
                        className="btn-outline-secondary"
                        title="Editar">
                    <i className="fa fa-pencil-square-o"></i>
                </Button>
            </td>
        </tr>
    );
}

export default withRouter(unidad);