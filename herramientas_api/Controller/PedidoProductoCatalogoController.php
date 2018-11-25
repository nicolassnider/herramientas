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
require_once "../Commons/Exceptions/BadRequestException.php";

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


                $this->get('/pedido/archivo/{id}', function (Request $request, Response $response) {
                    $pedidoId = (int)$request->getAttribute('id');
                    $service = new PedidoProductoCatalogoService();

                    $archivo = $service->getCsvFile($pedidoId);


                    $response->write($archivo->getContenido());
                    return $response->withHeader('Content-Type', $archivo->getTipo())
                        ->withHeader('Content-Disposition', 'attachment; filename="' . $archivo->getNombre() . '"');
                });

                $this->get('/getporid/{id}', function (Request $request, Response $response) {
                    $service = new PedidoProductoCatalogoService();
                    $id = ((int)$request->getAttribute('id'));
                    $items = $service->get($id);
                    return $response->withJson($items, 200);
                });


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

                $this->put('/saldar/{id}', function (Request $request, Response $response) {
                    $id = (int)$request->getAttribute('id');

                    $saldo = (int)$request->getParam('saldo');
                    $pedidoProductoCatalogoService = new PedidoProductoCatalogoService();
                    $pedidoProductoCatalogoService->saldar($id, $saldo);
                    return $response->withJson("updated", 204);
                });

                $this->put('/cobrar/{id}', function (Request $request, Response $response) {
                    $id = (int)$request->getAttribute('id');
                    $pedidoProductoCatalogoService = new PedidoProductoCatalogoService();
                    $pedidoProductoCatalogoService->cobrar($id);
                    return $response->withJson("updated", 204);
                });

                $this->put('/entregar/{id}', function (Request $request, Response $response) {
                    $id = (int)$request->getAttribute('id');
                    $pedidoProductoCatalogoService = new PedidoProductoCatalogoService();
                    $pedidoProductoCatalogoService->entregar($id);
                    return $response->withJson("updated", 204);
                });

                $this->delete('/{id}', function (Request $request, Response $response) {
                    $id = (int)$request->getAttribute('id');
                    $service = new PedidoProductoCatalogoService();
                    $service->delete($id);
                    return $response->withJson("deleted", 204);
                });

                $this->get('/checkcampaniaactiva/{id}', function (Request $request, Response $response) {
                    $service = new PedidoProductoCatalogoService();
                    $id = ((int)$request->getAttribute('id'));
                    $campania = new Campania();

                    $check = $service->checkCampaniaPedidoProductoCatalogo($id);

                    $campania->setActivo($check);
                    array_push($campanias, $campania);
                    return $response->withJson($campania, 200);

                });



            });

        });

    }

    private static function getInstanceFromRequest(Request $request): PedidoProductoCatalogo
    {
        $pedidoProductoCatalogo = new PedidoProductoCatalogo;
        $pedidoProductoCatalogo->setId((int)$request->getAttribute('id'));
        $productoCatalogo = new ProductoCatalogo();
        $productoCatalogo->setId((int)$request->getParam('productoCatalogo')['id']);
        $pedidoProductoCatalogo->setProductoCatalogo($productoCatalogo);
        $pedidoAvon = new PedidoAvon();
        $pedidoAvon->setId((int)$request->getParam('pedidoAvon')['id']);
        $pedidoProductoCatalogo->setPedidoAvon($pedidoAvon);
        $pedidoProductoCatalogo->setProductoCatalogo($productoCatalogo);
        $pedidoProductoCatalogo->setCantidad((int)$request->getParam('cantidad'));
        $cliente = new Cliente();
        $request->getParam('cliente') ? $cliente->setId((int)$request->getParam('cliente')['id']) : $cliente = null;
        $pedidoProductoCatalogo->setCliente($cliente);
        $revendedora = new Revendedora();
        $request->getParam('revendedora') ? $revendedora->setId((int)$request->getParam('revendedora')['id']) : $cliente = null;
        $pedidoProductoCatalogo->setRevendedora($revendedora);

        return $pedidoProductoCatalogo;
    }

}