<?php
require_once '../Service/AuthService.php';
require_once '../Commons/Errors/ApiError.php';
require_once '../Commons/Exceptions/UnauthorizedException.php';

class AuthMiddleware {
	public function __invoke($req, $res, $next) {
        $pos = strpos($req->getUri()->getPath(), 'api/public');
        if($pos === false && !$req->isOptions()) {
            if($req->hasHeader('Authorization-Token')) {
                $token = $req->getHeader('Authorization-Token')[0];
                (new AuthService())->checkToken($token);
            } else {
                throw new UnauthorizedException(new ApiError(4010, ['Authorization-Token requerido.']));
            }
        }
        return $next($req, $res);
    }
}