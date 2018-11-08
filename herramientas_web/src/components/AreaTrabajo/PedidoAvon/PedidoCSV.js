import React, {Component} from 'react';
import {
    Label,
    Input,
    FormGroup,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    TabContent,
    TabPane,
    ListGroup,
    CardFooter,
    Button
} from 'reactstrap';
import {subirPedidoCSV} from '../../../services/PedidoServices';

console.log("pedidocsv");

import Validator from '../../../utils/Validator.js';
import FormValidation from '../../../utils/FormValidation';
import {informeNuevo} from "../../../services/SeriesServices";

class PedidoCSV extends Component {
    onChange = (e) => {
        let miState = {...this.state};
        miState.file = e.target.files[0];
        this.setState(miState);
    }

    constructor(props) {
        super(props);
        this.state = {
            file: null,
            fileUploadedStatus: null
        }

        this.onChange = this.onChange.bind(this);
        this.submitForm = this.submitForm.bind(this);

        this.formValidation = new FormValidation({
            component: this,
            validators: {
                'file': (value) => Validator.notEmpty(value)
            }
        });
    }

    submitForm(event) {
        event.preventDefault();
        let respuestaFileUpload = null;
        const miState = this.state;
        const formData = new FormData();
        formData.append('file', this.state.file);
        const idPedido = this.props.match.params.id;

        subirPedidoCSV(formData)
            .then(
                (result) => {
                    result.json();
                    miState.fileUploadedStatus = result.status;
                    this.setState(miState);
                    setTimeout(() => {
                        this.props.history.push("/areatrabajo/pedidosanteriores/pedidosanteriores");
                    }, 2500);
                })
    }

    render() {

        this.formValidation.validate();
        let validationState = this.formValidation.state;

        const estilosFooter = {
            textAlign: 'right'
        }

        const msgFileUploaded = (
            this.state.fileUploadedStatus ?
                <Col xs="12" lg="4" md="4" className="mt-1">
                    <Alert color={this.state.fileUploadedStatus == 200 ? "success" : "danger"}>
                        {this.state.fileUploadedStatus = 200 ?
                            "Archivo subido correctamente."
                            :
                            "Error al subir archivo, intente nuevamente mas tarde por favor."}
                    </Alert>
                </Col> : null
        )

        return (
            <Card>
                <Form onSubmit={this.submitForm}
                >
                    <CardHeader>
                        Nuevo Informe
                    </CardHeader>
                    <CardBody>
                        <FormGroup row>
                            <Col xs="12" lg="12" md="12">
                                <FormGroup>
                                    <Input type="file" onChange={this.onChange}/>
                                </FormGroup>

                            </Col>
                            {msgFileUploaded}
                        </FormGroup>
                    </CardBody>
                    <CardFooter style={estilosFooter}>
                        <Button type="submit" color="success" size="xs"

                        >
                            Subir
                        </Button> &nbsp;
                        <Button color="danger" size="xs"
                                onClick={() => this.props.history.push(`/home`)}>
                            Cancelar
                        </Button>
                    </CardFooter>
                </Form>
            </Card>
        );
    }
}

export default PedidoCSV;