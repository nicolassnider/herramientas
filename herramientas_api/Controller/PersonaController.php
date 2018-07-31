<?php
/**
 * Created by Nicolás Snider
 * Date: 01/07/2018
 * Time: 12:42 AM
 */
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use Respect\Validation\Validator as v;
use Slim\Http\UploadedFile;

require_once '../Service/PersonaService.php';

require_once '../Dto/DataTableRequest.php';
require_once '../Dto/DataTablesResponse.php';


class PersonaController {
    private $app;

    public function __construct($app) {
        $this->app = $app;
    }

    public function init() {
        $this->app->group('/api', function() {
            $this->group('/personas', function() {
                $this->get('/{id}', function(Request $request, Response $response) {
                    $id = $request->getAttribute('id');
                    $personasService = new PersonasService();
                    $persona = $personasService->get($id);
                    if ($persona == null) {
                        return $response->withStatus(204);
                    }
                    return $response->withJson($persona, 200);
                });

            });
        });
    }

    private static function getInstanceFromRequest(Request $request): Persona {
       $persona = new Persona();
        $persona->setId((int)$request->getAttribute('id'));
        return $persona;
    }

    private static function validate(Request $request): void {
        v::allOf(
        )->assert($request->getParsedBody());
    }
}