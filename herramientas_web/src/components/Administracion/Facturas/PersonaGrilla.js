import React from 'react';
import {Table} from 'reactstrap';

import PersonaFila from './PersonaFila';

const personas = (props) => {
    const style = {
        textAlign: 'center'
    }

    return (
        <Table size="sm" responsive>
            <thead>
            <tr>
                <th>Id</th>
                <th>Tipo Doc.</th>
                <th>Documento</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Status</th>
                <th>Tipo</th>
                <th>Fecha Alta</th>
                <th style={style}></th>
            </tr>
            </thead>
            <tbody>
            {
                props.personas.map((persona, index) => {
                    return <PersonaFila key={index}
                                        persona={persona}/>
                })
            }
            </tbody>
        </Table>
    )
}

export default personas;