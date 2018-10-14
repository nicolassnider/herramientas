import React from 'react';
import { Table } from 'reactstrap';

import SerieFila from './SerieFila';

const series = (props) => {
    const style = {
        textAlign: 'center'
    }

    return(
        <Table size="sm" responsive>
            <thead>
                <tr>
                    
                    <th>Carga Inicio</th>
                    <th>Carga Fin</th>
                    <th>Envío Muestra</th>
                    <th>Responsable de Envío</th>
                    <th style={style}></th>
                </tr>
            </thead>
            <tbody>
                {
                    props.series.map((serie, index) => {
                        return <SerieFila  key = {index}
                                            serie = {serie} />                        
                    })
                }
            </tbody>
        </Table>        
    )
}

export default series;