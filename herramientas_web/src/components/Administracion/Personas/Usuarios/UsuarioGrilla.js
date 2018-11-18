import React from 'react';
import {Table} from 'reactstrap';

import UsuarioFila from './UsuarioFila';

const usuarios = (props) => {
    const style = {
        textAlign: 'center'
    }

    return (
        <Table size="sm" responsive>
            <thead>
            <tr>
                <th>Id</th>
                <th>Usuario</th>
                <th>Perfil</th>
                <th>Status</th>
                <th style={style}>Acciones</th>
            </tr>
            </thead>
            <tbody>
            {
                props.usuarios.map((usuario, index) => {
                    return <UsuarioFila key={index}
                                        usuario={usuario}/>
                })
            }
            </tbody>
        </Table>
    )
}

export default usuarios;