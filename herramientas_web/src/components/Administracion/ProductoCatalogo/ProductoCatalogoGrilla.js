import React from 'react';
import {Table} from 'reactstrap';

import ProductoCatalogoFila from './ProductoCatalogoFila';

const productoCatalogos = (props) => {
    const style = {
        textAlign: 'center'
    }

    return (
        <Table size="sm" responsive>
            <thead>
            <tr>
                <th>Catalogo</th>
                <th>Precio</th>
                <th>Activo</th>
                <th style={style}></th>
            </tr>
            </thead>
            <tbody>
            {
                props.productoCatalogos.map((productoCatalogo, index) => {
                    return <ProductoCatalogoFila key={index}
                                                 productoCatalogo={productoCatalogo}/>
                })
            }
            </tbody>
        </Table>
    )
}

export default productoCatalogos;