<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 29/09/2018
 * Time: 11:17 AM
 */
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require_once '../Service/CategoriaRevendedoraService.php';
require_once '../Model/CategoriaRevendedora.php';

class CategoriaRevendedoraController
{

    private $app;

    public function __construct($app)
    {
        $this->app =$app;
    }
    public function init() {
        $this->app->group('/api', function () {
            $this->group('/categoriasrevendedora', function () {
                $this->get('/select', function (Request $request, Response $response) {
                    $items = (new CategoriaRevendedoraService())->getAllSorted();
                    array_walk($items, function(&$item) {
                        $item = new SelectOption($item->getId(), $item->getDescripcion());
                    });
                    return $response->withJson($items, 200);
                })->add(new ValidatePermissionsMiddleware([
                    'REVENDEDORA_CREAR',
                    'REVENDEDORA_ELIMINAR',
                    'REVENDEDORA_LISTAR',
                    'REVENDEDORA_MODIFICAR',
                    'REVENDEDORA_VISUALIZAR'
                ]));

                $this->get('', function (Request $request, Response $response) {
                    $service = new CategoriaRevendedoraService();
                    $items = $service->getAll();
                    return $response->withJson($items, 200);
                });

                $this->get('/{categoriarevendedora}', function(Request $request, Response $response) {
                    $id = $request->getAttribute('categoriarevendedora');
                    $service = new CategoriaRevendedoraService();
                    $id = $service->get($id);
                    if ($id == null) {
                        return $response->withStatus(204);
                    }
                    return $response->withJson($id, 200);
                });

                $this->post('', function (Request $request, Response $response) {
                    $categoriaRevendedora = CategoriaRevendedoraController::getInstanceFromRequest($request);
                    $service = new CategoriaRevendedoraService();
                    $service->create($categoriaRevendedora);
                    return $response->withJson($categoriaRevendedora, 201);

                })->add(new ValidatePermissionsMiddleware([
                    'CATEGORIA_REVENDEDORA_CREAR'
                ]));

                $this->put('/{id}', function (Request $request, Response $response) {
                    $categoriaRevendedora = CategoriaRevendedoraController::getInstanceFromRequest($request);
                    $service = new CategoriaRevendedoraService();
                    $service->update($categoriaRevendedora);
                    return $response->withJson("updated", 204);

                })->add(new ValidatePermissionsMiddleware([
                    'CATEGORIA_REVENDEDORA_MODIFICAR'
                ]));

                $this->delete('/{id}', function (Request $request, Response $response) {
                    $id = $request->getAttribute('id');
                    $service = new CategoriaRevendedoraService();
                    $service->delete($id);
                    return $response->withJson($id, 204);

                })->add(new ValidatePermissionsMiddleware([
                    'CATEGORIA_REVENDEDORA_ELIMINAR'
                ]));

            });
        });
    }

    private static function getInstanceFromRequest(Request $request): ?CategoriaRevendedora
    {
        $categoriaRevendedora = new CategoriaRevendedora();
        $categoriaRevendedora->setId((int)$request->getAttribute('id'));
        $categoriaRevendedora->setDescripcion($request->getParam('descripcion'));
        return $categoriaRevendedora;
    }

}