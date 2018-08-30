<?php
require_once '../Commons/Config/Config.php';
require_once '../Model/Usuario.php';
require_once '../Repository/PersonaRepository.php';
require_once '../Repository/UsuarioRepository.php';
require_once '../Repository/UsuarioTokensRepository.php';
require_once '../Commons/Exceptions/UnauthorizedException.php';

class AuthService {

    private $personasRepository;
    private $usuariosRepository;

    public function __construct() {

        $this->personasRepository = new PersonaRepository();
        $this->usuariosRepository = new UsuarioRepository();
        $this->usuarioTokensRepository = new UsuarioTokensRepository();
    }

    public function authenticate(string $usuario, string $clave): ?Persona {
        $persona = $this->personasRepository->getByUsuario($usuario);
        if($persona != null && $persona->getEsUsuario() && $persona->getUsuario() != null) {
            if($persona->getUsuario()->getClave() == $clave) {
                $token = bin2hex(openssl_random_pseudo_bytes(8));

                $tokenMinutesValidity = Config::get('authentication.session.timeout');
                $tokenExpire = (new DateTime())->modify("+{$tokenMinutesValidity} minutes")->format('Y-m-d H:i:s');
                $this->usuarioTokensRepository->create($token, $persona->getUsuario(), $tokenExpire);

                $persona->getUsuario()->setToken($token);
                $persona->getUsuario()->setTokenExpire($tokenExpire);
                return  $persona;
            } else {
                throw new UnauthorizedException(new ApiError(4010, ['Contraseña incorrecta.']));
            }
        } else {
            throw new UnauthorizedException(new ApiError(4010, ['El usuario no existe.']));
        }
        return null;
    }

    public function checkToken(string $token): void {
        $persona = $this->personasRepository->getByToken($token);
        if($persona == null) {
            throw new UnauthorizedException(new ApiError(4010, ['No se encontró una sesión activa.']));
        } else {
            $tokenMinutesValidity = Config::get('authentication.session.timeout');
            $tokenExpire = (new DateTime())->modify("+{$tokenMinutesValidity} minutes")->format('Y-m-d H:i:s');
            $this->usuarioTokensRepository->updateTokenExpire($token, $tokenExpire);
        }
    }

    public function revokeToken(string $token): void {
        $this->usuarioTokensRepository->removeToken($token);
    }


}