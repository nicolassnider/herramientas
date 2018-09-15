<?php

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use Respect\Validation\Validator as v;
use Slim\Http\UploadedFile;

require_once '../Service/PersonaService.php';
require_once '../Service/PerfilesService.php';
require_once '../Model/Persona.php';
require_once '../Model/TipoDocumento.php';
require_once '../Model/Pais.php';
require_once '../Model/Localidad.php';
require_once '../Model/Provincia.php';
require_once '../Model/TipoDocumento.php';
require_once '../Model/Usuario.php';
require_once '../Model/Perfil.php';
require_once '../Model/Adjunto.php';
require_once '../Dto/DataTableRequest.php';
require_once '../Dto/DataTablesResponse.php';

class PersonaController
{
    private $app;

    public function __construct($app)
    {
        $this->app = $app;
    }

    public function init()
    {
        $this->app->group('/api', function () {
            $this->group('/personas', function () {

                $this->get('/grid', function (Request $request, Response $response) {
                    $dataTableRequest = new DataTableRequest();
                    $dataTableRequest->setLength($_GET['length']);
                    $dataTableRequest->setArrayColsFilter($_GET['columns']);
                    $dataTableRequest->setStart($_GET['start']);
                    $dataTableRequest->setOrderColumn($_GET['order'][0]);
                    $dataTableRequest->setSearch($_GET['search']['value']);

                    $dataTableResponse = new DataTablesResponse();
                    $dataTableResponse->setDraw((int)$_GET['draw']);

                    $dataTableService = new PersonaService();
                    return $response->withJson(
                        $dataTableService->grid($dataTableResponse, $dataTableRequest),
                        200
                    );
                })->add(new ValidatePermissionsMiddleware([
                    'PERSONAS_LISTAR'
                ]));

                $this->get('', function (Request $request, Response $response) {
                    $personasService = new PersonaService();
                    $personas = $personasService->getAll();
                    return $response->withJson($personas, 200);
                })->add(new ValidatePermissionsMiddleware([
                    'PERSONA_LISTAR'
                ]));

                $this->get('/select', function (Request $request, Response $response) {

                    $items = (new PersonaService())->getAllActiveSorted();

                    array_walk($items, function (&$item) {
                        $label = $item->getNombre() . ' '.$item->getApellido() . ' (' . $item->getTipoDocumento()->getDescripcion() . ':' . $item->getDocumento() . ')';
                        $item = new SelectOption($item->getId(), $label);
                    });

                    return $response->withJson($items, 200);

                });

                $this->get('/{id}', function (Request $request, Response $response) {
                    $id = $request->getAttribute('id');
                    $personasService = new PersonaService();
                    $persona = $personasService->get($id);

                    if ($persona == null) {
                        return $response->withStatus(204);
                    }
                    return $response->withJson($persona, 200);
                })->add(new ValidatePermissionsMiddleware([
                    'PERSONA_VISUALIZAR'
                ]));

                $this->get('/permiso/{permiso}/select', function (Request $request, Response $response) {
                    $permiso = $request->getAttribute('permiso');
                    $items = (new PersonaService())->getAllActiveSortedByPermiso($permiso);
                    array_walk($items, function (&$item) {
                        $label = $item->getNombre() . ' ' . $item->getApellido() . ' (' . $item->getDocumentoTipo()->getNombre() . ':' . $item->getDocumentoNumero() . ')';
                        $item = new SelectOption($item->getId(), $label);
                    });
                    return $response->withJson($items, 200);
                })->add(new ValidatePermissionsMiddleware([
                    'MOVILES_CREAR',
                    'MOVILES_MODIFICAR'
                ]));

                $this->post('', function (Request $request, Response $response) {
                    $persona = PersonaController::getInstanceFromRequest($request);
                    $personasService = new PersonasService();
                    $persona = $personasService->create($persona);

                    return $response->withJson($persona, 201);
                })->add(function ($request, $response, $next) {
                    PersonaController::validate($request);
                    return $next($request, $response);
                })->add(new ValidatePermissionsMiddleware([
                    'PERSONAS_CREAR'
                ]));

                $this->put('/{id}', function (Request $request, Response $response) {
                    $persona = PersonaController::getInstanceFromRequest($request);
                    $personasService = new PersonasService();

                    return $response->withJson($personasService->update($persona), 204);
                })->add(function ($request, $response, $next) {
                    PersonaController::validate($request);
                    return $next($request, $response);
                })->add(new ValidatePermissionsMiddleware([
                    'PERSONAS_MODIFICAR'
                ]));

                $this->get('/foto/{foto}', function (Request $request, Response $response) {
                    $photoFilename = $request->getAttribute('foto');
                    $personasService = new PersonasService();
                    $photoFile = $personasService->getPhoto($photoFilename);
                    $photoMimeType = $personasService->getPhotoMimeType($photoFilename);
                    $response->write($photoFile);
                    return $response->withHeader('Content-Type', $photoMimeType);
                });

                $this->post('/foto', function (Request $request, Response $response) {
                    $uploadedFiles = $request->getUploadedFiles();
                    $uploadedFile = $uploadedFiles['file'];
                    if ($uploadedFile->getError() === UPLOAD_ERR_OK) {
                        $photoFilename = (new PersonasService())->savePhoto($uploadedFile);

                        return $response->withJson([
                            'foto' => $photoFilename
                        ], 200);
                    } else {
                        //TODO: ERROR
                    }
                });

                $this->get('/adjunto/{adjunto}', function (Request $request, Response $response) {
                    $filename = $request->getAttribute('adjunto');
                    $service = new PersonasService();
                    $file = $service->getFile($filename);
                    $fileMimeType = $service->getFileMimeType($filename);
                    $response->write($file);
                    return $response->withHeader('Content-Type', $fileMimeType);
                });

                $this->post('/adjunto', function (Request $request, Response $response) {
                    $uploadedFiles = $request->getUploadedFiles();
                    $uploadedFile = $uploadedFiles['file'][0];
                    if ($uploadedFile->getError() === UPLOAD_ERR_OK) {
                        $photoFilename = (new PersonasService())->saveFile($uploadedFile);

                        return $response->withJson([
                            'archivo' => $photoFilename
                        ], 200);
                    } else {
                        //TODO: ERROR
                    }
                });

                $this->delete('/adjunto/{adjunto}', function (Request $request, Response $response) {
                    $filename = $request->getAttribute('adjunto');
                    (new PersonasService())->deleteFile($filename);
                    return $response->withJson(null, 204);
                });

                $this->post('/blank-password/{id}', function (Request $request, Response $response) {
                    $id = $request->getAttribute('id');

                    (new PersonasService())->blankPassword($id);
                });

                $this->post('/change-password', function (Request $request, Response $response) {
                    $token = $request->getHeader('Authorization-Token')[0];
                    $claveActual = $request->getParam('claveActual');
                    $clave = $request->getParam('clave');

                    (new PersonasService())->changePassword($claveActual, $clave, $token);
                });
            });
        });
    }

    private static function getInstanceFromRequest(Request $request): Persona
    {
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

        $categoria = null;

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
        $persona->setTelefonoCodArea((int)$request->getParam('telefonoCodArea'));
        $persona->setTelefonoNumero((int)$request->getParam('telefonoNumero'));
        $persona->setCelularCodArea((int)$request->getParam('celularCodArea'));
        $persona->setCelularNumero((int)$request->getParam('celularNumero'));
        $persona->setEmail($request->getParam('email'));
        $persona->setObservaciones($request->getParam('observaciones'));
        $persona->setLegajoNumero($request->getParam('legajoNumero'));
        $persona->setFechaIngreso($request->getParam('fechaIngreso'));
        $persona->setFechaBaja($request->getParam('fechaBaja'));
        $base = new Base();
        $base->setId($request->getParam('base')['id']);
        $persona->setBase($base);

        if ($request->getParam('categoria')) {

            $categoria = new PersonaCategoria();
            if ($request->getParam('categoria')['id'] == null) {
                $categoria = null;
            } else {
                $categoria->setId($request->getParam('categoria')['id']);
            }
            $persona->setCategoria($categoria);

        } else {
            $persona->setCategoria(null);
        }


        $persona->setContrato($request->getParam('contrato'));
        $persona->setYpfRuta($request->getParam('ypfRuta'));
        $persona->setComentariosLaborales($request->getParam('comentariosLaborales'));
        $persona->setEsUsuario($request->getParam('esUsuario'));
        $persona->setFoto($request->getParam('foto'));

        if ($adjuntos = $request->getParam('adjuntos')) {
            array_walk($adjuntos, function (&$item) {
                $adjunto = new Adjunto();
                $adjunto->setAdjunto($item['adjunto']);
                $item = $adjunto;
            });
            $persona->setAdjuntos($adjuntos);
        }

        if ($persona->getEsUsuario()) {
            $usuario = new Usuario();
            $perfil = new Perfil();
            $gerenciador = new Gerenciador();
            $movil = new Movil();

            $usuario->setUsuario($request->getParam('usuario')['usuario']);
            //$usuario->setClave($request->getParam('usuario')['clave']);
            $perfil->setId($request->getParam('usuario')['perfil']['id']);
            $usuario->setPerfil($perfil);
            if (array_key_exists('notificacionesActivas', $request->getParam('usuario'))) {
                $usuario->setNotificacionesActivas($request->getParam('usuario')['notificacionesActivas']);
            } else {
                $usuario->setNotificacionesActivas(false);
            }
            if (array_key_exists('movil', $request->getParam('usuario'))) {
                $request->getParam('usuario')['movil']['id'] === null ? $movil = null : $movil->setId($request->getParam('usuario')['movil']['id']);
            } else {
                $movil = null;
            }
            $usuario->setMovil($movil);
            if (array_key_exists('gerenciador', $request->getParam('usuario'))) {
                $gerenciador->setId($request->getParam('usuario')['gerenciador']['id']);
            } else {
                $gerenciador = null;
            }
            $usuario->setGerenciador($gerenciador);

            if (array_key_exists('bases', $request->getParam('usuario'))) {
                if ($request->getParam('usuario')['bases']) {
                    $items = ($request->getParam('usuario')['bases']);
                    $bases = Array();
                    foreach ($items as $item) {
                        $base = new Base();
                        $base->setId($item['id']);
                        array_push($bases, $base);
                    }
                    $usuario->setBases($bases);
                }
            } else {
                $usuario->setBases(Array());
            }

            $persona->setUsuario($usuario);
        }
        return $persona;
    }

    private static function validate(Request $request): void
    {
        v::allOf(
            v::key('nombre', v::notEmpty()->StringType()->setName('Nombre')),
            v::key('apellido', v::notEmpty()->StringType()->setName('Apellido')),
            v::key('documentoNumero', v::notEmpty()->intVal()->setName('Nro. Documento')),
            v::keyNested('documentoTipo.id', v::notEmpty()->intVal()->setName('Tipo Documento')),
            v::key('esActivo', v::boolType()->setName('Activo')),
            v::key('esUsuario', v::boolType()->setName('Es Usuario')),
            v::when(v::key('esUsuario', v::trueVal()),
                v::keyNested('usuario.usuario', v::notEmpty()->StringType()->setName('Usuario')),
                v::alwaysValid()
            ),
            v::when(v::key('esUsuario', v::trueVal()),
                v::key('email', v::notEmpty()->email()->setName('Email')),
                v::key('email', v::optional(v::email())->setName('Email'), false)
            )
        )->assert($request->getParsedBody());
    }
}