import React, { Component } from 'react';
import { Row, Col, Alert, Card, CardHeader, Button, CardBody } from 'reactstrap';
import { grillaPersonas } from '../../../services/PersonasServices';

import PersonasGrilla from '../../../components/Personas/PersonasGrilla';
import Paginador from '../../../components/Paginador/Paginador';

class Personas extends Component {
  constructor() {
    super();
    this.state = {
      resultado: {
        personas: [],
        codigo: 0,
        mensaje: ""
      },
      personasPorPagina: [],
      currentPage: null,
      totalPages: null
    }
  }

  onPageChanged = data => {
    const { currentPage, totalPages, pageLimit } = data;
    const offset = (currentPage - 1) * pageLimit;
    const personas = this.state.resultado.personas.slice(offset, offset + pageLimit);

    this.setState({
      personasPorPagina: personas,
      currentPage: currentPage,
      totalPages: totalPages
    })
  }

  componentDidMount() {
    grillaPersonas()
      .then(response => {
        if (response.status === 200) {
          response.json()
            .then(response => {
              this.setState({
                resultado: {
                  personas: response,
                  codigo: 2000
                }
              });
            })
        } else {
          if (response.status === 500) {
            this.setState({
              resultado: {
                codigo: 5000,
                mensaje: "Error al listar las personas disponibles."
              }
            });
          }
        }
      });
  }persona

  render() {

    const addBtn = {
      textAlign: 'right'
    }
    let content = null;
    if (this.state.resultado.codigo === 2000) {
      content =
        (
          <Row>
            <Col xs="12">
              <PersonasGrilla personas={this.state.personasPorPagina} />
            </Col>
            <Col xs="12">
              <Paginador totalRecords={this.state.resultado.personas.length}
                         pageLimit={10}
                         pageNeighbours={2}
                         onPageChanged={this.onPageChanged}
                         align="center" />
            </Col>
          </Row>
        )
    } else if (this.state.resultado.codigo === 5000) {
      content =
        (
          <Row>
            <Alert color="warning">
              <strong>{this.state.resultado.mensaje}</strong>
            </Alert>
          </Row>
        )
    }

    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader style={addBtn}>
            <Button color="primary"
                    onClick={() => this.props.history.push('/administracion/personas/nuevo')}>
              Nuevo <i className="fa fa-plus"></i>
            </Button>
          </CardHeader>
          <CardBody>{content}</CardBody>
        </Card>
      </div>
    );
  };
}

export default Personas;

