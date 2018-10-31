import React, {Component} from 'react';
import {
    Input,
    Col,
    Alert,
    Card,
    Form,
    FormFeedback,
    CardHeader,
    CardBody,
    CardFooter,
    Button,
    Row,
    FormGroup,
    Label
} from 'reactstrap';
import {getUsuarioPorId, editarUsuario} from '../../../../services/UsuarioServices';


import Switch from 'react-switch';
import Select from 'react-select';
import Validator from '../../../../utils/Validator.js';
import FormValidation from '../../../../utils/FormValidation';
import Date from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import {selectPerfiles} from "../../../../services/PerfilServices";

class Usuario extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usuario: {
                id: null,
                usuario: "",
                clave: "",
                perfil: {id: null},
                perfiles: {id: null}

            },

            error: {
                codigo: null,
                mensaje: "",
                detalle: []
            },
            modified: false,
            flagPrimeraVez: true,
            loaded: false
        };
        this.idUsuario = props.match.params.id;

        this.urlCancelar = "/administracion/personas/usuarios";


        this.submitForm = this.submitForm.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.newData = this.newData.bind(this);

        this.formValidation = new FormValidation({
            component: this,
            validators: {
                'usuario.clave': (value) => Validator.notEmpty(),
                /*'persona.nombre': (value) => Validator.notEmpty(value),
                'persona.apellido': (value) => Validator.notEmpty(value),*/

            }
        });
    }

    handleSelect(name, object) {
        let newState = {...this.state};

        switch (name) {

            case "perfiles":
                newState.usuario.perfil.id = object.value;
                break;
        }

        this.setState(newState);

    }


    componentDidMount() {

        let component = this;
        let arrayPromises = [];
        if (component.idUsuario) {
            let p1 = getUsuarioPorId(component.idUsuario).then(result => result.json());
            arrayPromises.push(p1);
        }
        let p2 = selectPerfiles().then(result => result.json());
        arrayPromises.push(p2);
        Promise.all(arrayPromises)
            .then(
                (result) => {
                    let miState = {...this.state};

                    if (component.idUsuario) {
                        miState.usuario = result[0];
                        console.log(result);
                        miState.usuario.perfiles = result[1].map((perfil, index) => {
                            return (
                                {value: perfil.value, label: perfil.label}
                            )
                        });
                    } else {
                        miState.usuario.perfiles = result[1].map((perfil, index) => {
                            return (
                                {value: perfil.value, label: perfil.label}
                            )
                        });
                    }

                    miState.loaded = true;
                    component.setState(miState)


                })
            .catch(function (err) {
                console.log(err);
            })
    }

    submitForm(event) {
        event.preventDefault();
        let usuario = this.state.usuario;
        if (this.idUsuario) {
            editarUsuario(usuario)
                .then(response => {
                    if (response.status === 400) {

                        response.json()
                        //console.log("Antes",response)
                            .then(response => {
                                //console.log("Después",response)
                                this.setState({
                                    error: response,
                                    modified: false,
                                    flagPrimeraVez: false
                                });
                                //alert(this.state.error.detalle[0]);

                            })
                    } else {
                        if (response.status === 201) {
                            this.setState({
                                modified: true,
                                error: {
                                    codigo: 2001,
                                    mensaje: "",
                                    detalle: [
                                        "Persona creado correctamente."
                                    ]
                                },
                                flagPrimeraVez: false
                            });
                            setTimeout(() => {
                                this.props.history.push("/administracion/personas/revendedoras");
                            }, 2500);
                        } else {
                            if (response.status === 400) {
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
        }
        this.props.history.push("/administracion/personas/revendedoras");
        console.log("Submit", this.state);
    }

    /*handleSelect(name, object){
        //console.log(object);
        let newState = {...this.state};
        if(name === "tipoDocumento"){
            newState.persona.tipoDocumentoId = object.value;
        }
        if(name === "localidades"){
            newState.persona.unidadId = object.value;
        }
        this.setState(newState);
    }*/

    newData(event) {
        let newState = {...this.state};
        newState.usuario[event.target.name] = event.target.value;
        this.setState(newState);
    }

    render() {
        if (!this.state.loaded)
            return null;

        this.formValidation.validate();
        let validationState = this.formValidation.state;

        const estilosFooter = {
            textAlign: 'right',
            button: {
                margin: '5px'
            }
        }

        let mensaje = null;
        if (!this.state.flagPrimeraVez) {
            mensaje =
                !this.state.modified ?
                    this.state.error.codigo === 4000 ?
                        (<Alert color="danger">
                            <strong> {this.state.error.mensaje} </strong> <br/>
                            <ul>
                                {this.state.error.detalle.map((detalle, index) => {
                                    return <li key={index}>{detalle}</li>
                                })}
                            </ul>
                        </Alert>)
                        :
                        (<Alert color="warning">
                            <strong> {this.state.error.mensaje} </strong> <br/>
                            {this.state.error.detalle}
                        </Alert>)
                    :
                    this.state.error.codigo === 2001 || this.state.error.codigo === 2004 ?
                        (<Alert color="success">
                            <h6>{this.state.error.detalle}</h6>
                        </Alert>)
                        :
                        (<Alert color="warning">
                            <strong> {this.state.error.mensaje} </strong>
                            {this.state.error.detalle}
                        </Alert>)
        }

        return (
            <Card>
                <Form onSubmit={this.submitForm}>
                    <CardHeader>
                        {this.idPersona ? "Modificar Usuario" : "Modificar Usuario"}
                    </CardHeader>
                    <CardBody>

                        <Row xs={{size: 12, offset: 0}}>

                            <Col xs={{size: 2, offset: 0}}>
                                <Label htmlFor="usuario">{this.state.usuario.usuario}</Label>
                            </Col>
                            <Col xs={{size: 2, offset: 0}}>
                                <Label htmlFor="perfil">{this.state.usuario.perfil.descripcion}</Label>
                            </Col>

                            <Col xs={{size: 2, offset: 0}}>
                                <Label htmlFor="perfiles">(*)Perfil:</Label>
                                <Select
                                    name="perfiles" placeholder="Perfil..."
                                    valueKey="value" labelKey="label"
                                    options={this.state.usuario.perfiles}
                                    value={this.state.usuario.perfiles.find(e => e.value === this.state.usuario.perfiles.id)}
                                    onChange={(e) => this.handleSelect("perfiles", e)}
                                />
                            </Col>

                            <Col xs={{size: 4, offset: 0}}>
                                <Label htmlFor="clave">(*)Clave:</Label>
                                <Input type="password" name="clave"
                                       onChange={this.newData} placeholder="Clave"
                                       value={this.state.usuario.clave}
                                       invalid={!validationState.usuario.clave.pristine && !validationState.usuario.clave.valid}/>
                                <FormFeedback
                                    invalid={!validationState.usuario.pristine && !validationState.usuario.clave.valid}>{validationState.usuario.clave.message}</FormFeedback>
                            </Col>
                        </Row>


                    </CardBody>
                    <CardFooter style={estilosFooter}>
                        <Button type="submit" color="success" size="xs"
                                disabled={!validationState.form.valid}>
                            {!this.idUsuario ? "Modificar" : "Modificar"}
                        </Button>
                        <Button type="submit" color="danger" size="xs"
                                onClick={() => this.props.history.push(this.urlCancelar)}>
                            Cancelar
                        </Button>
                    </CardFooter>
                </Form>
            </Card>
        )
    }

}

export default Usuario;