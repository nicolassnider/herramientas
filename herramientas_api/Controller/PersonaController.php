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
                        $label = $item->getNombre() . ' ' . $item->getApellido() . ' (' . $item->getTipoDocumento()->getDescripcion() . ':' . $item->getDocumento() . ')';
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

                $this->post('', function (Request $request, Response $response) {
                    $persona = PersonaController::getInstanceFromRequest($request);
                    $personasService = new PersonaService();

                    $persona = $personasService->create($persona);

                    return $response->withJson($persona, 201);
                })->add(function ($request, $response, $next) {
                    PersonaController::validate($request);
                    return $next($request, $response);
                })->add(new ValidatePermissionsMiddleware([
                    'PERSONA_CREAR'
                ]));

                $this->put('/{id}', function (Request $request, Response $response) {
                    $persona = PersonaController::getInstanceFromRequest($request);
                    $personasService = new PersonaService();
                    $personasService->update($persona);
                    return $response->withJson("updated", 204);
                })->add(function ($request, $response, $next) {
                    PersonaController::validate($request);
                    return $next($request, $response);
                })->add(new ValidatePermissionsMiddleware([
                    'PERSONA_MODIFICAR'
                ]));

                $this->delete('/{id}', function (Request $request, Response $response) {
                    $id=(int)$request->getAttribute('id');
                    $personasService=new PersonaService();
                    $personasService->delete($id);
                    return $response->withJson("deleted", 204);
                })->add(new ValidatePermissionsMiddleware([
                    'PERSONA_ELIMINAR'
                ]));

                $this->put('/desactivar/{id}', function (Request $request, Response $response) {
                    $id=(int)$request->getAttribute('id');
                    $personasService = new PersonaService();
                    $personasService->deactivate($id);
                    return $response->withJson("deactivated", 204);
                })->add(new ValidatePermissionsMiddleware([
                    'PERSONA_MODIFICAR'
                ]));

                $this->put('/activar/{id}', function (Request $request, Response $response) {
                    $id=(int)$request->getAttribute('id');
                    $personasService = new PersonaService();
                    $personasService->activate($id);
                    return $response->withJson("activated", 204);
                })->add(new ValidatePermissionsMiddleware([
                    'PERSONA_MODIFICAR'
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
                    'PERSONA_CREAR',
                    'PERSONA_MODIFICAR'
                ]));


            });
        });
    }

    private static function getInstanceFromRequest(Request $request): Persona
    {
        $persona = new Persona();
        $persona->setId((int)$request->getAttribute('id'));
        $tipoDocumento = new TipoDocumento();
        $tipoDocumento->setId((int)$request->getParam('tipoDocumento')['id']);
        $persona->setTipoDocumento($tipoDocumento);
        $persona->setDocumento($request->getParam('documento'));
        $persona->setNombre($request->getParam('nombre'));
        $persona->setNombreSegundo($request->getParam('nombreSegundo'));
        $persona->setApellido($request->getParam('apellido'));
        $persona->setApellidoSegundo($request->getParam('apellidoSegundo'));
        $persona->setTelefono($request->getParam('telefono'));
        $persona->setEmail($request->getParam('email'));
        $persona->setActivo((bool)$request->getParam('activo'));
        $localidad = new Localidad();
        $localidad->setId($request->getParam('localidad')['id']);
        $persona->setLocalidad($localidad);
        $persona->setEsUsuario((bool)$request->getParam('esUsuario'));

        /*if (array_key_exists('bases', $request->getParam('usuario'))) {
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
    }*/
        return $persona;
    }

    private static function validate(Request $request): void
    {
        v::allOf(
            v::key('nombre', v::notEmpty()->StringType()->setName('Nombre')),
            v::key('apellido', v::notEmpty()->StringType()->setName('Apellido'))
        )->assert($request->getParsedBody());
    }
}