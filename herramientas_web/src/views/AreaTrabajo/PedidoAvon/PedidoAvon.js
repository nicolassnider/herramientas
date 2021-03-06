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
    Form,
    TabContent,
    TabPane,
    ListGroup,
    CardFooter,
    Button,
    Table
} from 'reactstrap';
import {subirPedidoCSV} from '../../../services/PedidoServices';

import Alerts from "../../Notifications/Alerts";

console.log("pedidoAvon");

class PedidoAvon extends Component {


    onChange = (e) => {
        let miState = {...this.state};
        miState.file = e.target.file;
        console.log(e.target.files[0]);
        this.setState(miState);
        console.log(this.state);
    }

    constructor(props) {
        super(props);
        this.state = {
            file: null,
            fileUploadedStatus: null
        }

        this.onChange = this.onChange.bind(this);
        this.submitForm = this.submitForm.bind(this);


    }

    submitForm(event) {
        event.preventDefault();
        const miState = this.state;
        const formData = new FormData();
        formData.append('file', this.state.file);


        subirPedidoCSV(formData)
            .then(
                (result) => {

                    result.json();
                    miState.fileUploadedStatus = result.status;
                    this.setState(miState);
                    setTimeout(() => {
                        this.props.history.push("/areatrabajo/campania/campaniaactual");
                    }, 2500);
                })
    }

    render() {


        const estilosFooter = {
            textAlign: 'right'
        }

        const msgFileUploaded = (
            this.state.fileUploadedStatus ?
                <Col xs="12" lg="4" md="4" className="mt-1">
                    <Alerts color={this.state.fileUploadedStatus == 200 ? "success" : "danger"}>
                        {this.state.fileUploadedStatus = 200 ?
                            "Archivo subido correctamente."
                            :
                            "Error al subir archivo, intente nuevamente mas tarde por favor."}
                    </Alerts>
                </Col> : null
        )

        return (
            <Card>
                <Form onSubmit={this.submitForm}>
                    <CardHeader>
                        Nuevo Archivo
                    </CardHeader>
                    <CardBody>
                        <FormGroup row>
                            <Col xs="12" lg="12" md="12">
                                <FormGroup>
                                    <Input type="file" onChange={this.onChange}
                                    />
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
                                onClick={() => this.props.history.push(`/areatrabajo/campania/campaniaactual`)}>
                            Cancelar
                        </Button>

                        return(){

                    }
                    </CardFooter>
                </Form>
            </Card>
        );
    }
}

export default PedidoAvon;