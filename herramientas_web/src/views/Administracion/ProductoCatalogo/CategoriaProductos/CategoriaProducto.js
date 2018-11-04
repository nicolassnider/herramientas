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
import {
    getCategoriaProductoPorId,
    editarCategoriaProducto,
    nuevoCategoriaProducto
} from '../../../../services/CategoriaProductoServices';

import Select from 'react-select';
import Validator from '../../../../utils/Validator.js';
import FormValidation from '../../../../utils/FormValidation';
import 'react-datepicker/dist/react-datepicker.css';

class CategoriaProducto extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categoriaProducto: {
                id: null,
                descripcion: ""

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
        this.idCategoriaProducto = props.match.params.id;

        this.urlCancelar = "/administracion/productocatalogo/categoriaproductos";


        this.submitForm = this.submitForm.bind(this);
        this.newData = this.newData.bind(this);

        this.formValidation = new FormValidation({
            component: this,
            validators: {
                'categoriaProducto.descripcion': (value) => Validator.notEmpty(value)
            }
        });
    }


    componentDidMount() {

        let component = this;
        let arrayPromises = [];
        if (component.idCategoriaProducto) {
            let p1 = getCategoriaProductoPorId(component.idCategoriaProducto).then(result => result.json());
            arrayPromises.push(p1);
        }

        Promise.all(arrayPromises)
            .then(
                (result) => {
                    let miState = {...this.state};

                    if (component.idCategoriaProducto) {
                        miState.categoriaProducto = result[0]
                    }

                    miState.loaded = true;
                    console.log(miState);
                    component.setState(miState);


                })

            .catch(function (err) {
                console.log(err);
            })
    }

    submitForm(event) {
        event.preventDefault();
        let categoriaProducto = this.state.categoriaProducto;
        if (!this.idCategoriaProducto) {
            nuevoCategoriaProducto(categoriaProducto)
                .then(response => {
                    if (response.status === 400) {

                        response.json()
                            .then(response => {
                                this.setState({
                                    error: response,
                                    modified: false,
                                    flagPrimeraVez: false
                                });
                                alert(this.state.error.detalle[0]);

                            })
                    } else {
                        if (response.status === 201) {
                            this.setState({
                                modified: true,
                                error: {
                                    codigo: 2001,
                                    mensaje: "",
                                    detalle: [
                                        "categoriaProducto creado correctamente."
                                    ]
                                },
                                flagPrimeraVez: false
                            });
                            setTimeout(() => {
                                this.props.history.push("/administracion/productocatalogo/categoriaProductos");
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
        } else {
            editarCategoriaProducto(categoriaProducto)
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
                                        "categoriaProducto modificado correctamente."
                                    ]
                                },
                                flagPrimeraVez: false
                            });
                            setTimeout(() => {
                                this.props.history.push("/administracion/productocatalogo/categoriaproductos");
                            }, 2500);
                        }
                    }
                })
        }

    }


    newData(event) {
        let newState = {...this.state};
        newState.categoriaProducto[event.target.name] = event.target.value;
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
                        {!this.idCategoriaProducto ? "Crear Categoria" : "Modificar Categoria"}
                    </CardHeader>
                    <CardBody>

                        <Row xs={{size: 12, offset: 0}}>

                            <Col xs={{size: 4, offset: 0}}>
                                <Label htmlFor="descripcion">(*)Descripción:</Label>
                                <Input type="text" name="descripcion"
                                       onChange={this.newData} placeholder="Descripcion..."
                                       value={this.state.categoriaProducto.descripcion}
                                       invalid={!validationState.categoriaProducto.descripcion.pristine && !validationState.categoriaProducto.descripcion.valid}/>
                                <FormFeedback
                                    invalid={!validationState.categoriaProducto.pristine && !validationState.categoriaProducto.descripcion.valid}>{validationState.categoriaProducto.descripcion.message}</FormFeedback>
                            </Col>


                        </Row>


                    </CardBody>
                    <CardFooter style={estilosFooter}>
                        <Button type="submit" color="success" size="xs"
                                disabled={!validationState.form.valid}>
                            {!this.idCategoriaProducto ? "Crear" : "Modificar"}
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

export default CategoriaProducto;