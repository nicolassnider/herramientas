<?php
/**
 * Created by Nicolás Snider
 * Date: 01/07/2018
 * Time: 12:42 AM
 */
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use Respect\Validation\Validator as v;
use Slim\Http\UploadedFile;

require_once '../Service/PersonaService.php';

require_once '../Dto/DataTableRequest.php';
require_once '../Dto/DataTablesResponse.php';


class PersonaController {
    private $app;

    public function __construct($app) {
        $this->app = $app;
    }

    public function init() {
        $this->app->group('/api', function() {
            $this->group('/personas', function() {
                $this->group('/permiso',function(){
                    $this->get('/{permiso}', function (Request $request, Response $response){
                        $permiso= $request->getAttribute('permiso');
                        $personaService= new PersonasService();
                        $personas=$personaService->getAllByPermiso($permiso);
                        return $response->withJson($personas, 200);

                    });
                });
                $this->get('/grid', function(Request $request, Response $response) {
                    $dataTableRequest = new DataTableRequest();
                    $dataTableRequest->setLength($_GET['length']);
                    $dataTableRequest->setArrayColsFilter($_GET['columns']);
                    $dataTableRequest->setStart($_GET['start']);
                    $dataTableRequest->setOrderColumn($_GET['order'][0]);
                    $dataTableRequest->setSearch($_GET['search']['value']);

                    $dataTableResponse = new DataTablesResponse();
                    $dataTableResponse->setDraw((int)$_GET['draw']);

                    $dataTableService = new PersonasService();
                    return $response->withJson(
                        $dataTableService->grid($dataTableResponse, $dataTableRequest),
                        200
                    );
                });

                $this->get('', function(Request $request, Response $response) {
                    $personasService = new PersonasService();
                    $personas = $personasService->getAll();

                    return $response->withJson($personas, 200);
                });

                $this->get('/{id}', function(Request $request, Response $response) {
                    $id = $request->getAttribute('id');
                    $personasService = new PersonasService();
                    $persona = $personasService->get($id);

                    if ($persona == null) {
                        return $response->withStatus(204);
                    }
                    return $response->withJson($persona, 200);
                });

                $this->post('', function(Request $request, Response $response) {
                    $persona = PersonaController::getInstanceFromRequest($request);
                    $personasService = new PersonasService();
                    $persona = $personasService->create($persona);


                    return $response->withJson($persona, 201);
                })->add(function($request, $response, $next) {
                    PersonaController::validate($request);
                    return $next($request, $response);
                });

                $this->put('/{id}', function(Request $request, Response $response) {
                    $persona = PersonaController::getInstanceFromRequest($request);
                    $personasService = new PersonasService();

                    return $response->withJson($personasService->update($persona), 204);
                })->add(function($request, $response, $next) {
                    PersonaController::validate($request);
                    return $next($request, $response);
                });

                $this->post('/foto', function(Request $request, Response $response) {
                    // TODO: Verificar errores.
                    $uploadedFiles = $request->getUploadedFiles();
                    $uploadedFile = $uploadedFiles['file'];
                    if ($uploadedFile->getError() === UPLOAD_ERR_OK) {
                        $personasService = new PersonasService();
                        $photoFilename = $personasService->savePhoto($uploadedFile);

                        return $response->withJson([
                            'foto' => $photoFilename
                        ], 200);
                    } else {
                        //TODO: ERROR
                    }
                });

                $this->get('/foto/{foto}', function(Request $request, Response $response) {
                    // TODO: Verificar errores.
                    $photoFilename = $request->getAttribute('foto');
                    $photoFile = (new PersonasService())->getPhoto($photoFilename);
                    $response->write($photoFile);
                    return $response->withHeader('Content-Type', 'image/png');
                });

                // TODO: Eliminar este método
                /*$this->delete('/{idPersona}', function(Request $request, Response $response) {
                    $idPersona = $request->getAttribute('idPersona');

                    $personasService = new PersonasService();
                    $personasService->eliminar($idPersona);

                    return $response->withJson($idPersona, 204);
                });*/
            });
        });
    }

    private static function getInstanceFromRequest(Request $request): Persona {
        $tipoDocumento = new TipoDocumento();
        $tipoDocumento->setId($request->getParam('documentoTipo')['id']);

        $nacionalidad = new Pais();
        $nacionalidad->setId($request->getParam('nacionalidad')['id']);

        $localidad = new Localidad();
        $localidad->setId($request->getParam('localidad')['id']);

        $provincia = new Provincia();
        $provincia->setId($request->getParam('provincia')['id']);

        $pais = new Pais();
        $pais->setId($request->getParam('pais')['id']);

        $categoria=null;

        $persona = new Persona();
        $persona->setId((int)$request->getAttribute('id'));
        $persona->setNombre($request->getParam('nombre'));
        $persona->setApellido($request->getParam('apellido'));
        $persona->setDocumentoTipo($tipoDocumento);
        $persona->setDocumentoNumero($request->getParam('documentoNumero'));
        $persona->setNacionalidad($nacionalidad);
        $persona->setSexo($request->getParam('sexo'));
        $persona->setFechaNacimiento($request->getParam('fechaNacimiento'));
        $persona->setEsActivo($request->getParam('esActivo'));
        $persona->setCalle($request->getParam('calle'));
        $persona->setNumero($request->getParam('numero'));
        $persona->setPiso($request->getParam('piso'));
        $persona->setDepartamento($request->getParam('departamento'));
        $persona->setLocalidad($localidad);
        $persona->setProvincia($provincia);
        $persona->setPais($pais);
        $persona->setTelefonoCodArea($request->getParam('telefonoCodArea'));
        $persona->setTelefonoNumero($request->getParam('telefonoNumero'));
        $persona->setCelularCodArea($request->getParam('celularCodArea'));
        $persona->setCelularNumero($request->getParam('celularNumero'));
        $persona->setEmail($request->getParam('email'));
        $persona->setObservaciones($request->getParam('observaciones'));
        $persona->setLegajoNumero($request->getParam('legajoNumero'));
        $persona->setFechaIngreso($request->getParam('fechaIngreso'));
        $persona->setFechaBaja($request->getParam('fechaBaja'));
        $base = new Base();
        $base->setId($request->getParam('base')['id']);
        $persona->setBase($base);

        if ($request->getParam('categoria'))
        {

            $categoria = new PersonaCategoria();
            if ($request->getParam('categoria')['id']==null)
            {
                $categoria=null;
            }
            else {
                $categoria->setId($request->getParam('categoria')['id']);
            }
            $persona->setCategoria($categoria);

        }
        else {
            $persona->setCategoria(null);
        }


        $persona->setContrato($request->getParam('contrato'));
        $persona->setYpfRuta($request->getParam('ypfRuta'));
        $persona->setComentariosLaborales($request->getParam('comentariosLaborales'));
        $persona->setEsUsuario($request->getParam('esUsuario'));
        $persona->setFoto($request->getParam('foto'));

        if($persona->getEsUsuario()){
            $usuario = new Usuario();
            $perfil = new Perfil();
            $gerenciador = new Gerenciador();

            $usuario->setUsuario($request->getParam('usuario')['usuario']);
            $usuario->setClave($request->getParam('usuario')['clave']);
            $perfil->setId($request->getParam('usuario')['perfil']['id']);
            $usuario->setPerfil($perfil);
            $usuario->setNotificacionesActivas($request->getParam('usuario')['notificacionesActivas']);
            //$usuario->setMovil($request->getParam('usuario')['movil']);
            $gerenciador->setId($request->getParam('usuario')['gerenciador']['id']);
            $usuario->setGerenciador($gerenciador);


            $persona->setUsuario($usuario);
        }

        return $persona;
    }

    private static function validate(Request $request): void {





        v::allOf(
            v::key('nombre', v::notEmpty()->StringType()),
            v::key('apellido',  v::notEmpty()->StringType()),
            v::key('documentoNumero', v::intVal()),
            v::keyNested('documentoTipo.id', v::notEmpty()->intVal()),
            v::key('esActivo', v::boolType()),
            /*v::when(v::key('esUsuario',v::trueVal()),v::key('usuario',V::notEmpty()))*/

            v::key('esUsuario', v::boolType()),


            v::when(v::key('esUsuario', v::trueVal()),
                v::keyNested('usuario.usuario',v::notEmpty()->StringType()),
                v::optional(v::key('usuario'))
            ),
            v::when(v::key('esUsuario', v::trueVal()),
                v::key('email',v::notEmpty()->email()),
                v::key('email',v::optional(v::email()))
            )


        )->assert($request->getParsedBody());
    }
}