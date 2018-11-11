<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 09/10/2018
 * Time: 12:46 PM
 */

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

require_once "../Service/ProductoService.php";
require_once "../Model/Producto.php";

class ProductoController
{
    private $app;

    public function __construct($app)
    {
        $this->app = $app;
    }

    public function init()
    {

        $this->app->group('/api', function () {
            $this->group('/productos', function () {

                $this->get('/select', function (Request $request, Response $response) {
                    $service = new ProductoService();
                    $items = $service->getAllActiveSorted();
                    array_walk($items, function (&$item) {
                        $item = new SelectOption($item->getId(), $item->getDescripcion() . " [" . $item->getCategoria()->GetDescripcion() . "]");
                    });
                    return $response->withJson($items, 200);
                });

                $this->get('', function (Request $request, Response $response) {
                    $service = new ProductoService();
                    $items = $service->getAll();
                    return $response->withJson($items, 200);

                });


                $this->get('/{id}', function (Request $request, Response $response) {
                    $service = new ProductoService();
                    $id = $request->getAttribute('id');
                    $item = $service->get($id);
                    if ($item == null) {
                        return $response->withJson($item, 400);
                    }
                    return $response->withJson($item, 200);
                });
                

                $this->post('', function (Request $request, Response $response) {
                    $service = new ProductoService();
                    $cliente = ProductoController::getInstanceFromRequest($request);
                    $service->create($cliente);
                    return $response->withJson($cliente, 201);

                });

                $this->put('/{id}', function (Request $request, Response $response) {
                    $service = new ProductoService();
                    $cliente = ProductoController::getInstanceFromRequest($request);
                    $service->update($cliente);
                    return $response->withJson("updated", 204);

                });

                $this->delete('/{id}', function (Request $request, Response $response) {
                    $service = new ProductoService();
                    $id = $request->getAttribute('id');
                    $service->delete($id);
                    return $response->withJson("deleted", 204);

                });


            });

        });

    }

    private static function getInstanceFromRequest(Request $request): Producto
    {
        $cliente = new Producto();
        $cliente->setId((int)$request->getAttribute('id'));
        $cliente->setDescripcion($request->getParam('descripcion'));
        $categoria = new CategoriaProducto();
        $categoria->setId((int)$request->getParam('categoria')['id']);
        $cliente->setCategoria($categoria);
        $unidad = new Unidad();
        $unidad->setId((int)$request->getParam('unidad')['id']);
        $cliente->setUnidad($unidad);
        return $cliente;
    }

}