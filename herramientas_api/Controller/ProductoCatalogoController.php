<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 09/10/2018
 * Time: 12:46 PM
 */

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

require_once "../Service/ProductoCatalogoService.php";
require_once "../Model/Producto.php";
require_once "../Model/Catalogo.php";
require_once "../Model/ProductoCatalogo.php";

class ProductoCatalogoController
{
    private $app;

    public function __construct($app)
    {
        $this->app = $app;
    }


    public function init()
    {

        $this->app->group('/api', function () {
            $this->group('/productocatalogos', function () {


                $this->get('/catalogosporproducto/{id}', function (Request $request, Response $response) {
                    $service = new ProductoCatalogoService();
                    $id = ((int)$request->getAttribute('id'));
                    $items = $service->getAllCatalogosPorProducto($id);
                    return $response->withJson($items, 200);
                });

                $this->post('', function (Request $request, Response $response) {
                    $service = new ProductoCatalogoService();
                    $productoCatalogo = ProductoCatalogoController::getInstanceFromRequest($request);
                    $service->create($productoCatalogo);
                    return $response->withJson($productoCatalogo, 201);
                });

                $this->get('/select', function (Request $request, Response $response) {

                    $items = (new ProductoCatalogoService())->getAllActiveSorted();

                    array_walk($items, function (&$item) {
                        $label = $item->getProducto()->getDescripcion() . ' (' . $item->getCatalogo()->getDescripcion() . ')';
                        $item = new SelectOption($item->getId(), $label);
                    });

                    return $response->withJson($items, 200);
                });


            });

        });

    }

    private static function getInstanceFromRequest(Request $request): ProductoCatalogo
    {
        $productoCatalogo = new ProductoCatalogo;
        $productoCatalogo->setId((int)$request->getAttribute('id'));
        $producto = new Producto();
        $producto->setId((int)$request->getParam('producto')['id']);
        $productoCatalogo->setProducto($producto);
        $catalogo = new Catalogo();
        $catalogo->setId((int)$request->getParam('catalogo')['id']);
        $productoCatalogo->setCatalogo($catalogo);
        $productoCatalogo->setActivo((bool)$request->getParam('activo'));
        $productoCatalogo->setPrecio((float)$request->getParam('precio'));
        return $productoCatalogo;
    }

}