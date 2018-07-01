<?php
/**
 * Created by Nicolás Snider
 * Date: 01/07/2018
 * Time: 12:43 AM
 */

class PersonaService implements JsonSerializable
{

    private $id;
    private $documentoTipo;
    private $documentoNumero;
    private $nombre;
    private $apellido;
    private $email;
    private $telefono;

    /**
     * @return mixed
     */
    public function getId():?int
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     */
    public function setId( $id)
    {
        $this->id = $id;
    }

    /**
     * @return mixed
     */
    public function getDocumentoTipo():?DocumentoTipo
    {
        return $this->documentoTipo;
    }

    /**
     * @param mixed $documentoTipo
     */
    public function setDocumentoTipo($documentoTipo)
    {
        $this->documentoTipo = $documentoTipo;
    }

    /**
     * @return mixed
     */
    public function getDocumentoNumero()
    {
        return $this->documentoNumero;
    }

    /**
     * @param mixed $documentoNumero
     */
    public function setDocumentoNumero($documentoNumero)
    {
        $this->documentoNumero = $documentoNumero;
    }

    /**
     * @return mixed
     */
    public function getNombre()
    {
        return $this->nombre;
    }

    /**
     * @param mixed $nombre
     */
    public function setNombre($nombre)
    {
        $this->nombre = $nombre;
    }

    /**
     * @return mixed
     */
    public function getApellido()
    {
        return $this->apellido;
    }

    /**
     * @param mixed $apellido
     */
    public function setApellido($apellido)
    {
        $this->apellido = $apellido;
    }

    /**
     * @return mixed
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * @param mixed $email
     */
    public function setEmail($email)
    {
        $this->email = $email;
    }

    /**
     * @return mixed
     */
    public function getTelefono()
    {
        return $this->telefono;
    }

    /**
     * @param mixed $telefono
     */
    public function setTelefono($telefono)
    {
        $this->telefono = $telefono;
    }



    public function jsonSerialize()
    {
        return
            [
                'id' => $this->id,
                'documentoTipo' => $this->documentoTipo,
                'documentoNumero' => $this->documentoNumero,
                'nombre'=>$this->nombre,
                'apellido'=>$this->apellido,
                'email'=>$this->email,
                'telefono'=>$this->telefono

            ];
    }
}