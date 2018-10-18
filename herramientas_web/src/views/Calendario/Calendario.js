import React, {Component} from 'react';
import {Button, Card, CardBody, CardHeader, Col, Row, Alert} from 'reactstrap';
import CalendarioGrilla from '../../components/Calendario/CalendarioGrilla';
import {getSeriesPorAnio, getSerieActiva, getAnios, getSerieProxima} from '../../services/SeriesServices';
import CalendarioFecha from '../../components/Calendario/CalendarioFecha';

import Select from 'react-select';
import moment from 'moment';


class Calendario extends Component {
    handleSelect = (select, value) => {
        let arrayPromises = [];
        let miState = {...this.state};
        let component = this;
        miState.anioSeleccionado = value.value;

        let p1 = getSeriesPorAnio(miState.anioSeleccionado).then(result => result.json());
        arrayPromises.push(p1);

        Promise.all(arrayPromises).then(
            (result) => {

                miState.seriesPorAnio = result[0];

                component.setState(miState);
            }
        )
    }

    constructor(props) {
        super(props);
        this.state = {

            seriesPorAnio: [],
            anios: [],
            serieActiva: null,
            proximaSerie: null,
            anioSeleccionado: null,

            loaded: false
        }

        this.handleSelect = this.handleSelect.bind(this);
    }

    componentDidMount() {
        let component = this;
        let arrayPromises = [];
        let miState = {...this.state};

        miState.anioSeleccionado = parseInt(moment().format("Y"));

        let p0 = getSerieActiva().then((result) => result.json());
        let p1 = getAnios().then(result => result.json());
        let p2 = getSeriesPorAnio(miState.anioSeleccionado).then(result => result.json());
        let p3 = getSerieProxima().then(result => result.json());

        arrayPromises.push(p0, p1, p2, p3);

        Promise.all(arrayPromises).then(
            (result) => {

                miState.serieActiva = result[0];

                /*miState.anios = result[1].map((anio, index) => {
                  return(
                    {label: anio, value: anio}
                  );
                });*/

                miState.seriesPorAnio = result[2];

                let anioFind = null;
                if (!miState.seriesPorAnio.length) {  //Pregunto si no hay series para el año por default.
                    miState.anioSeleccionado--;
                    anioFind = miState.anios.find(e => parseInt(e.value) === miState.anioSeleccionado);
                    if (anioFind) { //Pregunto si existe un año anterior al por default.
                        miState.anioSeleccionado = anioFind.value;
                        getSeriesPorAnio(miState.anioSeleccionado)
                            .then(result => result.json())
                            .then((result) => {
                                miState.seriesPorAnio = result
                            });
                    } else {

                    }


                }

                miState.proximaSerie = result[3];


                miState.loaded = true;       // console.log(miState);
                component.setState(miState);
            }
        )
    }

    render() {
        if (!this.state.loaded)
            return null;

        let titleHeader = {
            fontSize: "1.05em",
            fontWeight: "bold",
            paddingTop: "0.5em"
        }

        //this.state.anios.find(e => parseInt(e.value) === (this.state.anioSeleccionado)

        /*let anioSelectValue = null;
        let anioFind = null;
            anioFind = this.state.anios.find(e => parseInt(e.value) === this.state.anioSeleccionado);
        if(!anioFind){
          let miState = {...this.state};
          let arrayPromises = [];
          let component = this;
          miState.anioSeleccionado--;
          console.log(miState.anioSeleccionado);
          anioFind = miState.anios.find(e => parseInt(e.value) === (miState.anioSeleccionado));
          console.log("Año find", anioFind);
          miState.anioSeleccionado = anioFind.value;

          let p1 = getSeriesPorAnio(miState.anioSeleccionado).then(result=>result.json());
          arrayPromises.push(p1);

          Promise.all(arrayPromises).
          then(
            (result) => {

              miState.seriesPorAnio = result[0];

              component.setState(miState);
            }
          )

        }else{

        }*/


        return (
            <div className="animated fadeIn">
                <Row>
                    <Col lg="12">
                        {this.state.anios.length > 0 ?
                            this.state.serieActiva ?
                                <CalendarioFecha serie={this.state.serieActiva}
                                                 isActive={true}
                                                 forPresentacion={false}
                                />
                                :
                                this.state.proximaSerie ?
                                    <CalendarioFecha serie={this.state.proximaSerie}
                                                     isActive={false}
                                                     forPresentacion={false}
                                    />
                                    :
                                    null
                            :
                            null
                        }
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Card>
                            <CardHeader>
                                <Row>
                                    <Col xs="10">
                                        <div style={titleHeader}>Series</div>
                                    </Col>
                                    <Col xs="2">
                                        <Select name="anios"
                                                selectedValue={this.state.anioSeleccionado}
                                                valueKey="value" labelKey="label"
                                                options={this.state.anios}
                                                value={this.state.anios.find(e => parseInt(e.value) === parseInt(this.state.anioSeleccionado))}
                                                onChange={(e) => this.handleSelect("anios", e)}>
                                        </Select>
                                    </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>{/*console.log(this.state, "SPA")*/}
                                <CalendarioGrilla seriesPorAnio={this.state.seriesPorAnio}/>
                                {/*<Table hover responsive className="table-outline mb-0 d-none d-sm-table">
                  <thead className="thead-light">
                    <tr>
                      <th className="text-center">#</th>
                      <th className="text-center">Estado</th>
                      <th className="text-center">Serie</th>
                      <th className="text-center">Envío muestra</th>
                      <th>Laboratorio</th>
                      <th className="text-center"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-center">
                        1
                    </td>
                      <td className="text-center">
                        <Badge color="danger">Finalizada</Badge>
                      </td>
                      <td>
                        <div className="clearfix">
                          <div className="float-right">
                            Jul 21, 2018 - Ago 08, 2018
                          </div>
                        </div>
                        <Progress className="progress-xs" color="danger" value="100" />
                      </td>
                      <td className="text-center">
                        Jul 10, 2018
                    </td>
                      <td>
                        <div>Desc Laboratorio</div>
                        <div className="small text-muted">
                          <span>Nombre Apellido</span> | mail@mail.com | (011) 15 6662 7743
                      </div>
                      </td>
                      <td className="text-center">
                        <Button size="sm" color="primary"><i className="fa fa-download"></i></Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-center">
                        2
                    </td>
                      <td className="text-center">
                        <Badge color="danger">Finalizada</Badge>
                      </td>
                      <td>
                        <div className="clearfix">
                          <div className="float-right">
                            Jul 21, 2018 - Ago 08, 2018
                        </div>
                        </div>
                        <Progress className="progress-xs" color="danger" value="100" />
                      </td>
                      <td className="text-center">
                        Jul 10, 2018
                    </td>
                      <td>
                        <div>Desc Laboratorio</div>
                        <div className="small text-muted">
                          <span>Nombre Apellido</span> | mail@mail.com | (011) 15 6662 7743
                      </div>
                      </td>
                      <td className="text-center">
                        <Button size="sm" color="primary"><i className="fa fa-download"></i></Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-center">
                        3
                    </td>
                      <td className="text-center">
                        <Badge color="success">En curso</Badge>
                      </td>
                      <td>
                        <div className="clearfix">
                          <div className="float-right">
                            Jul 21, 2018 - Ago 08, 2018
                        </div>
                        </div>
                        <Progress className="progress-xs" color="success" value="25" />
                      </td>
                      <td className="text-center">
                        Jul 10, 2018
                    </td>
                      <td>
                        <div>Desc Laboratorio</div>
                        <div className="small text-muted">
                          <span>Nombre Apellido</span> | mail@mail.com | (011) 15 6662 7743
                      </div>
                      </td>
                      <td className="text-center">
                        <Button size="sm" color="primary"><i className="fa fa-send"></i></Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-center">
                        4
                    </td>
                      <td className="text-center">
                      </td>
                      <td>
                        <div className="clearfix">
                          <div className="float-right">
                            Jul 21, 2018 - Ago 08, 2018
                        </div>
                        </div>
                        <Progress className="progress-xs" color="success" value="0" />
                      </td>
                      <td className="text-center">
                        Jul 10, 2018
                    </td>
                      <td>
                        <div>Desc Laboratorio</div>
                        <div className="small text-muted">
                          <span>Nombre Apellido</span> | mail@mail.com | (011) 15 6662 7743
                      </div>
                      </td>
                      <td className="text-center">
                      </td>
                    </tr>
                    <tr>
                      <td className="text-center">
                        5
                    </td>
                      <td className="text-center">
                      </td>
                      <td>
                        <div className="clearfix">
                          <div className="float-right">
                            Jul 21, 2018 - Ago 08, 2018
                        </div>
                        </div>
                        <Progress className="progress-xs" color="success" value="0" />
                      </td>
                      <td className="text-center">
                        Jul 10, 2018
                    </td>
                      <td>
                        <div>Desc Laboratorio</div>
                        <div className="small text-muted">
                          <span>Nombre Apellido</span> | mail@mail.com | (011) 15 6662 7743
                      </div>
                      </td>
                      <td className="text-center">
                      </td>
                    </tr>
                  </tbody>
                </Table>*/}
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Calendario;
