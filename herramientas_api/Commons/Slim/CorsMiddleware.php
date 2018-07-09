<?php

class CorsMiddleware {
	public function __invoke($req, $res, $next) {
        $response = $next($req, $res);
        if(!$response->hasHeader('Content-type')) {
            $response->withHeader(
                'Content-type',
                'application/json; charset=utf-8'
            );
        }
        return $response
            ->withHeader('Access-Control-Allow-Origin', '*')
            ->withHeader('Access-Control-Allow-Headers', '*')
            ->withHeader('Access-Control-Allow-Methods', '*');        
    }
}