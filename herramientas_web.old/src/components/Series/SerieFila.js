import React from 'react';
import { Button, Badge } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import moment from 'moment';

const serie = (props) => {
    const style = {
        textAlign: 'center'
    }

    return(        
        <tr>            
            <td>{moment(props.serie.cargaInicio).format("DD/MM/YYYY")}</td>
            <td>{moment(props.serie.cargaFin).format("DD/MM/YYYY")}</td>
            <td>{moment(props.serie.envioMuestra).format("DD/MM/YYYY")}</td>
            <td>{props.serie.laboratorioDescripcion}</td>
            <td style={style}>
                <Button size = "sm"
                        onClick = {()=>props.history.push(`/administracion/series/editar/${props.serie.id}`)}
                        className = "btn-outline-secondary">
                    <i className="fa fa-pencil"></i>
                </Button> &nbsp;
                {                                     
                    <Button size = "sm"
                            onClick = {()=>props.history.push(`/administracion/series/${props.serie.id}/informe`)}
                            className = "btn-outline-primary"
                            disabled={!((moment(props.serie.cargaInicio) < moment()) && (moment(props.serie.cargaFin) < moment()))}>
                        <i className="icon-paper-clip"></i>
                    </Button>
                }
            </td>
        </tr>
    );
}

export default withRouter(serie);