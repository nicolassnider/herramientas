<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require_once '../Model/Usuario.php';
require_once '../Service/UsuariosService.php';

class UsuarioController{
    private $app;

    public function __construct($app)
    {
        $this->app = $app;
    }

    public function init()
    {
        $this->app->group('/api', function () {
            $this->group('/usuarios', function () {


                $this->get('', function (Request $request, Response $response) {
                    $service = new UsuariosService();
                    $usuarios = $service->getAll();
                    return $response->withJson($usuarios, 200);
                });
                $this->get('/{id}', function (Request $request, Response $response) {
                    $service = new UsuariosService();
                    $id = $request->getAttribute('id');
                    $items = $service->get($id);
                    if ($items == null) {
                        return $response->withJson($items, 400);
                    }
                    return $response->withJson($items, 200);
                });

                $this->put('/{id}', function (Request $request, Response $response) {
                    $usuario = UsuarioController::getInstanceFromRequest($request);
                    $usuarioService = new UsuariosService();
                    $usuarioService->update($usuario);
                    return $response->withJson("updated", 204);
                });


            });
        });
    }

    private static function getInstanceFromRequest(Request $request): Usuario
    {
        $usuario = new Usuario();
        $usuario->setId((int)$request->getAttribute('id'));
        $perfil = new Perfil();
        $perfil->setId($request->getParam('perfil')['id']);
        $usuario->setPerfil($perfil);
        $usuario->setClave($request->getParam('clave'));

        return $usuario;

    }

}