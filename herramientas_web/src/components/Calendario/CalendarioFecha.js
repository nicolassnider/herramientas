import React from 'react';
import {Row, Col, Button, Card, CardHeader, CardBody} from 'reactstrap';
import { withRouter } from 'react-router-dom';

import moment from 'moment';

const CalendarioFecha = (props) => {
    let titleHeader = {
        fontSize: "1.05em",
        fontWeight: "bold"
    }

    return(
        <React.Fragment>
            <Card>
                <CardHeader style={titleHeader}>
                    {
                        props.isActive  ?
                            "Serie Activa"
                        :
                            "Próxima Serie"
                    }
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col lg={props.isActive && !props.forPresentacion ? "3" : "4"}>
                            <div className="callout callout-info">
                                <span className="text-muted">Inicio</span>
                                <br />
                                <div>
                                    <div className="text-value">{moment(props.serie.cargaInicio).format("DD/MM/YYYY")}</div>
                                </div>
                            </div>
                        </Col>
                        <Col lg={props.isActive && !props.forPresentacion ? "3" : "4"}>
                            <div className="callout callout-info">
                                <span className="text-muted">Fin</span>
                                <br />
                                <div>
                                    <div className="text-value">{moment(props.serie.cargaFin).format("DD/MM/YYYY")}</div>
                                </div>
                            </div>
                        </Col>
                        <Col lg={props.isActive && !props.forPresentacion ? "3" : "4"}>
                            <div className="callout callout-info">
                                <span className="text-muted">Envío de la muestra</span>
                                <br />
                                <div>
                                    <div className="text-value">{moment(props.serie.envioMuestra).format("DD/MM/YYYY")}</div>
                                </div>
                            </div>
                        </Col>
                        {
                            props.isActive && !props.forPresentacion ?
                                <Col lg="3">
                                    <div style={{ height: "84px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Button color="primary" className="btn-lg" 
                                                onClick = {()=>props.history.push(`/presentacion`)}>
                                            Presentar Resultados
                                        </Button>
                                    </div>
                                </Col>
                            :   ""
                        }    
                    </Row>
                </CardBody>                
            </Card>
        </React.Fragment>
    );    
};

export default withRouter(CalendarioFecha);