import React from 'react';
import {Table} from 'reactstrap';

import CatalogoFila from './CatalogoFila';

const catalogos = (props) => {
    const style = {
        textAlign: 'center'
    }

    return (
        <Table size="sm" responsive>
            <thead>
            <tr>
                <th>Id</th>
                <th>Descripcion</th>
                <th>Observaciones</th>
                <th>Estado</th>
                <th style={style}></th>
            </tr>
            </thead>
            <tbody>
            {
                props.catalogos.map((catalogo, index) => {
                    return <CatalogoFila key={index}
                                         catalogo={catalogo}/>
                })
            }
            </tbody>
        </Table>
    )
}

export default catalogos;