import React, { Component } from 'react';
import { Row, Col, Alert, Card, CardHeader, CardBody, Button } from 'reactstrap';
import { grillaMetodos } from '../../../services/MetodosServices';

import MetodosGrilla from '../../../components/Metodos/MetodosGrilla';
import Paginador from '../../../components/Paginador/Paginador';

class Metodos extends Component {
  constructor(){
    super();
    this.state = {
      resultado: {
        metodos: [],
        codigo: null,
        mensaje: ""
      },
      metodosPorPagina: [],
      currentPage: null,
      totalPages: null
    }
  }

  onPageChanged = data => {
    const { currentPage, totalPages, pageLimit } = data;
    const offset = (currentPage - 1) * pageLimit;
    const metodos = this.state.resultado.metodos.slice(offset, offset + pageLimit);

    this.setState({
      metodosPorPagina: metodos,
      currentPage: currentPage,
      totalPages: totalPages
    })
  }

  componentDidMount(){
    grillaMetodos()
    .then(response => {
      if(response.status === 200){
        response.json()
        .then(response => {
          this.setState({
            resultado: {              
              metodos: response,
              codigo: 2000
            }
          });
        })
      }else{
        if(response.status === 500){
          this.setState({
            resultado: {
              codigo: 5000,
              mensaje: "Error al listar los laboratorios disponibles."
            }
          });
        }
      }
    });
  }

  render(){
    const addBtn = {
      textAlign: 'right'
    }
    let content = null;
    if(this.state.resultado.codigo === 2000){
      content =
      (
        <Row>
          <Col xs="12">            
            <MetodosGrilla  metodos = {this.state.metodosPorPagina} />
          </Col>
          <Col xs="12">
            <Paginador  totalRecords = {this.state.resultado.metodos.length}
                        pageLimit = {10}
                        pageNeighbours = {2}
                        onPageChanged = {this.onPageChanged}
                        align = "center" />
          </Col>
        </Row>
      )
    }else if(this.state.resultado.codigo === 5000){
      content =
      (
        <Row>
          <Alert color="warning">
            <strong> {this.state.resultado.mensaje} </strong>
          </Alert>
        </Row>
      )
    }

    return(
      <Card>
        <CardHeader style={addBtn}>
          <Button color="primary"
                  onClick={()=>this.props.history.push('/configuracion/metodos/nuevo')}>
            Nuevo <i className="fa fa-plus"></i>
          </Button>{' '}
        </CardHeader>
        <CardBody> {content} </CardBody>
      </Card>
    )
  }
}

export default Metodos;