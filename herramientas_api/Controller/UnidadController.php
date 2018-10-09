<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 08/10/2018
 * Time: 10:19 PM
 */

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require_once "../Service/UnidadService.php";
require_once "../Model/Cliente.php";


class UnidadController
{
    private $app;

    public function __construct($app)
    {
        $this->app = $app;
    }

    public function init()
    {

        $this->app->group('/api', function () {
            $this->group('/unidades', function () {

                $this->get('/select', function (Request $request, Response $response) {
                    $service = new UnidadService();
                    $items = $service->getAllActiveSorted();
                    array_walk($items, function (&$item) {
                        $item = new SelectOption($item->getId(), $item->getDescripcion);
                    });
                    return $response->withJson($items, 200);
                });

                $this->get('', function (Request $request, Response $response) {
                    $service = new UnidadService();
                    $items = $service->getAll();
                    return $response->withJson($items, 200);

                });


                $this->get('/{id}', function (Request $request, Response $response) {
                    $service = new UnidadService();
                    $id = $request->getAttribute('id');
                    $items = $service->get($id);
                    if ($items == null) {
                        return $response->withJson($items, 400);
                    }
                    return $response->withJson($items, 200);
                });

                $this->post('', function (Request $request, Response $response) {
                    $service = new UnidadService();
                    $cliente = UnidadController::getInstanceFromRequest($request);
                    $service->create($cliente);
                    return $response->withJson($cliente, 201);

                });

                $this->put('/{id}', function (Request $request, Response $response) {
                    $service = new UnidadService();
                    $cliente = UnidadController::getInstanceFromRequest($request);
                    $service->update($cliente);
                    return $response->withJson("updated", 204);

                });

                $this->delete('/{id}', function (Request $request, Response $response) {
                    $service = new UnidadService();
                    $id = $request->getAttribute('id');
                    $service->delete($id);
                    return $response->withJson("deleted", 204);

                });


            });

        });

    }

    private static function getInstanceFromRequest(Request $request): Unidad
    {
        $unidad = new Unidad();
        $unidad->setId((int)$request->getAttribute('id'));
        $unidad->setDescripcion($request->getParam('descripcion'));

        return $unidad;
    }

}