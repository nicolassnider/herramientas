<?php

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use Respect\Validation\Validator as v;

/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 16/09/2018
 * Time: 12:11 AM
 */
require_once '../Service/CampaniaService.php';

class CampaniaController
{
    private $app;

    public function __construct($app)
    {
        $this->app = $app;
    }

    public function init()
    {
        $this->app->group('/api', function () {
            $this->group('/campanias', function () {
                $this->get('', function (Request $request, Response $response) {
                    $service = new CampaniaService();
                    $items = $service->getAll();
                    return $response->withJson($items, 200);

                })->add(new ValidatePermissionsMiddleware([
                    'CAMPANIA_LISTAR'
                ]));

                $this->get('/{id}', function (Request $request, Response $response) {
                    $service = new CampaniaService();
                    $id = $request->getAttribute('id');
                    $items = $service->get($id);
                    if ($items == null) {
                        return $response->withJson($items, 400);
                    }
                    return $response->withJson($items, 200);
                })->add(new ValidatePermissionsMiddleware([
                    'CAMPANIA_VISUALIZAR'
                ]));

                $this->get('/campania/activa', function (Request $request, Response $response) {
                    $service = new CampaniaService();
                    $items = $service->getCampaniaActiva();
                    if ($items == null) {
                        return $response->withJson($items, 400);
                    }
                    return $response->withJson($items, 200);
                })->add(new ValidatePermissionsMiddleware([
                    'CAMPANIA_VISUALIZAR'
                ]));

                $this->put('/desactivar/{id}', function (Request $request, Response $response) {
                    $service = new CampaniaService();
                    $id = $request->getAttribute('id');
                    $service->desactivarCampania($id);

                })->add(new ValidatePermissionsMiddleware([
                    'CAMPANIA_DESACTIVAR'
                ]));

                $this->post('', function (Request $request, Response $response) {
                    $campania = CampaniaController::getInstanceFromRequest($request);
                    $service = new CampaniaService();
                    $service->create($campania);
                    return $response->withJson($campania, 201);

                })->add(new ValidatePermissionsMiddleware([
                    'CAMPANIA_CREAR'
                ]));

                $this->put('/{id}', function (Request $request, Response $response) {
                    $campania = CampaniaController::getInstanceFromRequest($request);
                    $service = new PersonaCategoriaService();
                    return $response->withJson($service->update($campania), 204);

                })->add(new ValidatePermissionsMiddleware([
                    'CAMPANIA_MODIFICAR'
                ]));

                $this->delete('/{id}', function (Request $request, Response $response) {
                    $id = $request->getAttribute('id');
                    $service = new CampaniaService();
                    $service->delete($id);
                    return $response->withJson($service, 204);

                })->add(new ValidatePermissionsMiddleware([
                    'CAMPANIA_MODIFICAR'
                ]));

            });

        });

    }

    private static function getInstanceFromRequest(Request $request): Campania
    {
        $campania = new Campania();
        $campania->setId((int)$request->getAttribute('id'));
        $fechaInicio = new DateTime($request->getParam('fechaInicio'));
        $campania->setFechaInicio($fechaInicio);
        $fechaFin = new DateTime($request->getParam('fechaFin'));
        $campania->setFechaFin($fechaFin);
        $campania->setDescripcion($request->getParam('descripcion'));
        $campania->setActivo($request->getParam('activo'));
        return $campania;
    }

}