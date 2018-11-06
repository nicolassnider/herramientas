<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 08/10/2018
 * Time: 12:28 AM
 */

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require_once "../Service/RemitoService.php";
require_once "../Model/Remito.php";
require_once "../Model/Factura.php.php";


class RemitoController
{
    private $app;

    public function __construct($app)
    {
        $this->app = $app;
    }

    public function init()
    {

        $this->app->group('/api', function () {
            $this->group('/remitos', function () {


                $this->post('', function (Request $request, Response $response) {
                    $service = new RemitoService();
                    $remito = RemitoController::getInstanceFromRequest($request);
                    $service->create($remito);
                    return $response->withJson($remito, 201);

                });

                $this->get('/{id}', function (Request $request, Response $response) {
                    $service = new RemitoService();
                    $id = $request->getAttribute('id');
                    $items = $service->get($id);
                    if ($items == null) {
                        return $response->withJson($items, 400);
                    }
                    return $response->withJson($items, 200);
                });


            });

        });

    }

    private static function getInstanceFromRequest(Request $request): Remito
    {
        $remito = new Remito();
        $remito->setId((int)$request->getAttribute('id'));
        $factura = new Factura;
        $factura->setId($request->getParam('factura')['id']);
        $remito->setNumeroRemito($request->getParam('numeroRemito'));

        return $remito;
    }

}