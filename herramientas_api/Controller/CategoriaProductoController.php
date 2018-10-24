<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 09/10/2018
 * Time: 8:10 AM
 */

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

require_once '../Service/CategoriaProductoService.php';
class CategoriaProductoController
{

    private $app;

    public function __construct($app)
    {
        $this->app =$app;
    }
    public function init() {
        $this->app->group('/api', function () {
            $this->group('/categoriasproducto', function () {
                $this->get('/select', function (Request $request, Response $response) {
                    $items = (new CategoriaProductoService())->getAllSorted();
                    array_walk($items, function(&$item) {
                        $item = new SelectOption($item->getId(), $item->getDescripcion());
                    });
                    return $response->withJson($items, 200);
                });

                $this->get('', function (Request $request, Response $response) {
                    $service = new CategoriaProductoService();
                    $items = $service->getAll();
                    return $response->withJson($items, 200);
                });

                $this->get('/{categoriaproducto}', function (Request $request, Response $response) {
                    $id = $request->getAttribute('categoriacliente');
                    $service = new CategoriaProductoService();
                    $id = $service->get($id);
                    if ($id == null) {
                        return $response->withStatus(204);
                    }
                    return $response->withJson($id, 200);
                });

                $this->post('', function (Request $request, Response $response) {
                    $categoriaProducto = CategoriaProductoController::getInstanceFromRequest($request);
                    $service = new CategoriaProductoService();
                    $service->create($categoriaProducto);
                    return $response->withJson($categoriaProducto, 201);

                });

                $this->put('/{id}', function (Request $request, Response $response) {
                    $categoriaProducto = CategoriaProductoController::getInstanceFromRequest($request);
                    $service = new CategoriaProductoService();
                    $service->update($categoriaProducto);
                    return $response->withJson("updated", 204);

                });

                $this->delete('/{id}', function (Request $request, Response $response) {
                    $id = $request->getAttribute('id');
                    $service = new CategoriaRevendedoraService();
                    $service->delete($id);
                    return $response->withJson($id, 204);

                });

            });
        });
    }

    private static function getInstanceFromRequest(Request $request): ?CategoriaProducto
    {
        $categoriaProducto = new CategoriaProducto();
        $categoriaProducto->setId((int)$request->getAttribute('id'));
        $categoriaProducto->setDescripcion($request->getParam('descripcion'));
        return $categoriaProducto;
    }

}