<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 08/10/2018
 * Time: 12:28 AM
 */

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require_once "../Service/FacturaService.php";
require_once "../Model/Factura.php";
require_once "../Model/Campania.php";


class FacturaController
{
    private $app;

    public function __construct($app)
    {
        $this->app = $app;
    }

    public function init()
    {

        $this->app->group('/api', function () {
            $this->group('/facturas', function () {

                $this->get('/select', function (Request $request, Response $response) {
                    $service = new FacturaService();
                    $items = $service->getAllActiveSorted();
                    array_walk($items, function (&$item) {
                        $item = new SelectOption($item->getId(), $item->getPersona()->getNombre() . " " . $item->getPersona()->getApellido());
                    });
                    return $response->withJson($items, 200);
                });

                $this->get('', function (Request $request, Response $response) {
                    $service = new FacturaService();
                    $items = $service->getAll();
                    return $response->withJson($items, 200);

                });


                $this->get('/{id}', function (Request $request, Response $response) {
                    $service = new FacturaService();
                    $id = $request->getAttribute('id');
                    $items = $service->get($id);
                    if ($items == null) {
                        return $response->withJson($items, 400);
                    }
                    return $response->withJson($items, 200);
                });

                $this->put('/pagar/{id}', function (Request $request, Response $response) {
                    $service = new FacturaService();
                    $id = $request->getAttribute('id');
                    $service->pagar($id);
                    return $response->withJson("deactivated", 200);
                });


                $this->post('', function (Request $request, Response $response) {
                    $service = new FacturaService();
                    $factura = FacturaController::getInstanceFromRequest($request);
                    $service->create($factura);
                    return $response->withJson($factura, 201);

                });

                $this->put('/{id}', function (Request $request, Response $response) {
                    $service = new FacturaService();
                    $factura = FacturaController::getInstanceFromRequest($request);
                    $service->update($factura);
                    return $response->withJson("updated", 204);

                });

                $this->delete('/{id}', function (Request $request, Response $response) {
                    $service = new FacturaService();
                    $id = $request->getAttribute('id');
                    $service->delete($id);
                    return $response->withJson("deleted", 204);

                });


            });

        });

    }

    private static function getInstanceFromRequest(Request $request): Factura
    {
        $factura = new Factura();
        $factura->setId((int)$request->getAttribute('id'));
        $factura->setTotal((float)$request->getParam('total'));
        $factura->setFechaVencimiento(new DateTime($request->getParam('fechaVencimiento')['date']));
        $campania = new Campania();
        $campania->setId($request->getParam('campania')['id']);
        $factura->setCampania($campania);
        $factura->setPagado((bool)$request->getParam('pagado'));
        $factura->setNroFactura($request->getParam('nroFactura'));
        return $factura;
    }

}