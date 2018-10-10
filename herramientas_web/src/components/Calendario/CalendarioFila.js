import React from 'react';
import { Button, Badge, Progress, Col } from 'reactstrap';
import moment from 'moment';
import mimeTypes from 'mime-types';

import downloadJs from 'downloadjs';
import reactFileDownload from 'react-file-download';

import { descargarInforme } from '../../services/SeriesServices';

const CalendarioFila = (props) => {
    
    const style = {
        textAlign: 'center'
    }

    let estadoSerie = null;
    let progresoSerie = null;

    let momentInicio = moment(props.serie.cargaInicio);
    let momentFin = moment(props.serie.cargaFin);

    let diffDays = moment.duration(momentInicio.diff(momentFin)).asDays();          //Cantidad de días de la serie.
    let diffDaysToday = moment.duration(momentInicio.diff(moment())).asDays();
    
    let porcSerie = Math.round(diffDaysToday / diffDays * 100);
    
    if( moment() > moment(props.serie.cargaInicio) && moment() < moment(props.serie.cargaFin) ){
        estadoSerie = (
            <Badge color="success">En Curso</Badge>
        )
        progresoSerie = (
            <React.Fragment>
                <div className="clearfix">
                    <div className="float-right">
                        {moment(props.serie.cargaInicio).format("DD/MM/YYYY")} - {moment(props.serie.cargaFin).format("DD/MM/YYYY")}
                    </div>
                </div>
                <Progress className="progress-xs" color="success" value={porcSerie} />
            </React.Fragment>            
        )
    }else{
        if( moment() < moment(props.serie.cargaInicio) && moment() < moment(props.serie.cargaFin)){
            estadoSerie = (
                <Badge color="primary">No Comenzó</Badge>
            )
            progresoSerie = (
                <React.Fragment>
                    <div className="clearfix">
                        <div className="float-right">
                            {moment(props.serie.cargaInicio).format("DD/MM/YYYY")} - {moment(props.serie.cargaFin).format("DD/MM/YYYY")}
                        </div>
                    </div>
                    <Progress className="progress-xs" color="primary" value="0" />
                </React.Fragment>
            )
        }else{
            estadoSerie = (
                <Badge color="danger">Finalizada</Badge>
            )
            progresoSerie = (
                <React.Fragment>
                    <div className="clearfix">
                        <div className="float-right">
                            {moment(props.serie.cargaInicio).format("DD/MM/YYYY")} - {moment(props.serie.cargaFin).format("DD/MM/YYYY")}
                        </div>
                    </div>
                    <Progress className="progress-xs" color="danger" value="100" />
                </React.Fragment>
            )
        }        
    }
    
    let descLaboratorio = null;
        descLaboratorio = (
            <React.Fragment>
                <div>{props.serie.laboratorio.descripcion}</div>                
            </React.Fragment>
        )
    
    const getInforme = event => {
        event.preventDefault();

        descargarInforme(props.serie.id)
        .then(
            (result) => {
                console.log(result);
                //Stand by, necesitaría poder acceder al header Content-Disposition o hacer otra cosa para poder obtener la extensión del archivo a descargar."
                return result;
            }
        )
        .then(
            (result) => {
                //console.log("URL",URL.createObjectURL(result));
                  console.log(result);              
                

                return downloadJs(result,"Informe_"+props.serie.id+"."+mimeTypes.extension(result.type),result.type);
            }
        )
        
        
        

        

    }

    let btnDescargar = null;
        btnDescargar = (
                <Button color="primary"
                        disabled={!props.serie.informeCargado}
                        onClick = {(event)=>getInforme(event)}
                >
                    <i className="fa fa-download mt-1"></i>
                </Button>
        )

        return(
            <tr>
                <td style={style}>{estadoSerie}</td>
                <td>{progresoSerie}</td>
                <td style={style}>{moment(props.serie.envioMuestra).format("DD/MM/YYYY")}</td>
                <td>{descLaboratorio}</td>
                <td style={{paddingLeft: "0.9em"}}>{btnDescargar}</td>
            </tr>
        )

}
export default CalendarioFila;