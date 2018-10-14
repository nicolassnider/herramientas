import React, { Component } from 'react';
import { Input, Col, Alert, Card, Form, FormFeedback, CardHeader, CardBody, CardFooter, Button, Row, FormGroup, Label } from 'reactstrap';
import { getPersonaPorId, nuevaPersona, editarPersona } from '../../../services/PersonasServices';

import Date from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

import Select from 'react-select';
import Validator from '../../../utils/Validator.js';
import FormValidation from '../../../utils/FormValidation';

class Persona extends Component{
  constructor(props){
    super(props);
    this.state = {
      persona: {
        "id": 2,
        "tipoDocumento": {
          "id": 1
        },
        "documento": "99999999",
        "nombre": "admin",
        "nombreSegundo": "ad",
        "apellido": "admin",
        "apellidoSegundo": "ad",
        "telefono": "9999999999",
        "email": "admin@admin.com",
        "activo": true,
        "localidad": {
          "id": 1
        },
        "fechaAltaPersona": {
          "date": "2018-09-01 00:00:00.000000"
        },
        "esUsuario": true,
        "usuario": {
          "id": 1
        }
      },
      error: {
        codigo: 0,
        mensaje: "",
        detalle: []
      },
      modified: false,
      flagPrimeraVez: true
    },

      this.idPersona = props.match.params.id;

    this.urlCancelar = "/administracion/personas";

    this.submitForm = this.submitForm.bind(this);
    // this.newData = this.newData.bind(this);
    this.handleSelect = this.handleSelect.bind(this);

    this.formValidation = new FormValidation({
      component: this,
      validators: {
        //'serie.cargaInicio': (value) => Validator.notEmpty(value),

      }
    });
  }

  componentDidMount(){
    let component = this;
    let arrayPromises = [];
    if(component.idPersona){
      let p1 = getPersonaPorId(component.idPersona).then(result => result.json());
      arrayPromises.push(p1);
    }

    //let p2 = getAllLaboratorios().then(result => result.json());

    //arrayPromises.push(p2);

    Promise.all(arrayPromises)
      .then(
        (result) => {
          let miState = {...this.state};

          if(component.idPersona){

            miState.persona = result[0];


          }

          miState.loaded = true;
          component.setState(miState);
        })
      .catch(function(err){
        console.log("Error: "+err);
      })
  }

  submitForm(event){
    event.preventDefault();
    let persona = this.state.persona;
    if(!this.idPersona){
      nuevaPersona(persona)
        .then(response => {
          if(response.status === 400){
            response.json()
              .then(response => {
                this.setState({
                  error: response,
                  modified: false,
                  flagPrimeraVez: false
                });
              })
          }else{
            if(response.status === 201){
              this.setState({
                modified: true,
                error: {
                  codigo: 2001,
                  mensaje: "",
                  detalle: [
                    "Persona creada correctamente."
                  ]
                },
                flagPrimeraVez: false
              });
              setTimeout(()=>{
                this.props.history.push("/administracion/personas");
              }, 2500);
            }else{
              if(response.status === 500){
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
    }else{
      editarPersona(persona)
        .then(response => {
          if(response.status === 400){
            response.json()
              .then(response => {
                this.setState({
                  error: response,
                  modified: false,
                  flagPrimeraVez: false
                });
              })
          }else{
            if(response.status === 204){
              this.setState({
                modified: true,
                error: {
                  codigo: 2004,
                  mensaje: "",
                  detalle: [
                    "Persona modificada correctamente."
                  ]
                },
                flagPrimeraVez: false
              });
              setTimeout(()=>{
                this.props.history.push("/administracion/personas");
              },2500);
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

  handleSelect(name, object){
    let newState = {...this.state};
    if(name === "personaId"){
      newState.persona.personaId = object.value;
      newState.persona.id = object.value;
    }
    this.setState(newState);
  }



  render(){

    this.formValidation.validate();
    let validationState = this.formValidation.state;

    const estilosFooter = {
      textAlign: 'right',
      button: {
        margin: '5px'
      }
    }

    let mensaje = null;
    if(!this.state.flagPrimeraVez){
      mensaje =
        !this.state.modified ?
          this.state.error.codigo === 4000 ?
            (<Alert color="danger">
              <strong> {this.state.error.mensaje} </strong> <br />
              <ul>
                {this.state.error.detalle.map((detalle, index) => {
                  return <li key={index}>{detalle}</li>
                })}
              </ul>
            </Alert>)
            :
            (<Alert color="warning">
              <strong> {this.state.error.mensaje} </strong> <br />
              {this.state.error.detalle}
            </Alert>)
          :
          this.state.error.codigo === 2001 || this.state.error.codigo === 2004 ?
            (<Alert color="success">
              <h6>{this.state.error.detalle}</h6>
            </Alert>)
            :
            (<Alert color="warning">
              <strong> {this.state.error.mensaje} </strong> <br />
              {this.state.error.detalle}
            </Alert>)
    }

    return(
      <Card>
        <Form onSubmit = {this.submitForm}>
          <CardHeader>
            {!this.idPersona ? "Crear Persona" : "Modificar Persona" }
          </CardHeader>
          <CardBody>
            <Row>
              <Col sm="8" xs="12">
                <FormGroup>
                  <Label  htmlFor="nombre">Nombre de la Persona:</Label>
                  <input   aria-placeholder="ingresar nombre"
                           className="form-control input-group-text"/>
                </FormGroup>
                <FormGroup>
                  <Label  htmlFor="apellido">Apellido de la Persona:</Label>
                  <input   aria-placeholder="ingresar apellido"
                           className="form-control input-group-text"/>
                </FormGroup>
                <FormGroup>
                  <Label  htmlFor="documento">Documento de la Persona:</Label>
                  <input   aria-placeholder="ingresar documento"
                           className="form-control input-group-text"/>
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
              {!this.idPersona ? "Crear" : "Modificar"}
            </Button>
            <Button type="submit" color="danger" size="xs"
                    onClick={()=>this.props.history.push(this.urlCancelar)}>
              Cancelar
            </Button>
          </CardFooter>
        </Form>
      </Card>
    )
  }
}

export default Persona;
