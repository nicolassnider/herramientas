import React, {Component} from 'react';
import { Input, Col, Alert, Card, Form, FormFeedback, CardHeader, CardBody, CardFooter, Button, Row, FormGroup, Label } from 'reactstrap';
import { getDeterminacionPorId, nuevaDeterminacion, editarDeterminacion } from '../../../services/DeterminacionesServices';
import Switch from 'react-switch';
import Validator from '../../../utils/Validator.js';
import FormValidation from '../../../utils/FormValidation';

class Determinacion extends Component{
    constructor(props){
        super(props);
        this.state = {
            determinacion: {
                id: null,
                titulo: null,
                descripcion: "",
                activo: false
            },
            error: {
                codigo: 0,
                mensaje: "",
                detalle: []
            },
            modified: false,
            flagPrimeraVez: true
        },
        this.idDeterminacion = props.match.params.id;

        this.urlCancelar = "/configuracion/determinaciones";

        this.submitForm = this.submitForm.bind(this);
        this.newData = this.newData.bind(this);
        this.handleSwitch = this.handleSwitch.bind(this);

        this.formValidation = new FormValidation({
            component: this,
            validators: {
                'determinacion.titulo': (value) => Validator.lengthNotEmpty(value, 100)
            }
        });
    }

    componentDidMount(){
        getDeterminacionPorId(this.idDeterminacion)
        .then(result => result.json())
        .then(
            (result) => {
                this.setState({
                    determinacion: {
                        id: result.id,
                        titulo: result.titulo,
                        descripcion: result.descripcion,
                        activo: result.activo
                    }
                })
            }
        )
    }

    submitForm(event){
        event.preventDefault();
        let determinacion = this.state.determinacion;
        if(!this.idDeterminacion){
            nuevaDeterminacion(determinacion)
            .then(response => {
                if(response.status === 400){
                    response.json()
                    .then(response => {
                        this.setState({
                            error: response,
                            modified: false,
                            flagPrimeraVez: false
                        });
                    })
                }else{
                    if(response.status === 201){
                        this.setState({
                            modified: true,
                            error: {
                                codigo: 2001,
                                mensaje: "",
                                detalle: [
                                    "Determinación creada correctamente."
                                ]
                            },
                            flagPrimeraVez: false
                        });
                        setTimeout(() => {
                            this.props.history.push("/configuracion/determinaciones");
                        }, 2500);
                    }else{
                        if(response.status === 500){
                            this.setState({
                                modified: true,
                                error: {
                                    codigo: 5001,
                                    mensaje: "Error, definir mensaje para este status",
                                    detalle: []
                                },
                                flagPrimeraVez: false
                            });
                        }
                    }
                }
            });
        }else{
            editarDeterminacion(determinacion)
            .then(response => {
                if(response.status === 400){
                    response.json()
                    .then(response => {
                        this.setState({
                            error: response,
                            modified: false,
                            flagPrimeraVez: false
                        });
                    })
                }else{
                    if(response.status === 204){
                        this.setState({
                            modified: true,
                            error: {
                                codigo: 2004,
                                mensaje: "",
                                detalle: [
                                    "Determinación modificada correctamente."
                                ]
                            },
                            flagPrimeraVez: false
                        });
                        setTimeout(()=>{
                            this.props.history.push("/configuracion/determinaciones");
                        },2500);
                    }
                }
            })
        }
    }

    handleSwitch(checked){
        const determinacion = this.state.determinacion;
        determinacion.activo = checked;
        this.setState({
            determinacion: determinacion
        })
    }

    newData(event){
        const determinacion = this.state.determinacion;
        determinacion[event.target.name] = event.target.value;
        this.setState({
            determinacion: determinacion
        })
    }
        
    render(){

        this.formValidation.validate();
        let validationState = this.formValidation.state;

        let footerStyles = {
            textAlign: 'right'
        }
        

        let mensaje = null;
        if(!this.state.flagPrimeraVez){
            mensaje =
                !this.state.modified ?
                    this.state.error.codigo === 4000 ?
                        (<Alert color="danger">
                            <strong> {this.state.error.mensaje} </strong> <br />
                            <ul>
                                {this.state.error.detalle.map((detalle, index) => {
                                    return <li key={index}>{detalle}</li>
                                })}
                            </ul>
                        </Alert>)
                    :
                        (<Alert color="warning">
                            <strong> {this.state.error.mensaje} </strong> <br />
                            {this.state.error.detalle}
                        </Alert>)
                :
                    this.state.error.codigo === 2001 || this.state.error.codigo === 2004 ?
                        (<Alert color="success">
                            <h6> {this.state.error.detalle} </h6>
                        </Alert>)
                    :
                        (<Alert color="warning">
                            <strong> {this.state.error.mensaje} </strong> <br />
                            {this.state.error.detalle}
                        </Alert>)
        }

        return(
            <Card>
                <Form onSubmit = {this.submitForm}>
                    <CardHeader>
                        {!this.idDeterminacion ? "Crear Determinación " : "Modificar Determinación"}
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col xs="12">
                                <FormGroup>
                                    <Label  htmlFor="titulo">Título:</Label>
                                    <Input  type="text" name="titulo"   maxLength="100"
                                            onChange={this.newData} placeholder="Ingresar título"
                                            value={this.state.determinacion.titulo}
                                            invalid={!validationState.determinacion.titulo.pristine && !validationState.determinacion.titulo.valid} />
                                            <FormFeedback invalid={!validationState.determinacion.titulo.pristine && !validationState.determinacion.titulo.valid}>{validationState.determinacion.titulo.message}</FormFeedback>
                                </FormGroup>
                            </Col>
                            <Col xs="10">
                                <FormGroup>
                                    <Label  htmlFor="descripcion">Descripción:</Label>
                                    <Input  type="textarea" name="descripcion" rows="2" maxLength="200"
                                            onChange={this.newData} placeholder="Ingresar una descripción"
                                            value={this.state.determinacion.descripcion} />                                    
                                </FormGroup>
                            </Col>                            
                            <Col xs="2">
                                <FormGroup>
                                    <Label  htmlFor="activo">Activo:</Label><br />
                                    <Switch onChange={this.handleSwitch} name="activo"
                                            checked={this.state.determinacion.activo} />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12">
                                {mensaje}
                            </Col>
                        </Row>
                    </CardBody>
                    <CardFooter style={footerStyles}>
                        <Button type="submit" color="success" size="xs"
                                style={{marginRight: "0.5em"}}
                                disabled={!validationState.form.valid}>
                            {!this.idDeterminacion ? "Crear" : "Modificar"}
                        </Button>
                        <Button type="submit" color="danger" size="xs"
                                onClick={()=>this.props.history.push(this.urlCancelar)}>
                            Cancelar
                        </Button>
                    </CardFooter>
                </Form>
            </Card>
        );
    }
}

export default Determinacion;