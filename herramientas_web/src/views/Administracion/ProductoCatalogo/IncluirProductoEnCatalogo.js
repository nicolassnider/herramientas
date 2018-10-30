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
import {editarProductoCatalogo, getCatalogosPorProductoPorId} from '../../../services/ProductoCatalogoServices';
import {selectCatalogosSinProducto} from '../../../services/CatalogoService';
import {nuevaProductoCatalogo} from "../../../services/ProductoCatalogoServices";
import FormValidation from "../../../utils/FormValidation";
import Validator from "../../../utils/Validator";
import Select from 'react-select';

//import 'react-datepicker/dist/react-datepicker.css';

class IncluirProductoEnCatalogo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productoCatalogo: {
                id: null,
                producto: {
                    id: props.match.params.id,
                    descripcion: "",
                    categoria: {
                        id: null,
                        descripcion: ""
                    },
                    unidad: {
                        id: null,
                        descripcion: ""
                    }
                },
                catalogo: {
                    id: null,
                    descripcion: "",
                    observaciones: "",
                    activo: true
                },
                catalogos: {
                    id: null,
                    descripcion: "",
                    observaciones: "",
                    activo: true
                },
                precio: null,
                activo: true
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


        this.urlCancelar = "/administracion/productocatalogos";


        this.submitForm = this.submitForm.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.newData = this.newData.bind(this);

        this.formValidation = new FormValidation({
            component: this,
            validators: {
                'productoCatalogo.precio': (value) => Validator.floatIsGreaterThan(value, 0),

            }
        });
    }

    handleSelect(name, object) {
        let newState = {...this.state};

        switch (name) {

            case "catalogos":
                newState.productoCatalogo.catalogo.id = object.value;
                break;
        }

        this.setState(newState);

    }


    componentDidMount() {

        let component = this;
        let arrayPromises = [];
        if (component.idProducto) {
            let p1 = selectCatalogosSinProducto(component.idProducto).then(result => result.json());
            arrayPromises.push(p1);
        }

        Promise.all(arrayPromises)
            .then(
                (result) => {
                    let miState = {...this.state};

                    if (component.idProducto) {
                        miState.productoCatalogo.catalogos = result[0];
                        miState.productoCatalogo.catalogos = result[0].map((catalogo, index) => {
                            return (
                                {value: catalogo.value, label: catalogo.label}
                            )
                        });

                    } else {
                        miState.productoCatalogo.catalogos = result[0].map((catalogo, index) => {
                            return (
                                {value: catalogo.value, label: catalogo.label}
                            )
                        })
                        ;
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
        let productoCatalogo = this.state.productoCatalogo;
        if (!this.idProducto) {
            nuevaProductoCatalogo(productoCatalogo)
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
                                this.props.history.push("/administracion/productos/productos");
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
            nuevaProductoCatalogo(productoCatalogo)
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
                                this.props.history.push("/administracion/productos/catalogosenproducto/" + this.idProducto);
                            }, 2500);
                        }
                    }
                })
        }

    }


    newData(event) {
        let newState = {...this.state};
        newState.productoCatalogo[event.target.name] = event.target.value;
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
                                <Label htmlFor="catalogos">(*)Catálogos disponibles:</Label>
                                <Select
                                    name="catalogos" placeholder="Seleccionar una Catálogo..."
                                    valueKey="value" labelKey="label"
                                    options={this.state.productoCatalogo.catalogos}
                                    value={this.state.productoCatalogo.catalogos.find(e => e.value === this.state.productoCatalogo.catalogos.id)}
                                    onChange={(e) => this.handleSelect("catalogos", e)}
                                />
                            </Col>
                            <Col xs={{size: 4, offset: 0}}>
                                <Label htmlFor="precio">(*)Precio Unitario:</Label>
                                <Input type="text" name="precio"
                                       onChange={this.newData} placeholder="Precio"
                                       value={this.state.productoCatalogo.precio}
                                       invalid={!validationState.productoCatalogo.precio.pristine && !validationState.productoCatalogo.precio.valid}/>
                                <FormFeedback
                                    invalid={!validationState.productoCatalogo.pristine && !validationState.productoCatalogo.precio.valid}>{validationState.productoCatalogo.precio.message}</FormFeedback>
                            </Col>

                        </Row>


                    </CardBody>
                    <CardFooter style={estilosFooter}>
                        <Button type="submit" color="success" size="xs"
                                disabled={!validationState.form.valid}>
                            {!this.idProducto ? "Crear" : "Incluir"}
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

export default IncluirProductoEnCatalogo;