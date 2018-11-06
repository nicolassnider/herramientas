import React from 'react';
import {Table} from 'reactstrap';

import FacturaFila from './FacturaFila';

const facturas = (props) => {
    const style = {
        textAlign: 'center'
    }

    return (
        <Table size="sm" responsive>
            <thead>
            <tr>
                <th>N°Factura</th>
                <th>Total</th>
                <th>F. Venc</th>
                <th>Campaña</th>
                <th>Pago</th>
                <th style={style}></th>
            </tr>
            </thead>
            <tbody>
            {
                props.facturas.map((factura, index) => {
                    return <FacturaFila key={index}
                                        factura={factura}/>
                })
            }
            </tbody>
        </Table>
    )
}

export default facturas;