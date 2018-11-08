import React from 'react';
import {Table} from 'reactstrap';

import RemitoFila from './RemitoFila';

const remitos = (props) => {
    const style = {
        textAlign: 'center'
    }

    return (
        <Table size="sm" responsive>
            <thead>
            <tr>
                <th>N°Remito</th>
                <th style={style}></th>
            </tr>
            </thead>
            <tbody>
            {
                props.remitos.map((remito, index) => {
                    return <RemitoFila key={index}
                                       remito={remito}/>
                })
            }
            </tbody>
        </Table>
    )
}

export default remitos;