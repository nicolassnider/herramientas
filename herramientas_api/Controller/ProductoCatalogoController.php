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


            });

        });

    }

}