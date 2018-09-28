<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 28/09/2018
 * Time: 7:36 AM
 */
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
require_once '../Service/RevendedoraService.php';

class RevendedoraController
{
    private $app;

    public function __construct($app) {
        $this->app = $app;
    }

    public function init() {
        $this->app->group('/api', function () {
            $this->group('/Revendedoras', function () {
                $this->get('', function (Request $request, Response $response) {
                    $revendedoraService = new RevendedoraService();
                    $revendedoras = $revendedoraService->getAll();
                    return $response->withJson($revendedoras, 200);
                })->add(new ValidatePermissionsMiddleware([
                    'REVENDEDORA_LISTAR'
                ]));
            });
        });
    }

}