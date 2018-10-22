import React from 'react';
import {Table} from 'reactstrap';

import RevendedoraFila from './RevendedoraFila';

const revendedoras = (props) => {
    const style = {
        textAlign: 'center'
    }

    return (
        <Table size="sm" responsive>
            <thead>
            <tr>
                <th>Id</th>
                <th>Categoria</th>
                <th>Nombre</th>
                <th>Status</th>
                <th>Fecha Alta</th>
                <th style={style}></th>
            </tr>
            </thead>
            <tbody>
            {
                props.revendedoras.map((revendedora, index) => {
                    return <RevendedoraFila key={index}
                                            revendedora={revendedora}/>
                })
            }
            </tbody>
        </Table>
    )
}

export default revendedoras;