<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 28/09/2018
 * Time: 7:36 AM
 */

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require_once '../Service/RevendedoraService.php';

class RevendedoraController
{
    private $app;

    public function __construct($app)
    {
        $this->app = $app;
    }

    public function init()
    {
        $this->app->group('/api', function () {
            $this->group('/revendedoras', function () {
                $this->get('', function (Request $request, Response $response) {
                    $revendedoraService = new RevendedoraService();
                    $revendedoras = $revendedoraService->getAll();
                    return $response->withJson($revendedoras, 200);
                })->add(new ValidatePermissionsMiddleware([
                    'REVENDEDORA_LISTAR'
                ]));
                $this->get('/{id}', function (Request $request, Response $response) {
                    $service = new RevendedoraService();
                    $id = $request->getAttribute('id');
                    $items = $service->get($id);
                    if ($items == null) {
                        return $response->withJson($items, 400);
                    }
                    return $response->withJson($items, 200);
                })->add(new ValidatePermissionsMiddleware([
                    'REVENDEDORA_VISUALIZAR'
                ]));

                $this->post('', function (Request $request, Response $response) {
                    $revendedora = RevendedoraController::getInstanceFromRequest($request);
                    $service = new RevendedoraService();
                    $service->create($revendedora);
                    return $response->withJson($revendedora, 201);

                })->add(new ValidatePermissionsMiddleware([
                    'CAMPANIA_CREAR'
                ]));
            });
        });
    }

    private static function getInstanceFromRequest(Request $request): Revendedora
    {
        $revendedora = new Revendedora();
        $revendedora->setId((int)$request->getAttribute('id'));

        if ($request->getParam('categoriaRevendedora')) {
            $categoriaRevendedora = new CategoriaRevendedora();
            if ($request->getParam('categoriaRevendedora')['id'] == null) {
                $categoriaRevendedora = null;
            } else {
                $categoriaRevendedora->setId($request->getParam('cebe')['id']);
            }
            $revendedora->setCategoriaRevendedora($categoriaRevendedora);
        } else {
            $revendedora->setCebe(null);
        }

        $revendedora->setFechaAltaRevendedora($request->getParam('fechaAltaRevendedora'));
        $revendedora->setActivo($request->getParam('activo'));

        if ($request->getParam('persona')) {
            $persona = new Persona();
            if ($request->getParam('persona')['id'] == null) {
                $persona = null;
            } else {
                $persona->setId($request->getParam('persona')['id']);
            }
            $revendedora->setPersona($persona);
        } else {
            $revendedora->setPersona(null);
        }

    }

}