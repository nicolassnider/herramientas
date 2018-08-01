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

class TipoDocumentoController {
    private $app;

    public function __construct($app) {
        $this->app = $app;
    }

    public function init() {
        $this->app->group('/api', function () {
            $this->group('/tipos-documento/select', function () {
                $this->get('', function (Request $request, Response $response) {
                    $items = (new TipoDocumentoService())->getAllSorted();
                    array_walk($items, function(&$item) {
                        $item = new SelectOption($item->getId(), $item->getNombre());
                    });
                    return $response->withJson($items, 200);
                });
            });
        });
    }
}