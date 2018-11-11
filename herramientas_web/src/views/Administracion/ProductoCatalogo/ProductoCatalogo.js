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
    Label
} from 'reactstrap';
import {getCatalogosPorProductoPorId} from '../../../services/ProductoCatalogoServices';

//import 'react-datepicker/dist/react-datepicker.css';

class Producto extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productoCatalogo: {
                id: null,
                producto: {
                    id: null,
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
                    id: 1,
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
        this.idProducto = props.match.params.producto.id;
        console.log(props.match.params.producto.id);

        this.urlCancelar = "/administracion/productocatalogos";


        this.submitForm = this.submitForm.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.newData = this.newData.bind(this);


    }


    componentDidMount() {

        let component = this;
        let arrayPromises = [];
        if (component.idProducto) {
            let p1 = getCatalogosPorProductoPorId(component.idProducto).then(result => result.json());
            arrayPromises.push(p1);
        }

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

                            </Col>


                        </Row>
                        <Row>

                            <Col xs={{size: 4, offset: 0}}>
                                <Label htmlFor="unidades">(*)Presentación:</Label>

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