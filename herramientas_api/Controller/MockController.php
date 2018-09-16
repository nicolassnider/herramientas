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

            });


    }

}