<?php

/**
 * Created by Nicolás Snider
 * Date: 01/07/2018
 * Time: 12:43 AM
 */
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require_once '../Service/TipoDocumentoService.php';
require_once '../Model/TipoDocumento.php';
require_once '../Model/Select/SelectOption.php';

class TipoDocumentoController {
    private $app;

    public function __construct($app) {
        $this->app = $app;
    }

    public function init() {
        $this->app->group('/api', function () {
            $this->group('/tipos-documento', function () {
                $this->get('/select', function (Request $request, Response $response) {
                    $items = (new TipoDocumentoService())->getAllSorted();
                    array_walk($items, function(&$item) {
                        $item = new SelectOption($item->getId(), $item->getDescripcion());
                    });
                    return $response->withJson($items, 200);
                });
                $this->get('/{id}', function (Request $request, Response $response) {
                    $id = $request->getAttribute('id');
                    $service = new TipoDocumentoService();
                    $tipoDocumento = $service->get($id);

                    if ($tipoDocumento == null) {
                        return $response->withStatus(204);
                    }
                    return $response->withJson($tipoDocumento, 200);
                })->add(new ValidatePermissionsMiddleware([
                    'PERSONA_VISUALIZAR'
                ]));
            });
        });
    }
}