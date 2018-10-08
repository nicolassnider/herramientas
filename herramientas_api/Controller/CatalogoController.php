<?php

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require_once "../Service/CatalogoService.php";
require_once "../Model/Catalogo.php";
require_once "../Model/CatalogoCampania.php";

class CatalogoController
{

    private $app;

    public function __construct($app)
    {
        $this->app = $app;
    }

    public function init()
    {
        $this->app->group('/api', function () {
            $this->group('/catalogos', function () {

                $this->get('/select', function (Request $request, Response $response) {

                    $items = (new CatalogoService())->getAllActiveSorted();

                    array_walk($items, function (&$item) {
                        $label = $item->getDescripcion();
                        $item = new SelectOption($item->getId(), $label);
                    });

                    return $response->withJson($items, 200);
                })->add(new ValidatePermissionsMiddleware([
                    'CATALOGO_LISTAR'
                ]));

                $this->get('', function (Request $request, Response $response) {
                    $catalogoService = new CatalogoService();
                    $catalogos = $catalogoService->getAll();
                    return $response->withJson($catalogos, 200);
                })->add(new ValidatePermissionsMiddleware([
                    'CATALOGO_LISTAR'
                ]));

                $this->get('/{id}', function (Request $request, Response $response) {
                    $catalogoService = new CatalogoService();
                    $id = $request->getAttribute('id');

                    return $response->withJson($catalogoService->get($id), 200);
                });

                $this->post('', function (Request $request, Response $response) {
                    $catalogo = CatalogoController::getInstanceFromRequest($request);
                    $service = new CatalogoService();
                    $service->create($catalogo);
                    return $response->withJson($catalogo, 201);

                });

                $this->put('', function (Request $request, Response $response) {
                    $catalogo = CatalogoController::getInstanceFromRequest($request);
                    $service = new CatalogoService();
                    $service->update($catalogo);
                    $response->withJson("updated", 201);

                });

                $this->delete('/{id}', function (Request $request, Response $response) {
                    $id = $request->getAttribute('id');
                    $service = new CatalogoService();
                    $service->delete($id);
                    $response->withJson("deleted", 201);

                });

                $this->put('/desactivar/{id}', function (Request $request, Response $response) {
                    $id=(int)$request->getAttribute('id');
                    $catalogoService = new CatalogoService();
                    $catalogoService->deactivate($id);
                    return $response->withJson("deactivated", 204);
                });

                $this->put('/activar/{id}', function (Request $request, Response $response) {
                    $id=(int)$request->getAttribute('id');
                    $catalogoService = new CatalogoService();
                    $catalogoService->activate($id);
                    return $response->withJson("activated", 204);
                });

                $this->post('/campania/{campania}', function (Request $request, Response $response) {

                    $catalogo= new Catalogo();
                    $campania= new Campania();
                    $catalogo->setId($request->getParam('catalogo')['id']);
                    $campania->setId((int)$request->getAttribute('campania'));
                    $catalogoCampania=new CatalogoCampania();
                    $catalogoCampania->setCatalogo($catalogo);
                    $catalogoCampania->setCampania($campania);
                    $service=new CatalogoService();
                    $service->createCatalogoByCampania($catalogoCampania);
                    return $response->withJson("created", 201);

                });


            });
        });
    }

    private static function getInstanceFromRequest(Request $request): Catalogo
    {
        $catalogo = new Catalogo();
        $catalogo->setId((int)$request->getAttribute('id'));
        $catalogo->setDescripcion($request->getParam('descripcion'));
        $catalogo->setObservaciones($request->getParam('observaciones'));
        $catalogo->setActivo($request->getParam('activo'));
        return $catalogo;
    }
}