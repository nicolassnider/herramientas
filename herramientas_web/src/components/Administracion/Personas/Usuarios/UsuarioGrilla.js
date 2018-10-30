import React from 'react';
import {Table} from 'reactstrap';

import RevendedoraFila from './UsuarioFila';

const revendedoras = (props) => {
    const style = {
        textAlign: 'center'
    }

    return (
        <Table size="sm" responsive>
            <thead>
            <tr>
                <th>Id</th>
                <th>Usuario</th>
                <th>Nombre y Apellido</th>
                <th>Perfil</th>
                <th>Status</th>
                <th style={style}></th>
            </tr>
            </thead>
            <tbody>
            {
                props.revendedoras.map((revendedora, index) => {
                    return <RevendedoraFila key={index}
                                            revendedora={revendedora}/>
                })
            }
            </tbody>
        </Table>
    )
}

export default revendedoras;