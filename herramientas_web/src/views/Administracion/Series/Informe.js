import React, {Component} from 'react';
import {Card, CardHeader, CardBody, CardFooter, Button, FormGroup, Form, Col, Input} from 'reactstrap';

import {informeNuevo} from '../../../services/SeriesServices';


class Informe extends React.Component {
    onChange = (e) => {
        let miState = {...this.state};
        miState.file = e.target.files[0];
        this.setState(miState);
    }

    constructor(props) {
        super(props);
        this.state = {
            file: null
        }

        this.onChange = this.onChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    submitForm(event) {
        event.preventDefault();
        var formData = new FormData();
        let fileInput = {
            key: "file",
            value: this.state.file
        }
        formData.append('file', this.state.file);
        //console.log(fileInput);
        let idSerie = this.props.match.params.id;
        let arrayPromises = [];

        let p1 = informeNuevo(idSerie, fileInput).then(result => result.json());

        arrayPromises.push(p1);

        Promise.all(arrayPromises)
            .then(
                (result) => {
                    console.log(result);
                }
            )

    }

    render() {
        const estilosFooter = {
            textAlign: 'right'
        }

        return (
            <Card>
                <Form
                    onSubmit={this.submitForm}

                >
                    <CardHeader>
                        Nuevo Informe
                    </CardHeader>
                    <CardBody>
                        <FormGroup row>
                            <Col xs="12" lg="12" md="12">
                                <Input type="file" onChange={this.onChange}/>
                            </Col>
                        </FormGroup>
                    </CardBody>
                    <CardFooter style={estilosFooter}>
                        <Button type="submit" color="success" size="xs"
                        >
                            Subir
                        </Button> &nbsp;
                        <Button color="danger" size="xs"
                                onClick={() => this.props.history.push(`/administracion/series`)}>
                            Cancelar
                        </Button>
                    </CardFooter>
                </Form>
            </Card>
        );
    }
}

export default Informe;