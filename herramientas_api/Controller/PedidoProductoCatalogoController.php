<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 09/10/2018
 * Time: 12:46 PM
 */

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

require_once "../Service/PedidoProductoCatalogoService.php";
require_once "../Model/Producto.php";
require_once "../Model/Catalogo.php";
require_once "../Model/ProductoCatalogo.php";

class PedidoProductoCatalogoController
{
    private $app;

    public function __construct($app)
    {
        $this->app = $app;
    }


    public function init()
    {

        $this->app->group('/api', function () {
            $this->group('/pedidoproductocatalogo', function () {


                $this->get('/{id}', function (Request $request, Response $response) {
                    $service = new PedidoProductoCatalogoService();
                    $id = ((int)$request->getAttribute('id'));
                    $items = $service->getAllCatalogosPorProducto($id);
                    return $response->withJson($items, 200);
                });

                $this->post('', function (Request $request, Response $response) {
                    $service = new PedidoProductoCatalogoService();
                    $pedidoProductoCatalogo = PedidoProductoCatalogoController::getInstanceFromRequest($request);
                    $service->create($pedidoProductoCatalogo);
                    return $response->withJson($pedidoProductoCatalogo, 201);
                });

                $this->get('/pedido/{id}', function (Request $request, Response $response) {
                    $service = new PedidoProductoCatalogoService();
                    $id = ((int)$request->getAttribute('id'));
                    $items = $service->getAllProductosPorPedido($id);
                    return $response->withJson($items, 200);
                });

                $this->put('/{id}', function (Request $request, Response $response) {
                    $pedidoProductoCatalogo = PedidoProductoCatalogoController::getInstanceFromRequest($request);
                    $pedidoProductoCatalogoService = new PedidoProductoCatalogoService();
                    $pedidoProductoCatalogoService->update($pedidoProductoCatalogo);
                    return $response->withJson("updated", 204);
                });


            });

        });

    }

    private static function getInstanceFromRequest(Request $request): PedidoProductoCatalogo
    {
        $pedidoProductoCatalogo = new PedidoProductoCatalogo;
        $pedidoProductoCatalogo->setId((int)$request->getAttribute('id'));
        $producto = new Producto();
        $producto->setId((int)$request->getParam('producto')['id']);
        $pedidoProductoCatalogo->setProducto($producto);
        $catalogo = new Catalogo();
        $catalogo->setId((int)$request->getParam('catalogo')['id']);
        $pedidoProductoCatalogo->setCatalogo($catalogo);
        $pedidoProductoCatalogo->setActivo((bool)$request->getParam('activo'));
        $pedidoProductoCatalogo->setPrecio((float)$request->getParam('precio'));
        return $pedidoProductoCatalogo;
    }

}