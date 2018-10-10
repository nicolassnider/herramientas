import React from 'react';
import { Table, Alert, Col, Row } from 'reactstrap';

import CalendarioFila from './CalendarioFila';

const CalendarioGrilla = (props) => {
    const style = {
        textAlign: 'center'
    }

    return(
        <React.Fragment>
            {   props.seriesPorAnio.length > 0 ?
                <Table size="sm" responsive>
                    <thead>
                        <tr>                    
                            <th style={style}>Estado</th>
                            <th>Serie</th>
                            <th style={style}>Envío Muestra</th>
                            <th>Responsable de Envío</th>
                            <th>Informe</th>
                        </tr>
                    </thead>            
                    <tbody>
                        {                       
                            props.seriesPorAnio.map((serie, index) => {
                                return <CalendarioFila   key = {index}
                                                        serie = {serie} />
                            })                                            
                        }                
                    </tbody>
                </Table>    :
                <Row>
                    <Col xs={{size: 4, offset: 3}}>                            
                        <Alert color="primary" style={{textAlign: "center"}}>
                            <strong> No hay series cargadas en este año. </strong>
                        </Alert>
                    </Col>
                </Row>
            }            
        </React.Fragment>
    )
}

export default CalendarioGrilla;