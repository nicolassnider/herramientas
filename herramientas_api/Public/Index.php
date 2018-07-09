<?php
/**
 * Created by Nicolás Snider
 * Date: 30/06/2018
 * Time: 11:12 PM
 */
use Respect\Validation\Exceptions\ValidationException as ValidationException;

require_once '../vendor/autoload.php';
require_once '../Commons/Slim/AuthMiddleware.php';
require_once '../Commons/Slim/CorsMiddleware.php';
require_once '../Commons/Errors/ApiError.php';
require_once '../Commons/Validation/ValidationTranslation.php';

$checkAuthentication = true;
date_default_timezone_set('America/Argentina/Buenos_Aires');

$configuration = [
    'settings' => [
        'displayErrorDetails' => true,
        'determineRouteBeforeAppMiddleware' => true
    ],
];
$container = new \Slim\Container($configuration);
$app = new \Slim\App($container);
if($checkAuthentication) $app->add(new AuthMiddleware());
$app->add(new CorsMiddleware());

$container['notFoundHandler'] = function($container) {
    return function ($request, $response) use ($container){
        return $container['response']
            ->withStatus(404)
            ->withHeader('Content-Type', 'application/json; charset=utf-8')
            ->withHeader('Access-Control-Allow-Origin', '*')
            ->withHeader('Access-Control-Allow-Headers', '*')
            ->withHeader('Access-Control-Allow-Methods', '*')
            ->write(json_encode(new ApiError(4040, null)));
    };
};

$container['errorHandler'] = function($container) {
    return function ($request, $response, $exception) use ($container) {
        $ret = $container['response']
            ->withHeader('Content-Type', 'application/json; charset=utf-8')
            ->withHeader('Access-Control-Allow-Origin', '*')
            ->withHeader('Access-Control-Allow-Headers', '*')
            ->withHeader('Access-Control-Allow-Methods', '*');
        switch (true) {
            case $exception instanceof PDOException:
                error_log($exception);
                $ret = $ret
                    ->withStatus(500)
                    ->write(json_encode(new ApiError(
                        5001,
                        array($exception->getMessage()
                        ))));
                break;

            case $exception instanceof BadRequestException:
                $ret = $ret
                    ->withStatus(400)
                    ->write(json_encode(new ApiError(
                        4000,
                        array($exception->getMessage()
                        ))));
                break;

            case $exception instanceof ValidationException:
                $ret = $ret
                    ->withStatus(400)
                    ->write(json_encode(new ApiError(
                        4000,
                        $exception->setParam('translator', 'ValidationTranslation::translate')->getMessages()
                    )));
                break;

            case $exception instanceof UnauthorizedException:
                $ret = $ret
                    ->withStatus(401)
                    ->write(json_encode($exception->getError()));
                break;

            case $exception instanceof ForbidenException:
                $ret = $ret
                    ->withStatus(403)
                    ->write(json_encode($exception->getError()));
                break;

            default:
                error_log($exception);
                $ret = $ret
                    ->withStatus(500)
                    ->write(json_encode(new ApiError(
                        5000,
                        array($exception->getMessage()
                        ))));
                break;
        }
        return $ret;
    };
};

$app->options('/{routes:.+}', function ($request, $response, $args) {
    return $response;
});

require_once '../Controller/PersonaController.php';

//(new AuthController($app))->init();
(new PersonaController($app))->init();



// Catch-all route to serve a 404 Not Found page if none of the routes match
// NOTE: make sure this route is defined last
$app->map(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], '/{routes:.+}', function($req, $res) {
    $handler = $this->notFoundHandler; // handle using the default Slim page not found handler
    return $handler($req, $res);
});

$app->run();