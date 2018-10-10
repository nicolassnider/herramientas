import React from 'react';
import { Table } from 'reactstrap';

import LaboratorioFila from './LaboratorioFila';

const laboratorios = (props) =>{
    const style = {
        textAlign: 'center'
    }
    return(
        <Table size="sm" responsive>
            <thead>
                <tr>                    
                    <th >Código</th>
                    <th >Descripción</th>
                    <th >Estado</th>
                    <th style={style}></th>
                </tr>
            </thead>
            <tbody>
                {
                    props.laboratorios.map((laboratorio, index) => {
                        return <LaboratorioFila key = {index}
                                                laboratorio = {laboratorio} />
                    })
                }
            </tbody>
        </Table>
    );
}

export default laboratorios;