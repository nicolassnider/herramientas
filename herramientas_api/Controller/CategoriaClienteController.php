<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 07/10/2018
 * Time: 4:17 PM
 */
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

class CategoriaClienteController
{

    private $app;

    public function __construct($app)
    {
        $this->app =$app;
    }
    public function init() {
        $this->app->group('/api', function () {
            $this->group('/categoriascliente', function () {
                $this->get('/select', function (Request $request, Response $response) {
                    $items = (new CategoriaClienteService())->getAllSorted();
                    array_walk($items, function(&$item) {
                        $item = new SelectOption($item->getId(), $item->getDescripcion());
                    });
                    return $response->withJson($items, 200);
                });

                $this->get('', function (Request $request, Response $response) {
                    $service = new CategoriaClienteService();
                    $items = $service->getAll();
                    return $response->withJson($items, 200);
                });

                $this->get('/{categoriacliente}', function(Request $request, Response $response) {
                    $id = $request->getAttribute('categoriacliente');
                    $service = new CategoriaClienteService();
                    $id = $service->get($id);
                    if ($id == null) {
                        return $response->withStatus(204);
                    }
                    return $response->withJson($id, 200);
                });

                $this->post('', function (Request $request, Response $response) {
                    $categoriaCliente = CategoriaClienteController::getInstanceFromRequest($request);
                    $service = new CategoriaClienteService();
                    $service->create($categoriaCliente);
                    return $response->withJson($categoriaCliente, 201);

                });

                $this->put('/{id}', function (Request $request, Response $response) {
                    $categoriaCliente = CategoriaClienteController::getInstanceFromRequest($request);
                    $service = new CategoriaClienteService();
                    $service->update($categoriaCliente);
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

    private static function getInstanceFromRequest(Request $request): ?CategoriaCliente
    {
        $categoriaCliente = new CategoriaCliente();
        $categoriaCliente->setId((int)$request->getAttribute('id'));
        $categoriaCliente->setDescripcion($request->getParam('descripcion'));
        return $categoriaCliente;
    }

}