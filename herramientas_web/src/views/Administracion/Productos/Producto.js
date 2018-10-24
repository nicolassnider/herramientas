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
import {getProductoPorId, editarProducto, nuevaProducto} from '../../../services/ProductoServices';
import {getAllCategoriaProductos} from '../../../services/CategoriaProductoServices';
import {getAllUnidades} from '../../../services/UnidadServices';


import Select from 'react-select';
import Validator from '../../../utils/Validator.js';
import FormValidation from '../../../utils/FormValidation';
import 'react-datepicker/dist/react-datepicker.css';

class Producto extends Component {
    constructor(props) {
        super(props);
        this.state = {
            producto: {
                id: null,
                descripcion: "",
                categoria: {
                    id: null
                },
                categorias: {
                    id: ''
                },
                unidad: {
                    id: null
                },
                unidades: {
                    id: ''
                }

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
        this.idProducto = props.match.params.id;

        this.urlCancelar = "/administracion/productos";


        this.submitForm = this.submitForm.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.newData = this.newData.bind(this);

        this.formValidation = new FormValidation({
            component: this,
            validators: {
                'producto.descripcion': (value) => Validator.notEmpty(value),
                'producto.categoria': (value) => Validator.notEmpty(value),
                'producto.unidad': (value) => Validator.notEmpty(value),

            }
        });
    }

    handleSelect(name, object) {
        let newState = {...this.state};

        switch (name) {

            case "categorias":
                newState.producto.categoria.id = object.value;
                break;
            case "unidades":
                newState.producto.unidad.id = object.value;
                break;

        }

        this.setState(newState);

    }


    componentDidMount() {

        let component = this;
        let arrayPromises = [];
        if (component.idProducto) {
            let p1 = getProductoPorId(component.idProducto).then(result => result.json());
            arrayPromises.push(p1);
        }
        let p2 = getAllCategoriaProductos().then(result => result.json());

        let p3 = getAllUnidades().then(result => result.json());


        arrayPromises.push(p2, p3);

        Promise.all(arrayPromises)
            .then(
                (result) => {
                    let miState = {...this.state};

                    if (component.idProducto) {
                        miState.producto = result[0];
                        console.log(result);
                        miState.producto.categorias = result[0].map((categoriaProducto, index) => {
                            return (
                                {value: categoriaProducto.value, label: categoriaProducto.label}
                            )
                        })
                        miState.producto.unidades = result[1].map((unidad, index) => {
                            return (
                                {value: unidad.value, label: unidad.label}
                            )
                        });
                    } else {
                        miState.producto.categorias = result[0].map((categoriaProducto, index) => {
                            return (
                                {value: categoriaProducto.value, label: categoriaProducto.label}
                            )
                        })
                        miState.producto.unidades = result[1].map((unidad, index) => {
                            return (

                                {
                                    value: unidad.value, label: unidad.label
                                }

                            )
                        });
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
        let producto = this.state.producto;
        if (!this.idProducto) {
            nuevaProducto(producto)
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
                                        "Producto creado correctamente."
                                    ]
                                },
                                flagPrimeraVez: false
                            });
                            setTimeout(() => {
                                this.props.history.push("/administracion/productos");
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
            editarProducto(producto)
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
                                        "Producto modificado correctamente."
                                    ]
                                },
                                flagPrimeraVez: false
                            });
                            setTimeout(() => {
                                this.props.history.push("/administracion/productos");
                            }, 2500);
                        }
                    }
                })
        }

    }


    newData(event) {
        let newState = {...this.state};
        newState.producto[event.target.name] = event.target.value;
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
                        {!this.idPersona ? "Crear Persona" : "Modificar Persona"}
                    </CardHeader>
                    <CardBody>

                        <Row xs={{size: 12, offset: 0}}>

                            <Col xs={{size: 4, offset: 0}}>
                                <Label htmlFor="descripcion">(*)Descripción:</Label>
                                <Input type="text" name="descripcion"
                                       onChange={this.newData} placeholder="Nombre de producto"
                                       value={this.state.producto.descripcion}
                                       invalid={!validationState.producto.descripcion.pristine && !validationState.producto.descripcion.valid}/>
                                <FormFeedback
                                    invalid={!validationState.producto.pristine && !validationState.producto.descripcion.valid}>{validationState.producto.descripcion.message}</FormFeedback>
                            </Col>

                            <Col xs={{size: 4, offset: 0}}>
                                <Label htmlFor="categorias">(*)Categoria:</Label>
                                <Select
                                    name="categorias" placeholder="Seleccionar una categoria..."
                                    valueKey="value" labelKey="label"
                                    options={this.state.producto.categorias}
                                    value={this.state.producto.categorias.find(e => e.value === this.state.producto.categorias.id)}
                                    onChange={(e) => this.handleSelect("categorias", e)}
                                />
                            </Col>


                        </Row>
                        <Row>

                            <Col xs={{size: 4, offset: 0}}>
                                <Label htmlFor="unidades">(*)Presentación:</Label>
                                <Select
                                    name="unidades" placeholder="Seleccionar una presentación..."
                                    valueKey="value" labelKey="label"
                                    options={this.state.producto.unidades}
                                    value={this.state.producto.unidades.find(e => e.value === this.state.producto.unidades.id)}
                                    onChange={(e) => this.handleSelect("unidades", e)}
                                />
                            </Col>
                        </Row>


                    </CardBody>
                    <CardFooter style={estilosFooter}>
                        <Button type="submit" color="success" size="xs"
                                disabled={!validationState.form.valid}>
                            {!this.idProducto ? "Crear" : "Modificar"}
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

export default Producto;