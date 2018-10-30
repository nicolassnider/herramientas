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


            });
        });
    }

    private static function getInstanceFromRequest(Request $request): Usuario
    {
        $revendedora = new Revendedora();
        $revendedora->setId((int)$request->getAttribute('id'));
        $categoriaRevendedora = new CategoriaRevendedora();
        $categoriaRevendedora->setId($request->getParam('categoriaRevendedora')['id']);
        $revendedora->setCategoriaRevendedora($categoriaRevendedora);
        $revendedora->setActivo((bool)$request->getParam('activo'));
        $persona = new Persona();
        $persona->setId((int)$request->getParam('persona')['id']);
        $revendedora->setPersona($persona);
        $usuario = new Usuario();
        $perfil = new Perfil();
        $perfil->setId($request->getParam('usuario')['perfil']['id']);
        $usuario->setPerfil($perfil);
        $revendedora->setUsuario($usuario);

        return $revendedora;

    }

}