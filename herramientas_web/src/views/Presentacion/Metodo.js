import React from 'react';
import {Input, InputGroup, InputGroupAddon, InputGroupText} from 'reactstrap';

const metodo = (props) => {

    return (<div>
        <div>
            <h5>{props.titulo}</h5>
            <p>{props.descripcion}</p>
            <p className="lead">{props.instrucciones}</p>
        </div>
        <InputGroup>
            <InputGroupAddon addonType="prepend">
                <InputGroupText>Resultado</InputGroupText>
            </InputGroupAddon>
            <Input type="text" value={props.resultado}
                   onChange={(e) => props.handleChange(props.idDeterminacion, props.idMetodo, e.target.value)}/>
            <InputGroupAddon addonType="append">
                <InputGroupText>{props.unidad}</InputGroupText>
            </InputGroupAddon>
        </InputGroup>
    </div>);
}

export default metodo;