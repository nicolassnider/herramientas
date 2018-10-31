<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use Respect\Validation\Validator as v;

require_once '../Commons/Slim/ValidatePermissionsMiddleware.php';
require_once '../Service/PerfilesService.php';
require_once '../Model/Perfil.php';

class PerfilesController {
    private $app;

    public function __construct($app) {
        $this->app = $app;
    }

    public function init() {
        $this->app->group('/api', function() {
            $this->group('/perfiles', function() {
                $this->get('', function(Request $request, Response $response) {
                    $service = new PerfilesService();
                    $items = $service->getAll();
                    return $response->withJson($items, 200);
                })->add(new ValidatePermissionsMiddleware([
                    'PERFILES_LISTAR'
                ]));

                $this->get('/select', function (Request $request, Response $response) {

                    $items = (new PerfilesService())->getAllActiveSorted();

                    array_walk($items, function (&$item) {
                        $label = $item->getDescripcion();
                        $item = new SelectOption($item->getId(), $label);
                    });

                    return $response->withJson($items, 200);

                });

                $this->get('/{id}', function(Request $request, Response $response) {
                    $id = $request->getAttribute('id');
                    $service = new PerfilesService();
                    $perfil = $service->get($id);
                    if ($perfil == null) {
                        return $response->withStatus(204);
                    }
                    return $response->withJson($perfil, 200);
                })->add(new ValidatePermissionsMiddleware([
                    'PERFILES_VISUALIZAR',                    
                    'PERFILES_MODIFICAR'
                ]));

                $this->post('', function(Request $request, Response $response) {
                    $perfil = PerfilesController::getInstanceFromRequest($request);

                    $service = new PerfilesService();
                    $perfil = $service->create($perfil);

                    return $response->withJson($perfil, 201);
                })->add(new ValidatePermissionsMiddleware([
                    'PERFILES_CREAR'
                ]))->add(function($request, $response, $next) {
                    PerfilesController::validate($request);                    
                    return $next($request, $response);
                });

                $this->put('/{id}', function(Request $request, Response $response) {
                    $perfil = PerfilesController::getInstanceFromRequest($request);
                    $service = new PerfilesService();

                    return $response->withJson($service->update($perfil), 204);
                })->add(new ValidatePermissionsMiddleware([
                    'PERFILES_MODIFICAR'
                ]))->add(function($request, $response, $next) {
                    PerfilesController::validate($request);
                    return $next($request, $response);
                });

                $this->delete('/{id}', function(Request $request, Response $response) {
                    $id = $request->getAttribute('id');
                    $service = new PerfilesService();
                    $service->delete($id);

                    return $response->withJson($id, 204);
                })->add(new ValidatePermissionsMiddleware([
                    'PERFILES_ELIMINAR'
                ]));
            });
        });
    }

    private static function getInstanceFromRequest(Request $request): Perfil {
        $perfil = new Perfil();
        $perfil->setId((int)$request->getAttribute('id'));
        $perfil->setNombre($request->getParam('nombre'));
        $perfil->setPermisos($request->getParam('permisos'));

        return $perfil;
    }

    private static function validate($request): void {
        v::allOf(
            v::key('nombre', v::notEmpty())
        )->assert($request->getParsedBody());
    }
}