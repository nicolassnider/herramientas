import React, {Component} from 'react';
import { Input, Col, Alert, Card, Form, FormFeedback, CardHeader, CardBody, CardFooter, Button, Row, FormGroup, Label } from 'reactstrap';
import { getLaboratorioPorId, nuevoLaboratorio, editarLaboratorio } from '../../../services/LaboratoriosServices';
import Switch from 'react-switch';
import Validator from '../../../utils/Validator.js';
import FormValidation from '../../../utils/FormValidation';

class Laboratorio extends Component{
    constructor(props){
        super(props);
        this.state = {
            laboratorio:{
                id: null,
                codigo: null,
                descripcion: "",
                activo: false
            },            
            error:{
                codigo: 0,
                mensaje: "",
                detalle: []
            },
            modified : false,
            flagPrimeraVez : true
        },
        this.idLaboratorio = props.match.params.id;

        this.urlCancelar = "/configuracion/laboratorios";

        this.submitForm = this.submitForm.bind(this);
        this.newData = this.newData.bind(this);
        this.handleSwitch = this.handleSwitch.bind(this);

        this.formValidation = new FormValidation({
            component: this,
            validators: {
                'laboratorio.descripcion': (value) => Validator.lengthNotEmpty(value, 100),
                'laboratorio.codigo': (value) => Validator.intNumber(value)
            }
        });
    }

    componentDidMount(){
        getLaboratorioPorId(this.idLaboratorio)
        .then(result => result.json())
        .then(
            (result) => {
                this.setState({
                    laboratorio:{
                        id: result.id,
                        descripcion: result.descripcion,
                        codigo: result.codigo,
                        activo: result.activo
                    }
                })
            }
        )
    }

    submitForm(event){
        event.preventDefault();
        let laboratorio = this.state.laboratorio;        
        if(!this.idLaboratorio){
            nuevoLaboratorio(laboratorio)
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
                                    "Laboratorio creado correctamente."
                                ]
                            },
                            flagPrimeraVez: false
                        });
                        setTimeout(()=>{
                            this.props.history.push("/configuracion/laboratorios");
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
            editarLaboratorio(laboratorio)
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
                                    "Laboratorio modificado correctamente."
                                ]
                            },
                            flagPrimeraVez: false
                        });
                        setTimeout(()=>{
                            this.props.history.push("/configuracion/laboratorios"); 
                        },2500);
                    }
                }
            })
        }
    }

    handleSwitch(checked){
        const laboratorio = this.state.laboratorio;        
        laboratorio.activo = checked;
        this.setState({
            laboratorio:laboratorio
        })
    }

    newData(event){
            const laboratorio = this.state.laboratorio;
            laboratorio[event.target.name] = event.target.value;
            this.setState({
                laboratorio: laboratorio
            })
    }

    render(){
        
        this.formValidation.validate();
        let validationState = this.formValidation.state;

        const estilosFooter = {
            textAlign: 'right',
            button: {
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
                            <h6>{this.state.error.detalle}</h6>
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
                        {!this.idLaboratorio ? "Crear Laboratorio" : "Modificar Laboratorio" }
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col xs="12">
                                <FormGroup>
                                    <Label  htmlFor="codigo">Código:</Label>
                                    <Input  type="text" name="codigo"
                                            onChange={this.newData} placeholder="Ingresar código"
                                            value={this.state.laboratorio.codigo}
                                            invalid={!validationState.laboratorio.codigo.pristine && !validationState.laboratorio.codigo.valid} />
                                            <FormFeedback invalid={!validationState.laboratorio.codigo.pristine && !validationState.laboratorio.codigo.valid}>{validationState.laboratorio.codigo.message}</FormFeedback>
                                </FormGroup>
                            </Col>
                            <Col xs="10">
                                <FormGroup>
                                    <Label  htmlFor="descripcion">Descripción:</Label>
                                    <Input  type="textarea" name="descripcion" rows="2"
                                            onChange={this.newData} placeholder="Ingresar una descripción"
                                            value={this.state.laboratorio.descripcion} 
                                            invalid={!validationState.laboratorio.descripcion.pristine && !validationState.laboratorio.descripcion.valid} />
                                    <FormFeedback invalid={!validationState.laboratorio.descripcion.pristine && !validationState.laboratorio.descripcion.valid}>{validationState.laboratorio.descripcion.message}</FormFeedback>
                                </FormGroup>
                            </Col>                            
                            <Col xs="2">
                                <FormGroup>
                                    <Label  htmlFor="activo">Activo:</Label><br />
                                    <Switch onChange={this.handleSwitch} name="activo"                                            
                                            checked={this.state.laboratorio.activo}
                                            />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12">
                                {mensaje}
                            </Col>    
                        </Row>                       
                    </CardBody>
                    <CardFooter style={estilosFooter}>
                        <Button type="submit" color="success" size="xs"
                                disabled={!validationState.form.valid}>
                            {!this.idLaboratorio ? "Crear" : "Modificar"}
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

export default Laboratorio;