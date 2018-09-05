<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use Respect\Validation\Validator as v;

require_once '../Service/WidgetService.php';
require_once '../Model/Widget.php';

class WidgetController {
    private $app;

    public function __construct($app) {
        $this->app = $app;
    }

    private static function validate($request): void {
        v::allOf(
            v::key('nombre', v::notEmpty())
        )->assert($request->getParsedBody());
    }

    private static function getInstanceFromRequest(Request $request): Marca {
        $marca = new Marca();
        $marca->setId((int)$request->getAttribute('id'));
        $marca->setNombre($request->getParam('nombre'));
        $marca->setObservaciones($request->getParam('observaciones'));
	    $marca->setFoto($request->getParam('foto'));
        return $marca;
    }

    public function init() {
        $this->app->group('/api', function () {
            $this->group('/widgets', function () {
		        $this->get('', function (Request $request, Response $response) {
                        $widgetService = new WidgetService();
                        $widget = $widgetService->getWidgets();
                        if ($widget == null) {
                                return $widget->withStatus(204);
                        }
                        return $response->withJson($widget, 200);
                });
            });            
        });
    }
}
