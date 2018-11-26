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

    public function __construct($app)
    {
        $this->app = $app;
    }

    public function init()
    {
        $this->app->group('/api', function () {
            $this->group('/revendedoras', function () {

                $this->get('/deudores/archivo', function (Request $request, Response $response) {
                    $service = new RevendedoraService();
                    $archivo = $service->getRevendedorasMasDeudores();

                    $response->write($archivo->getContenido());
                    return $response->withHeader('Content-Type', $archivo->getTipo())
                        ->withHeader('Content-Disposition', 'attachment; filename="' . $archivo->getNombre() . '"');
                });

                $this->get('/select', function (Request $request, Response $response) {

                    $items = (new RevendedoraService())->getAllActiveSorted();

                    array_walk($items, function (&$item) {
                        $label = $item->getPersona()->getNombre() . ' ' . $item->getPersona()->getApellido() . ' (' . $item->getPersona()->getLocalidad()->getDescripcion() . ')';
                        $item = new SelectOption($item->getId(), $label);
                    });

                    return $response->withJson($items, 200);
                })->add(new ValidatePermissionsMiddleware([
                    'REVENDEDORA_LISTAR'
                ]));
                $this->get('', function (Request $request, Response $response) {
                    $revendedoraService = new RevendedoraService();
                    $revendedoras = $revendedoraService->getAll();
                    return $response->withJson($revendedoras, 200);
                })->add(new ValidatePermissionsMiddleware([
                    'REVENDEDORA_LISTAR'
                ]));
                $this->get('/{id}', function (Request $request, Response $response) {
                    $service = new RevendedoraService();
                    $id = $request->getAttribute('id');
                    $items = $service->get($id);
                    if ($items == null) {
                        return $response->withJson($items, 400);
                    }
                    return $response->withJson($items, 200);
                })->add(new ValidatePermissionsMiddleware([
                    'REVENDEDORA_VISUALIZAR'
                ]));

                $this->post('', function (Request $request, Response $response) {
                    $revendedora = RevendedoraController::getInstanceFromRequest($request);

                    $service = new RevendedoraService();
                    $service->create($revendedora);
                    return $response->withJson($revendedora, 201);

                })->add(new ValidatePermissionsMiddleware([
                    'REVENDEDORA_CREAR'
                ]));

                $this->put('/{id}', function (Request $request, Response $response) {
                    $revendedora = RevendedoraController::getInstanceFromRequest($request);
                    $revendedoraService = new RevendedoraService();
                    $revendedoraService->update($revendedora);
                    return $response->withJson("updated", 204);
                })->add(function ($request, $response, $next) {
                    return $next($request, $response);
                })->add(new ValidatePermissionsMiddleware([
                    'REVENDEDORA_MODIFICAR'
                ]));

                $this->delete('/{id}', function (Request $request, Response $response) {
                    $id = (int)$request->getAttribute('id');
                    $revendedoraService = new RevendedoraService();
                    $revendedoraService->delete($id);
                    return $response->withJson("deleted", 204);
                })->add(new ValidatePermissionsMiddleware([
                    'REVENDEDORA_ELIMINAR'
                ]));

                $this->put('/desactivar/{id}', function (Request $request, Response $response) {
                    $id = (int)$request->getAttribute('id');
                    $revendedoraService = new RevendedoraService();
                    $revendedoraService->deactivate($id);
                    return $response->withJson("deactivated", 204);
                })->add(new ValidatePermissionsMiddleware([
                    'REVENDEDORA_MODIFICAR'
                ]));

                $this->put('/activar/{id}', function (Request $request, Response $response) {
                    $id = (int)$request->getAttribute('id');
                    $revendedoraService = new RevendedoraService();
                    $revendedoraService->activate($id);
                    return $response->withJson("activated", 204);
                })->add(new ValidatePermissionsMiddleware([
                    'PERSONA_MODIFICAR'
                ]));
            });
        });
    }

    private static function getInstanceFromRequest(Request $request): Revendedora
    {
        $revendedora = new Revendedora();
        $revendedora->setId((int)$request->getAttribute('id'));
        $categoriaRevendedora = new CategoriaRevendedora();
        $categoriaRevendedora->setId((int)$request->getParam('categoriaRevendedora')['id']);
        $revendedora->setCategoriaRevendedora($categoriaRevendedora);
        $revendedora->setActivo((bool)$request->getParam('activo'));
        $persona = new Persona();
        $persona->setId((int)$request->getParam('persona')['id']);
        $revendedora->setPersona($persona);
        $usuario = new Usuario();
        $perfil = new Perfil();
        $perfil->setId((int)$request->getParam('perfil')['id']);
        $usuario->setPerfil($perfil);

        $revendedora->setUsuario($usuario);
        return $revendedora;

    }

}