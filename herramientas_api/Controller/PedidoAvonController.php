<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 08/10/2018
 * Time: 9:09 PM
 */

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require_once "../Service/PedidoAvonService.php";

class PedidoAvonController
{
    private $app;

    public function __construct($app)
    {
        $this->app = $app;
    }

    public function init()
    {

        $this->app->group('/api', function () {
            $this->group('/pedidos_avon', function () {

                $this->get('', function (Request $request, Response $response) {
                    $service = new PedidoAvonService();
                    $items = $service->getAll();
                    return $response->withJson($items, 200);
                });

                $this->get('/{id}', function (Request $request, Response $response) {
                    $service = new PedidoAvonService();
                    $id = $request->getAttribute('id');
                    $items = $service->get($id);
                    if ($items == null) {
                        return $response->withJson($items, 400);
                    }
                    return $response->withJson($items, 200);
                });

                $this->get('/pedido/campania/{id}', function (Request $request, Response $response) {
                    $service = new PedidoAvonService();
                    $id = $request->getAttribute('id');
                    $items = $service->getPedidoPorCampania($id);
                    if ($items == null) {
                        return $response->withJson($items, 400);
                    }
                    return $response->withJson($items, 200);
                });

                $this->get('/campania/pedido', function (Request $request, Response $response) {
                    $service = new PedidoAvonService();
                    $items = $service->getPedidoPorCampaniaActual();
                    if ($items == null) {
                        return $response->withJson($items, 400);
                    }
                    return $response->withJson($items, 200);
                });

                $this->put('/recibir/{id}', function (Request $request, Response $response) {
                    $service = new PedidoAvonService();
                    $id = $request->getAttribute('id');
                    $service->recibir($id);
                    return $response->withJson("recibido", 200);
                });
                $this->put('/recibir/check/{id}', function (Request $request, Response $response) {
                    $service = new PedidoAvonService();
                    $id = $request->getAttribute('id');
                    $service->checkRecibido($id);
                    return $response->withJson("recibido", 200);
                });
                $this->put('/entregar/{id}', function (Request $request, Response $response) {
                    $service = new PedidoAvonService();
                    $id = $request->getAttribute('id');
                    $service->entregar($id);
                    return $response->withJson("entregadototal", 200);
                });
                $this->put('/entregar/check/{id}', function (Request $request, Response $response) {
                    $service = new PedidoAvonService();
                    $id = $request->getAttribute('id');
                    $service->checkEntregado($id);
                    return $response->withJson("entregadototal", 200);
                });
                $this->put('/cobrar/{id}', function (Request $request, Response $response) {
                    $service = new PedidoAvonService();
                    $id = $request->getAttribute('id');
                    $service->cobrar($id);
                    return $response->withJson("entregado", 200);
                });
                $this->put('/cobrar/check/{id}', function (Request $request, Response $response) {
                    $service = new PedidoAvonService();
                    $id = $request->getAttribute('id');
                    $service->checkCobrado($id);
                    return $response->withJson("cobradototal", 200);
                });


                $this->post('', function (Request $request, Response $response) {
                    $service = new PedidoAvonService();
                    $cliente = PedidoAvonController::getInstanceFromRequest($request);
                    $service->create($cliente);
                    return $response->withJson($cliente, 201);

                });

                $this->put('/{id}', function (Request $request, Response $response) {
                    $service = new PedidoAvonService();
                    $cliente = PedidoAvonController::getInstanceFromRequest($request);
                    $service->update($cliente);
                    return $response->withJson("updated", 204);

                });

                $this->delete('/{id}', function (Request $request, Response $response) {
                    $service = new PedidoAvonService();
                    $id = $request->getAttribute('id');
                    $service->delete($id);
                    return $response->withJson("deleted", 204);

                });

                $this->post('/pedido/csv', function (Request $request, Response $response) {
                    $uploadedFiles = $request->getUploadedFiles();
                    die(print_r($uploadedFiles));
                    $uploadedFile = $uploadedFiles['file'];


                    $service = new PedidoAvonService();


                    /*if ($uploadedFile->getError() === UPLOAD_ERR_OK) {

                        $filename = $service->saveFile($uploadedFile);
                        return $response->withJson([
                            'pedido' => $filename
                        ], 200);
                    }*/
                });


            });

        });

    }

    private static function getInstanceFromRequest(Request $request): PedidoAvon
    {
        $pedidoAvon = new PedidoAvon();
        $pedidoAvon->setId((int)$request->getAttribute('id'));
        $pedidoAvon->setFechaRecibido(new DateTime($request->getParam('fechaRecibido')['date']));
        $pedidoAvon->setRecibido((bool)$request->getParam('recibido'));
        $pedidoAvon->setEntregado((bool)$request->getParam('entregado'));
        $pedidoAvon->setCobrado((bool)$request->getParam('cobrado'));
        $campania = new Campania();
        $campania->setId((int)$request->getParam('campania')['id']);
        $pedidoAvon->setCampania($campania);

        return $pedidoAvon;
    }

}