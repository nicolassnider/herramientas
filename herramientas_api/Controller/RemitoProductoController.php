<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 09/10/2018
 * Time: 12:46 PM
 */

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

require_once "../Service/RemitoProductoService.php";
require_once "../Model/Producto.php";
require_once "../Model/Catalogo.php";
require_once "../Model/ProductoCatalogo.php";
require_once "../Commons/Exceptions/BadRequestException.php";

class RemitoProductoController
{
    private $app;

    public function __construct($app)
    {
        $this->app = $app;
    }


    public function init()
    {

        $this->app->group('/api', function () {
            $this->group('/remitoproducto', function () {


                $this->get('/remito/archivo/{id}', function (Request $request, Response $response) {
                    $remitoId = (int)$request->getAttribute('id');
                    $service = new RemitoProductoService();

                    $archivo = $service->getCsvFile($remitoId);


                    $response->write($archivo->getContenido());
                    return $response->withHeader('Content-Type', $archivo->getTipo())
                        ->withHeader('Content-Disposition', 'attachment; filename="' . $archivo->getNombre() . '"');
                });

                $this->get('/{id}', function (Request $request, Response $response) {
                    $service = new RemitoProductoService();
                    $id = ((int)$request->getAttribute('id'));
                    $items = $service->getAllProductosPorPedido($id);
                    return $response->withJson($items, 200);
                });

                $this->get('/remito/{id}', function (Request $request, Response $response) {
                    $service = new RemitoProductoService();
                    $id = ((int)$request->getAttribute('id'));
                    $items = $service->getAllRemitoProductoPorRemito($id);
                    return $response->withJson($items, 200);
                });

                $this->post('', function (Request $request, Response $response) {
                    $service = new RemitoProductoService();
                    $remitoPRoducto = RemitoProductoController::getInstanceFromRequest($request);
                    $service->create($remitoPRoducto);
                    return $response->withJson($remitoPRoducto, 201);
                });

                $this->get('/pedido/{id}', function (Request $request, Response $response) {
                    $service = new RemitoProductoService();
                    $id = ((int)$request->getAttribute('id'));
                    $items = $service->getAllProductosPorPedido($id);
                    return $response->withJson($items, 200);
                });

                $this->put('/{id}', function (Request $request, Response $response) {
                    $remitoPRoducto = RemitoProductoController::getInstanceFromRequest($request);
                    $RemitoProductoService = new RemitoProductoService();
                    $RemitoProductoService->update($remitoPRoducto);
                    return $response->withJson("updated", 204);
                });

                $this->put('/recibir/{id}', function (Request $request, Response $response) {
                    $id = ((int)$request->getAttribute('id'));
                    $service = new RemitoProductoService();
                    $service->recibir($id);
                    return $response->withJson("updated", 204);
                });

                $this->delete('/{id}', function (Request $request, Response $response) {
                    $id = (int)$request->getAttribute('id');
                    $service = new RemitoProductoService();
                    $service->delete($id);
                    return $response->withJson("deleted", 204);
                });

                $this->get('/comparar/compararpedidoremito', function (Request $request, Response $response) {
                    $service = new RemitoProductoService();

                    $service->compararPedidoRemito();


                    array_push($campanias, $campania);
                    return $response->withJson($campania, 200);

                });


            });

        });

    }

    private static function getInstanceFromRequest(Request $request): RemitoProducto
    {
        $remitoProducto = new RemitoProducto;
        $remitoProducto->setId((int)$request->getAttribute('id'));
        $remito = new Remito();
        $remito->setId((int)$request->getParam('remito')['id']);
        $remitoProducto->setRemito($remito);
        $producto = new Producto;
        $producto->setId((int)$request->getParam('producto')['id']);
        $remitoProducto->setProducto($producto);
        $remitoProducto->setCantidad((int)$request->getParam('cantidad'));


        return $remitoProducto;
    }

}