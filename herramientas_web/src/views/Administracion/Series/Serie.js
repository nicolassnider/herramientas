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
import {getSeriePorId, nuevaSerie, editarSerie} from '../../../services/SeriesServices';
import {getAllLaboratorios} from '../../../services/LaboratoriosServices';

import Date from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

import Select from 'react-select';
import Validator from '../../../utils/Validator.js';
import FormValidation from '../../../utils/FormValidation';

class Serie extends Component {
    constructor(props) {
        super(props);
        this.state = {
            serie: {
                id: null,
                cargaInicio: null,
                cargaFin: null,
                envioMuestra: null,
                laboratorioId: null,
                laboratorio: {
                    id: null
                },
                informeCargado: false,
                laboratorios: []
            },
            error: {
                codigo: 0,
                mensaje: "",
                detalle: []
            },
            modified: false,
            flagPrimeraVez: true
        },

            this.idSerie = props.match.params.id;

        this.urlCancelar = "/administracion/series";

        this.submitForm = this.submitForm.bind(this);
        // this.newData = this.newData.bind(this);
        this.newDate = this.newDate.bind(this);
        this.handleSelect = this.handleSelect.bind(this);

        this.formValidation = new FormValidation({
            component: this,
            validators: {
                'serie.cargaInicio': (value) => Validator.notEmpty(value),
                'serie.cargaFin': (value) => Validator.notEmpty(value),
                'serie.envioMuestra': (value) => Validator.notEmpty(value),
                'serie.laboratorio.id': (value) => Validator.notEmpty(value),
            }
        });
    }

    componentDidMount() {
        let component = this;
        let arrayPromises = [];
        if (component.idSerie) {
            let p1 = getSeriePorId(component.idSerie).then(result => result.json());
            arrayPromises.push(p1);
        }

        let p2 = getAllLaboratorios().then(result => result.json());

        arrayPromises.push(p2);

        Promise.all(arrayPromises)
            .then(
                (result) => {
                    let miState = {...this.state};

                    if (component.idSerie) {

                        miState.serie = result[0];
                        miState.serie.laboratorios = result[1].map((laboratorio, index) => {
                            return (
                                {value: laboratorio.id, label: laboratorio.descripcion}
                            )
                        })
                    } else {
                        miState.serie.laboratorios = result[0].map((laboratorio, index) => {
                            return (
                                {value: laboratorio.id, label: laboratorio.descripcion}
                            )
                        })
                    }

                    miState.loaded = true;
                    component.setState(miState);
                })
            .catch(function (err) {
                console.log("Error: " + err);
            })
    }

    submitForm(event) {
        event.preventDefault();
        let serie = this.state.serie;
        if (!this.idSerie) {
            nuevaSerie(serie)
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
                        if (response.status === 201) {
                            this.setState({
                                modified: true,
                                error: {
                                    codigo: 2001,
                                    mensaje: "",
                                    detalle: [
                                        "Serie creada correctamente."
                                    ]
                                },
                                flagPrimeraVez: false
                            });
                            setTimeout(() => {
                                this.props.history.push("/administracion/series");
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
            editarSerie(serie)
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
                                        "Serie modificada correctamente."
                                    ]
                                },
                                flagPrimeraVez: false
                            });
                            setTimeout(() => {
                                this.props.history.push("/administracion/series");
                            }, 2500);
                        }
                    }
                })
        }
    }

    /*newData(event){        
        const serie = this.state.serie;
        serie[event.target.name] = event.target.value;
        this.setState({
            serie: serie
        })
    }*/

    handleSelect(name, object) {
        let newState = {...this.state};
        if (name === "laboratorioId") {
            newState.serie.laboratorioId = object.value;
            newState.serie.laboratorio.id = object.value;
        }
        this.setState(newState);
    }

    newDate(name, event) {
        let date = event ? event.format() : '';
        let newState = {...this.state};

        switch (name) {
            case "cargaInicio":
                newState.serie.cargaInicio = date;
                break;
            case "cargaFin":
                newState.serie.cargaFin = date;
                break;
            case "envioMuestra":
                newState.serie.envioMuestra = date;
                break;
        }
        if (this.state.serie.cargaFin < this.state.serie.cargaInicio) {
            newState.serie.cargaFin = "";
            newState.serie.envioMuestra = "";
        }

        if ((this.state.serie.envioMuestra > this.state.serie.cargaInicio && this.state.serie.envioMuestra > this.state.serie.cargaFin) ||
            (this.state.serie.envioMuestra < this.state.serie.cargaInicio && this.state.serie.envioMuestra < this.state.serie.cargaFin)
        ) {
            newState.serie.envioMuestra = "";
        }

        this.setState(newState);
    }

    render() {

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
                            <strong> {this.state.error.mensaje} </strong> <br/>
                            {this.state.error.detalle}
                        </Alert>)
        }

        return (
            <Card>
                <Form onSubmit={this.submitForm}>
                    <CardHeader>
                        {!this.idSerie ? "Crear Serie" : "Modificar Serie"}
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col sm="6" xs="12">
                                <FormGroup>
                                    <Label htmlFor="cargaInicio">Fecha de Carga de Inicio:</Label>
                                    <Date placeholderText="Seleccionar fecha"
                                          selected={!this.state.serie.cargaInicio || this.state.serie.cargaInicio === '0000-00-00' ? null : moment(this.state.serie.cargaInicio)}
                                          dateFormat="DD/MM/YYYY"
                                          className="form-control date-picker-placeholder"
                                          onChange={(event) => this.newDate("cargaInicio", event)}
                                          minDate={moment()}
                                          invalid={!validationState.serie.cargaInicio.pristine && !validationState.serie.cargaInicio.valid}/>
                                    <FormFeedback
                                        invalid={!validationState.serie.cargaInicio.pristine && !validationState.serie.cargaInicio.valid}>{validationState.serie.cargaInicio.message}</FormFeedback>
                                </FormGroup>
                            </Col>
                            <Col sm="6" xs="12">
                                <FormGroup>
                                    <Label htmlFor="cargaFin">Fecha de Carga de Fin:</Label>
                                    <Date placeholderText="Seleccionar fecha"
                                          selected={!this.state.serie.cargaFin || this.state.serie.cargaFin === '' || this.state.serie.cargaFin === '0000-00-00' ? null : moment(this.state.serie.cargaFin)}
                                          dateFormat="DD/MM/YYYY"
                                          className="form-control date-picker-placeholder"
                                          onChange={(event) => this.newDate("cargaFin", event)}
                                          minDate={this.state.serie.cargaInicio ? moment(this.state.serie.cargaInicio) : moment()}
                                          invalid={!validationState.serie.cargaFin.pristine && !validationState.serie.cargaFin.valid}/>
                                    <FormFeedback
                                        invalid={!validationState.serie.cargaFin.pristine && !validationState.serie.cargaFin.valid}>{validationState.serie.cargaFin.message}</FormFeedback>
                                </FormGroup>
                            </Col>
                            <Col sm="6" xs="12">
                                <FormGroup>
                                    <Label htmlFor="envioMuestra">Fecha de Envío de Muestra:</Label>
                                    <Date placeholderText="Seleccionar fecha"
                                          selected={this.state.serie.envioMuestra === null || this.state.serie.envioMuestra === '' || this.state.serie.envioMuestra === '0000-00-00' ? null : moment(this.state.serie.envioMuestra)}
                                          dateFormat="DD/MM/YYYY"
                                          className="form-control date-picker-placeholder"
                                          onChange={(event) => this.newDate("envioMuestra", event)}
                                          minDate={this.state.serie.cargaInicio ? moment(this.state.serie.cargaInicio) : moment()}
                                          maxDate={this.state.serie.cargaFin ? moment(this.state.serie.cargaFin) : null}
                                          invalid={!validationState.serie.envioMuestra.pristine && !validationState.serie.envioMuestra.valid}/>
                                    <FormFeedback
                                        invalid={(!validationState.serie.envioMuestra.pristine && !validationState.serie.envioMuestra.valid).toString()}>{validationState.serie.envioMuestra.message}</FormFeedback>
                                </FormGroup>
                            </Col>
                            <Col sm="6" xs="12">
                                <FormGroup>
                                    <Label htmlFor="laboratorioId">Laboratorio:</Label>
                                    <Select
                                        name="laboratorioId" placeholder="Seleccionar una serie..."
                                        valueKey="value" labelKey="label"
                                        options={this.state.serie.laboratorios}
                                        value={this.state.serie.laboratorios.find(e => e.value === this.state.serie.laboratorio.id)}
                                        onChange={(e) => this.handleSelect("laboratorioId", e)}
                                        invalid={!validationState.serie.laboratorio.id.pristine && !validationState.serie.laboratorio.id.valid}/>
                                    <FormFeedback
                                        invalid={(!validationState.serie.laboratorio.id.pristine && !validationState.serie.laboratorio.id.valid).toString()}>{validationState.serie.laboratorio.id.message}</FormFeedback>
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
                            {!this.idSerie ? "Crear" : "Modificar"}
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

export default Serie;