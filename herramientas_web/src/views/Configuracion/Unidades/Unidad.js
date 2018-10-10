import React, {Component} from 'react';
import { Input, Form, FormFeedback, Alert, Button, Card, CardBody, CardHeader,FormGroup, Label,  Col, Row, CardFooter } from 'reactstrap';
import { getUnidadPorId, nuevaUnidad, editarUnidad } from '../../../services/UnidadesService';
import FormValidation from '../../../utils/FormValidation';
import Validator from '../../../utils/Validator.js';

class Unidad extends Component {
    constructor (props){
        super(props);
        this.state = {
            id: 0,
            descripcion: "",
            error:{
                codigo: 0,
                mensaje: "",
                detalle: []
            },
            modified: false, //Bandera para saber si la unidad fue modificada o no.            
            flagPrimeraVez: true
        }
        this.idUnidad = props.match.params.id;        
        
        this.urlCancelar = "/configuracion/unidades";

        this.submitForm = this.submitForm.bind(this);
        this.newData = this.newData.bind(this);

        this.formValidation = new FormValidation({
			component: this,
			validators: {
                'descripcion': (value) => Validator.lengthNotEmpty(value, 100),
            }
        });
    }
    componentDidMount(){
        getUnidadPorId(this.idUnidad)
        .then(res => res.json())
        .then(            
            (result) => {
                this.setState({
                    id: result.id,
                    descripcion: result.descripcion
                })
            }
        )
    }

    submitForm(event){
        event.preventDefault();
        let unidad = {
            id: this.state.id,
            descripcion: this.state.descripcion
        }        
        if(!this.idUnidad){
            nuevaUnidad(unidad)
            .then(response => {
                if(response.status === 400){
                    response.json()
                    .then(response => {
                        this.setState({
                            error: response,
                            modified : false,
                            flagPrimeraVez : false
                        });                        
                    })
                }else{
                    if(response.status === 201){
                        this.setState({
                            modified : true,
                            error : {
                                codigo : 2001,
                                mensaje : "",
                                detalle : [
                                    "Unidad creada correctamente."
                                ]
                            },
                            flagPrimeraVez : false                            
                        });
                        setTimeout(() => {
                            this.props.history.push("/configuracion/unidades"); 
                        }, 2500);
                    }else{
                        if(response.status === 500){                            
                            this.setState({
                                modified : true,                                
                                error : {
                                    codigo : 5001,
                                    mensaje : "Error, definir mensaje para este status",
                                    detalle : []
                                },
                                flagPrimeraVez : false
                            });
                        }
                    }
                }
            });
        }else{
            editarUnidad(unidad)
            .then(response => {
                if(response.status === 400){
                    response.json()
                    .then(response => {
                        this.setState({
                            error: response,
                            modified : false,
                            flagPrimeraVez : false
                        });                                         
                    })
                }else{
                    if(response.status === 204){
                        this.setState({
                            modified : true,
                            error : {
                                codigo : 2004,
                                mensaje : "",
                                detalle : [
                                    "Unidad modificada correctamente."
                                ]
                            },
                            flagPrimeraVez : false
                        });
                        setTimeout(() => {
                            this.props.history.push("/configuracion/unidades"); 
                        }, 2500);
                    }else{
                        if(response.status === 500){                   
                            this.setState({
                                modified : true,
                                error : {
                                    codigo : 5001,
                                    mensaje : "Error, definir mensaje para este status",
                                    detalle : []
                                },                                
                                flagPrimeraVez : false
                            });
                        }
                    }
                }
            });
        }        
    }

    newData(event){        
        this.setState({
            descripcion: event.target.value
        })
    }
    render(){

        this.formValidation.validate();
        let validationState = this.formValidation.state;

        const estilosFooter = {
            textAlign: 'right',
            button : {
                margin: '5px'
            }
        }

        let mensaje = null;        
        if(!this.state.flagPrimeraVez){
            mensaje =
                !this.state.modified ?
                    this.state.error.codigo === 4000 ?
                        (<Alert color="danger">
                            <strong> {this.state.error.mensaje} </strong> <br />
                            {this.state.error.detalle}
                        </Alert>)
                    :
                        (<Alert color="warning">
                            <strong> {this.state.error.mensaje} </strong> <br />
                            {this.state.error.detalle}
                        </Alert>)
                :
                    this.state.error.codigo === 2001 || this.state.error.codigo === 2004 ?
                        (<Alert color="success">
                            <h6>{this.state.error.detalle}</h6>
                        </Alert>)
                    :
                        (<Alert color="warning">
                            <strong> {this.state.error.mensaje} </strong> <br />
                            {this.state.error.detalle}
                        </Alert>)
        }
        return (
            <Card>
                <Form onSubmit={this.submitForm}>
                    <CardHeader>{!this.idUnidad ? "Crear Unidad de Medida" : "Modificar Unidad de Medida"}</CardHeader>
                    <CardBody>
                        <Row>
                            <Col xs = "12">
                                <FormGroup>
                                    <Label htmlFor="descripcion">Descripción</Label>
                                    <Input  type="textarea" name="descripcion" rows = "2"
                                            onChange={this.newData} placeholder="Ingresar una descripción"
                                            value={this.state.descripcion}
                                            invalid={!validationState.descripcion.pristine && !validationState.descripcion.valid}
                                            /> 
                                    <FormFeedback invalid={!validationState.descripcion.pristine && !validationState.descripcion.valid}>{validationState.descripcion.message}</FormFeedback>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs = "12">
                                {mensaje}
                            </Col>
                        </Row>
                    </CardBody>
                    <CardFooter style={estilosFooter}>
                        <Button 
                            type="submit"
                            color="success"
                            disabled={!validationState.form.valid}>
                            { !this.idUnidad ? "Crear" : "Modificar" }
                        </Button>
                        <Button 
                            color="danger" 
                            onClick={() => this.props.history.push(this.urlCancelar)}>
                            Cancelar
                        </Button>
                    </CardFooter>
                </Form>
            </Card>
        );
    }
}

export default Unidad;