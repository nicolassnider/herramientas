import React from 'react';
import { Table } from 'reactstrap';

import UnidadFila from './UnidadFila';

const unidades = (props) =>{ 
    const style= {
        textAlign: 'center'
    }   
    return(
        <Table size="sm" responsive>
            <thead>
              <tr>                
                <th className="col-sm-10">Descripción</th>
                <th style={style}></th>
              </tr>
            </thead>
            <tbody>
              { 
                props.unids.map((unidad, index) => {
                return <UnidadFila 
                          key = {unidad.id}
                          unidad = {unidad}
                        />})
              }
            </tbody>
        </Table>        
    );
}

export default unidades;