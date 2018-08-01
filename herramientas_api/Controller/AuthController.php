<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use Respect\Validation\Validator as v;

require_once '../Service/AuthService.php';
require_once '../Model/Usuario.php';

class AuthController {
    private $app;

    public function __construct($app) {
        $this->app = $app;
    }

    public function init() {
        $this->app->group('/api', function() {
            $this->group('/public', function() {
                $this->post('/auth/login', function(Request $request, Response $response) {
                    $usuario = $request->getParam('usuario');
                    $clave = $request->getParam('clave');

                    $service = new AuthService();
                    $persona = $service->authenticate($usuario, $clave);

                    if($persona != null) {
                        return $response->withStatus(200)
                        ->withHeader('Content-Type', 'application/json')
                        ->write(json_encode($persona));
                    } else {
                        return $response->withStatus(401)
                        ->withHeader('Content-Type', 'application/json')
                        ->write(json_encode(new ApiError(
                            4000,
                            ['Acceso denegado.']
                        )));
                    }
                });                
            });

            $this->get('/auth/check', function(Request $request, Response $response) {
            });

            $this->post('/auth/logout', function(Request $request, Response $response) {
                $token = $request->getHeader('Authorization-Token')[0];
                (new AuthService())->revokeToken($token);
            });
        });
    }
}