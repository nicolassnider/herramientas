import React from 'react';
import { Button, Badge } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import moment from 'moment';

const persona = (props) => {
  const style = {
    textAlign: 'center'
  }

  return(
    <tr>
      <td>{moment(props.persona.id)}</td>
      <td>{moment(props.persona.nombre)}</td>
      <td>{moment(props.persona.apellido)}</td>
      <td>{moment(props.persona.documento)}</td>
      <td style={style}>
        <Button size = "sm"
                onClick = {()=>props.history.push(`/administracion/personas/editar/${props.persona.id}`)}
                className = "btn-outline-secondary">
          <i className="fa fa-pencil"></i>
        </Button> &nbsp;
      </td>
    </tr>
  );
}

export default withRouter(persona);
