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
import {getMetodoPorId, nuevoMetodo, editarMetodo} from '../../../services/MetodosServices';
import {getAllDeterminaciones} from '../../../services/DeterminacionesServices';
import {getAllUnidades} from '../../../services/UnidadesService';
import Switch from 'react-switch';
import Select from 'react-select';
import Validator from '../../../utils/Validator.js';
import FormValidation from '../../../utils/FormValidation';

class Metodo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            metodo: {
                id: null,
                titulo: "",
                descripcion: "",
                instrucciones: "",
                determinacionId: null,
                determinaciones: [],
                enteros: "",
                decimales: "",
                multiplo: "",
                unidadId: null,
                unidades: [],
                maximo: "",
                minimo: "",
                cifrasSignificativas: "",
                activo: false
            },
            error: {
                codigo: null,
                mensaje: "",
                detalle: []
            },
            modified: false,
            flagPrimeraVez: true,
            loaded: false
        },
            this.idMetodo = props.match.params.id;

        this.urlCancelar = "/configuracion/metodos";

        this.submitForm = this.submitForm.bind(this);
        this.newData = this.newData.bind(this);
        this.handleSwitch = this.handleSwitch.bind(this);
        this.handleSelect = this.handleSelect.bind(this);

        this.formValidation = new FormValidation({
            component: this,
            validators: {
                'metodo.titulo': (value) => Validator.lengthNotEmpty(value, 100),
                'metodo.descripcion': (value) => Validator.lengthNotEmptyNotRequired(value, 200),
                'metodo.instrucciones': (value) => Validator.lengthNotEmptyNotRequired(value, 300),
                'metodo.determinacionId': (value) => Validator.notEmpty(value),
                'metodo.enteros': (value) => Validator.intNumberNotRequired(value),
                'metodo.decimales': (value) => Validator.intNumberNotRequired(value),
                'metodo.multiplo': (value) => Validator.floatNunmberNotRequired(value),
                'metodo.unidadId': (value) => Validator.notEmpty(value),
                'metodo.maximo': (value) => Validator.floatIsGreaterThanNotRequired(value, this.state.metodo.minimo),
                'metodo.minimo': (value) => Validator.floatIsSmallerThanNotRequired(value, this.state.metodo.maximo),
                'metodo.cifrasSignificativas': (value) => Validator.intNumberNotRequired(value)
            }
        });
    }

    componentDidMount() {

        let component = this;
        let arrayPromises = [];
        if (component.idMetodo) {
            let p1 = getMetodoPorId(component.idMetodo).then(result => result.json());
            arrayPromises.push(p1);
        }

        let p2 = getAllDeterminaciones().then(result => result.json());
        let p3 = getAllUnidades().then(result => result.json());

        arrayPromises.push(p2, p3);

        Promise.all(arrayPromises)
            .then(
                (result) => {
                    let miState = {...this.state};

                    if (component.idMetodo) {
                        miState.metodo = result[0];
                        miState.metodo.determinaciones = result[1].map((determinacion, index) => {
                            return (
                                {value: determinacion.id, label: determinacion.titulo}
                            )
                        })
                        miState.metodo.unidades = result[2].map((unidad, index) => {
                            return (
                                {value: unidad.id, label: unidad.descripcion}
                            )
                        });
                    } else {
                        miState.metodo.determinaciones = result[0].map((determinacion, index) => {
                            return (
                                {value: determinacion.id, label: determinacion.titulo}
                            )
                        })
                        miState.metodo.unidades = result[1].map((unidad, index) => {
                            return (
                                {value: unidad.id, label: unidad.descripcion}
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
        let metodo = this.state.metodo;
        if (!this.idMetodo) {
            nuevoMetodo(metodo)
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
                            })
                    } else {
                        if (response.status === 201) {
                            this.setState({
                                modified: true,
                                error: {
                                    codigo: 2001,
                                    mensaje: "",
                                    detalle: [
                                        "Método creado correctamente."
                                    ]
                                },
                                flagPrimeraVez: false
                            });
                            setTimeout(() => {
                                this.props.history.push("/configuracion/metodos");
                            }, 2500);
                        } else {
                            if (response.status === 500) {
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
        } else {
            editarMetodo(metodo)
                .then(response => {
                    if (response.status === 400) {
                        response.json()
                            .then(response => {
                                this.setState({
                                    error: response,
                                    modified: false,
                                    flagPrimeraVez: false
                                });
                            })
                    } else {
                        if (response.status === 204) {
                            this.setState({
                                modified: true,
                                error: {
                                    codigo: 2004,
                                    mensaje: "",
                                    detalle: [
                                        "Método modificado correctamente."
                                    ]
                                },
                                flagPrimeraVez: false
                            });
                            setTimeout(() => {
                                this.props.history.push("/configuracion/metodos");
                            }, 2500);
                        }
                    }
                })
        }
        //console.log("Submit", this.state);
    }

    handleSwitch(checked) {
        let newState = {...this.state};
        newState.metodo.activo = checked;
        this.setState(newState);
    }

    /*handleSelect(name, object){
        //console.log(object);
        let newState = {...this.state};
        if(name === "determinaciones"){
            newState.metodo.determinacionId = object.value;
        }
        if(name === "unidades"){
            newState.metodo.unidadId = object.value;
        }
        this.setState(newState);
    }*/

    newData(event) {
        let newState = {...this.state};
        newState.metodo[event.target.name] = event.target.value;
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
                        {!this.idMetodo ? "Crear Método" : "Modificar Método"}
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col xs="12">
                                <Label htmlFor="determinacion">Determinación:</Label>
                                <Select
                                    name="determinacion" placeholder="Seleccionar una determinación..."
                                    valueKey="value" labelKey="label"
                                    options={this.state.metodo.determinaciones}
                                    value={this.state.metodo.determinaciones.find(e => e.value === this.state.metodo.determinacionId)}
                                    onChange={(e) => this.handleSelect("determinaciones", e)}
                                />
                            </Col>
                            <Col xs="12">
                                <Label htmlFor="titulo">Título:</Label>
                                <Input type="text" name="titulo"
                                       onChange={this.newData} placeholder="Ingresar título"
                                       value={this.state.metodo.titulo}
                                       invalid={!validationState.metodo.titulo.pristine && !validationState.metodo.titulo.valid}/>
                                <FormFeedback
                                    invalid={!validationState.metodo.titulo.pristine && !validationState.metodo.titulo.valid}>{validationState.metodo.titulo.message}</FormFeedback>
                            </Col>
                            <Col xs="12">
                                <Label htmlFor="descripcion">Descripción:</Label>
                                <Input type="textarea" name="descripcion" rows="2" maxLength="200"
                                       onChange={this.newData} placeholder="Ingresar descripción"
                                       value={this.state.metodo.descripcion}
                                       invalid={!validationState.metodo.descripcion.pristine && !validationState.metodo.descripcion.valid}/>
                                <FormFeedback
                                    invalid={!validationState.metodo.descripcion.pristine && !validationState.metodo.descripcion.valid}>{validationState.metodo.descripcion.message}</FormFeedback>
                            </Col>
                            <Col xs="12">
                                <Label htmlFor="instrucciones">Instrucciones:</Label>
                                <Input type="textarea" name="instrucciones"
                                       onChange={this.newData} placeholder="Ingresar instrucciones" maxLength="300"
                                       value={this.state.metodo.instrucciones}
                                       invalid={!validationState.metodo.instrucciones.pristine && !validationState.metodo.instrucciones.valid}/>
                                <FormFeedback
                                    invalid={!validationState.metodo.instrucciones.pristine && !validationState.metodo.instrucciones.valid}>{validationState.metodo.instrucciones.message}</FormFeedback>
                            </Col>
                            <Col xs={{size: 12, offset: 0}}>
                                <Label htmlFor="unidades">Unidad de Medida:</Label>
                                <Select
                                    name="unidades" placeholder="Seleccionar una unidad..."
                                    valueKey="value" labelKey="label"
                                    options={this.state.metodo.unidades}
                                    value={this.state.metodo.unidades.find(e => e.value === this.state.metodo.unidadId)}
                                    onChange={(e) => this.handleSelect("unidades", e)}
                                />
                            </Col>
                            <Col xs="6">
                                <Label htmlFor="enteros">Enteros:</Label>
                                <Input type="text" name="enteros"
                                       onChange={this.newData} placeholder="Ingresar enteros"
                                       value={this.state.metodo.enteros}
                                       invalid={!validationState.metodo.enteros.pristine && !validationState.metodo.enteros.valid}/>
                                <FormFeedback
                                    invalid={!validationState.metodo.enteros.pristine && !validationState.metodo.enteros.valid}>{validationState.metodo.enteros.message}</FormFeedback>
                            </Col>
                            <Col xs="6">
                                <Label htmlFor="decimales">Decimales:</Label>
                                <Input type="text" name="decimales"
                                       onChange={this.newData} placeholder="Ingresar decimales"
                                       value={this.state.metodo.decimales}
                                       invalid={!validationState.metodo.decimales.pristine && !validationState.metodo.decimales.valid}/>
                                <FormFeedback
                                    invalid={!validationState.metodo.decimales.pristine && !validationState.metodo.decimales.valid}>{validationState.metodo.decimales.message}</FormFeedback>
                            </Col>
                            <Col xs="6">
                                <Label htmlFor="minimo">Mínimo:</Label>
                                <Input type="text" name="minimo"
                                       onChange={this.newData} placeholder="Ingresar mínimo"
                                       value={this.state.metodo.minimo}
                                       invalid={!validationState.metodo.minimo.pristine && !validationState.metodo.minimo.valid}/>
                                <FormFeedback
                                    invalid={!validationState.metodo.minimo.pristine && !validationState.metodo.minimo.valid}>{validationState.metodo.minimo.message}</FormFeedback>
                            </Col>
                            <Col xs="6">
                                <Label htmlFor="maximo">Máximo:</Label>
                                <Input type="text" name="maximo"
                                       onChange={this.newData} placeholder="Ingresar máximo"
                                       value={this.state.metodo.maximo}
                                       invalid={!validationState.metodo.maximo.pristine && !validationState.metodo.maximo.valid}/>
                                <FormFeedback
                                    invalid={!validationState.metodo.maximo.pristine && !validationState.metodo.maximo.valid}>{validationState.metodo.maximo.message}</FormFeedback>
                            </Col>
                            <Col xs="12">
                                <Label htmlFor="multiplo">Múltiplo:</Label>
                                <Input type="text" name="multiplo"
                                       onChange={this.newData} placeholder="Ingresar múltiplo"
                                       value={this.state.metodo.multiplo}
                                       invalid={!validationState.metodo.multiplo.pristine && !validationState.metodo.multiplo.valid}/>
                                <FormFeedback
                                    invalid={!validationState.metodo.multiplo.pristine && !validationState.metodo.multiplo.valid}>{validationState.metodo.multiplo.message}</FormFeedback>
                            </Col>
                            <Col xs="6">
                                <Label htmlFor="cifrasSignificativas">Cifras Significativas:</Label>
                                <Input type="text" name="cifrasSignificativas"
                                       onChange={this.newData} placeholder="Ingresar cifras significativas"
                                       value={this.state.metodo.cifrasSignificativas}
                                       invalid={!validationState.metodo.cifrasSignificativas.pristine && !validationState.metodo.cifrasSignificativas.valid}/>
                                <FormFeedback
                                    invalid={!validationState.metodo.cifrasSignificativas.pristine && !validationState.metodo.cifrasSignificativas.valid}>{validationState.metodo.cifrasSignificativas.message}</FormFeedback>
                            </Col>
                            <Col xs="6">
                                <Label htmlFor="activo">Activo:</Label> <br/>
                                <Switch onChange={this.handleSwitch} name="activo"
                                        checked={this.state.metodo.activo}/>
                            </Col>
                            <Col xs="12">
                                {mensaje}
                            </Col>
                        </Row>
                    </CardBody>
                    <CardFooter style={estilosFooter}>
                        <Button type="submit" color="success" size="xs"
                                disabled={!validationState.form.valid}>
                            {!this.idMetodo ? "Crear" : "Modificar"}
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

export default Metodo;