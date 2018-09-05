<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

class MockController
{

    private $app;

    public function __construct($app)
    {
        $this->app = $app;
    }

    public function init()
    {
        $this->app->group('/api', function () {
            $this->group('/mock-comentarios', function () {
                $this->get('', function (Request $request, Response $response) {
                  $url = '../Commons/JsonMocks/comentarios.json';
                  $data = file_get_contents($url);
                  return $data;
                });
            });
            $this->group('/mock-ticket-history', function () {
                $this->get('', function (Request $request, Response $response) {
                  $url = '../Commons/JsonMocks/ticketHistory.json';
                  $data = file_get_contents($url);
                  return $data;
                });
            });
            $this->group('/mock-otros-tickets', function () {
                $this->get('', function (Request $request, Response $response) {
                  $url = '../Commons/JsonMocks/otrosTickets.json';
                  $data = file_get_contents($url);
                  return $data;
                });
            });
            $this->group('/mock-tareas', function () {
                $this->get('', function (Request $request, Response $response) {
                  $url = '../Commons/JsonMocks/tareas.json';
                  $data = file_get_contents($url);
                  return $data;
                });
            });
            $this->group('/mock-talleres', function () {
                $this->get('', function (Request $request, Response $response) {
                  $url = '../Commons/JsonMocks/talleresSelect.json';
                  $data = file_get_contents($url);
                  return $data;
                });
            });
            $this->group('/mock-vencimientos', function () {
                $this->get('', function (Request $request, Response $response) {
                  $url = '../Commons/JsonMocks/vencimientos.json';
                  $data = file_get_contents($url);
                  return $data;
                });
            });
        });
    }

}