import React, { Component } from 'react';
import { Label, Input, FormGroup, Row, Col, Card, CardHeader, CardBody, TabContent, TabPane, ListGroup, CardFooter, Button } from 'reactstrap';
import Determinacion from './Determinacion';
import Metodo from './Metodo';
import Select from 'react-select';

import CalendarioFecha from '../../components/Calendario/CalendarioFecha';

import { getAllDeterminaciones } from '../../services/DeterminacionesServices';

class Presentacion extends Component {

    constructor(props) {
        super(props);

        this.state = {
            determinaciones: null,
            determinacionActiva: null,
            loaded: false            
        }
    }

    componentDidMount(){
        let currentState = {...this.state};
        let that = this;
        let arrayPromises = [];
        let p1 = getAllDeterminaciones().then(result=>result.json());

        arrayPromises.push(p1);

        Promise.all(arrayPromises).
        then(
            (result) => {   
                let determinaciones = [];
                let metodos = [];                
                result[0].map((det, index) => {
                    let determinacion = {
                        idDeterminacion : "",
                        titulo : "",
                        descripcion : "",                        
                        metodos: [],
                        cantidadMetodos: "",
                        cantidadMetodosResueltos: ""
                    }
                    determinacion.idDeterminacion = det.id;
                    determinacion.titulo = det.titulo;
                    determinacion.descripcion = det.descripcion;                    

                    det.metodos.map((met, index) => {
                        let metodo = {
                            idMetodo: "",
                            titulo: "",
                            descripcion: "",
                            instrucciones: "",
                            unidad: {
                                id: "",
                                descripcion: ""
                            },
                            resultado: ""
                        }
                        
                        metodo.idMetodo = met.id;
                        metodo.titulo = met.titulo;
                        metodo.descripcion = met.descripcion;
                        metodo.instrucciones = met.instrucciones;
                        metodo.unidad.id = met.unidad.id;
                        metodo.unidad.descripcion = met.unidad.descripcion;
                        metodo.resultado = met.resultado;
                        
                        metodos.push(metodo);
                    });                    
                    determinacion.metodos = metodos;
                    determinacion.cantidadMetodos = determinacion.metodos.length;
                    determinacion.cantidadMetodosResueltos = 0;
                    determinaciones.push(determinacion);
                    metodos = [];
                });
                currentState.determinaciones = determinaciones;
                currentState.determinacionActiva = determinaciones[0].idDeterminacion;
                currentState.loaded = true;
                that.setState(currentState,console.log(currentState));
            }
        )




        
    }

    handlerDeterminacionClick = (idDeterminacion) => {
        let stateCopy = { ...this.state };
        stateCopy.determinacionActiva = idDeterminacion;        
        this.setState(stateCopy);
    }

    handlerResultadoChange = (idDeterminacion, idMetodo, resultado) => {
        let stateCopy = { ...this.state };
        const determinacion = stateCopy.determinaciones.find(x => x.id === idDeterminacion);
        let count = 0;
        determinacion.metodos.map((metodo, index) => {
            if (metodo.idMetodo === idMetodo)
                metodo.resultado = resultado;
            if (metodo.resultado && metodo.resultado !== null && metodo.resultado !== '')
                count++;
        });
        determinacion.cantidadMetodosResueltos = count;
        this.setState(stateCopy);
    }

    render() {
        if (!this.state.loaded)
        return null;

        const currentState = { ...this.state };        
        const determinaciones = currentState.determinaciones.map((determinacion, index) => {
            return (<Determinacion
                key={index}
                idDeterminacion={determinacion.idDeterminacion}
                titulo={determinacion.titulo}
                descripcion={determinacion.descripcion}
                active={determinacion.idDeterminacion === currentState.determinacionActiva}
                cantidadMetodos={determinacion.cantidadMetodos}
                cantidadMetodosResueltos={determinacion.cantidadMetodosResueltos}
                handleClick={this.handlerDeterminacionClick}
            />)
        });

        const metodos = currentState.determinaciones.map((determinacion, index) => {
            return (
                <TabPane key={index} tabId={determinacion.idDeterminacion} >
                    {   
                        determinacion.metodos.map((metodo, index) => {                        
                        const separador = index !== 0 ? (<hr></hr>) : null;
                        return (
                            <React.Fragment key={index}>
                                {separador}
                                <Metodo
                                    idDeterminacion={determinacion.idDeterminacion}
                                    idMetodo={metodo.idMetodo}
                                    titulo={metodo.titulo}
                                    instrucciones={metodo.instrucciones}
                                    descripcion={metodo.descripcion}
                                    resultado={metodo.resultado}
                                    handleChange={this.handlerResultadoChange}
                                    unidad={metodo.unidad.descripcion}
                                />
                            </React.Fragment>)
                    })}
                </TabPane>
            );
        });

        return (
            <Row>
                <Col xs="12">
                        <CalendarioFecha    serie="" 
                                            isActive = {true}
                                            forPresentacion = {true}
                        />
                        
                    
                </Col>
                <Col xs="12">
                    <Card>
                        <CardHeader>
                            Presentación
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col lg="3" sm="4">
                                    <FormGroup>
                                        <Label>Botella</Label>
                                        <Input type="text" />
                                    </FormGroup>
                                </Col>
                                <Col lg="3" sm="4">
                                    <FormGroup>
                                        <Label>Agitación</Label>
                                        <Select options={   [{ value: "Conforme ASTM D5854", label: "Conforme ASTM D5854" },
                                                             { value: "Agitación Mecánica", label: "Agitación Mecánica" },
                                                             { value: "Agitación Manual", label: "Agitación Manual" },
                                                             { value: "Otra", label: "Otra" }
                                                            ]}>
                                        </Select>
                                    </FormGroup>
                                </Col>
                                <Col lg="6" sm="4">
                                    <FormGroup>
                                        <Label>Comentarios</Label>
                                        <Input  type="text" maxLength="100"
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <hr></hr>
                            <Row>
                                <Col sm="3">
                                    <ListGroup id="list-tab" role="tablist">
                                        {determinaciones}
                                    </ListGroup>
                                </Col>
                                <Col sm="9">
                                    <TabContent
                                        className="border-0"
                                        activeTab={currentState.determinacionActiva}>                                        
                                        {metodos}                                        
                                    </TabContent>
                                </Col>
                            </Row>
                        </CardBody>
                        <CardFooter style={{ textAlign: "right" }}>
                            <Button
                                style={{ marginLeft: "5px" }}
                                color="success"
                            >
                                Guardar
                                </Button>
                            <Button
                                style={{ marginLeft: "5px" }}
                                color="success"
                                onClick={() => this.props.history.push({
                                    pathname: '/presentacion/resumen',
                                    state: { serie: "1", a: 1 }
                                })}
                            >
                                Envío de Resultados
                                </Button>
                            <Button
                                style={{ marginLeft: "5px" }}
                                color="danger"
                                onClick={() => this.props.history.push("/")}
                            >
                                Cancelar
                                </Button>
                        </CardFooter>
                    </Card>
                </Col>
            </Row>
        );
    }
}

export default Presentacion;