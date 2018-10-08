<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 07/10/2018
 * Time: 7:33 PM
 */

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require_once "../Service/ClienteService.php";
require_once "../Model/Cliente.php";


class ClienteController
{
    private $app;

    public function __construct($app)
    {
        $this->app = $app;
    }

    public function init()
    {

        $this->app->group('/api', function () {
            $this->group('/clientes', function () {

                $this->get('/select', function (Request $request, Response $response) {
                    $service = new ClienteService();
                    $items = $service->getAllActiveSorted();
                    array_walk($items, function (&$item) {
                        $item = new SelectOption($item->getId(), $item->getPersona()->getNombre() . " " . $item->getPersona()->getApellido());
                    });
                    return $response->withJson($items, 200);
                });

                $this->get('', function (Request $request, Response $response) {
                    $service = new ClienteService();
                    $items = $service->getAll();
                    return $response->withJson($items, 200);

                });


                $this->get('/{id}', function (Request $request, Response $response) {
                    $service = new ClienteService();
                    $id = $request->getAttribute('id');
                    $items = $service->get($id);
                    if ($items == null) {
                        return $response->withJson($items, 400);
                    }
                    return $response->withJson($items, 200);
                });

                $this->put('/desactivar/{id}', function (Request $request, Response $response) {
                    $service = new ClienteService();
                    $id = $request->getAttribute('id');
                    $service->deactivate($id);
                    return $response->withJson("deactivated", 200);
                });
                $this->put('/activar/{id}', function (Request $request, Response $response) {
                    $service = new ClienteService();
                    $id = $request->getAttribute('id');
                    $service->activate($id);
                    return $response->withJson("activated", 200);
                });

                $this->post('', function (Request $request, Response $response) {
                    $service = new ClienteService();
                    $cliente = ClienteController::getInstanceFromRequest($request);
                    $service->create($cliente);
                    return $response->withJson($cliente, 201);

                });

                $this->put('/{id}', function (Request $request, Response $response) {
                    $service = new ClienteService();
                    $cliente = ClienteController::getInstanceFromRequest($request);
                    $service->update($cliente);
                    return $response->withJson("updated", 204);

                });

                $this->delete('/{id}', function (Request $request, Response $response) {
                    $service = new ClienteService();
                    $id = $request->getAttribute('id');
                    $service->delete($id);
                    return $response->withJson("deleted", 204);

                });


            });

        });

    }

    private static function getInstanceFromRequest(Request $request): Cliente
    {
        $cliente = new Cliente();
        $cliente->setId((int)$request->getAttribute('id'));
        $categoriaCliente = new CategoriaCliente();
        $categoriaCliente->setId((int)$request->getParam('categoriaCliente')['id']);
        $cliente->setCategoriaCliente($categoriaCliente);
        $cliente->setDireccionEntrega($request->getParam('direccionEntrega'));
        $cliente->setUbicacion($request->getParam('ubicacion'));
        $cliente->setAnioNacimiento(new DateTime($request->getParam('anioNacimiento')['date']));
        $cliente->setMadre((bool)$request->getParam('madre'));
        $cliente->setApodo($request->getParam('apodo'));
        $persona = new Persona();
        $persona->setId((int)$request->getParam('persona')['id']);
        $cliente->setPersona($persona);
        $cliente->setActivo($request->getParam('activo'));
        $revendedora = new Revendedora();
        $revendedora->setId((int)$request->getParam('revendedora')['id']);
        $cliente->setRevendedora($revendedora);


        return $cliente;
    }

}