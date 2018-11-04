import React from 'react';
import {Table} from 'reactstrap';

import UnidadFila from './UnidadesFila';

const unidades = (props) => {
    const style = {
        textAlign: 'center'
    }

    return (
        <Table size="sm" responsive>
            <thead>
            <tr>
                <th>id</th>
                <th>Descripcion</th>
                <th style={style}></th>
            </tr>
            </thead>
            <tbody>
            {
                props.unidades.map((unidad, index) => {
                    return <UnidadFila key={index}
                                       unidad={unidad}/>
                })
            }
            </tbody>
        </Table>
    )
}

export default unidades;