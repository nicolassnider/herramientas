import React from 'react';
import { ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap';

const getBadge = (cantidadMetodos, cantidadMetodosResueltos) => {

    if (cantidadMetodosResueltos === 0)
        return null;

    const classes = cantidadMetodosResueltos === cantidadMetodos ? "fa fa-check text-success" : "fa fa-check text-warning";
    return (<span className="float-right"><i className={classes}></i></span>);
}

const determinacion = (props) => {

    const badge = getBadge(props.cantidadMetodos, props.cantidadMetodosResueltos);

    return (<ListGroupItem
        onClick={() => props.handleClick(props.idDeterminacion)}
        action
        active={props.active} >
        <ListGroupItemHeading>
            {props.titulo}
            {badge}
        </ListGroupItemHeading>
        <ListGroupItemText>{props.descripcion}</ListGroupItemText>
    </ListGroupItem>);
}

export default determinacion;