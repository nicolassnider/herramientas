<?php
/**
 * Created by Nicolás Snider
 * Date: 01/07/2018
 * Time: 12:43 AM
 */
require_once '../Repository/PersonaRepository.php';
require_once '../Commons/Files/FileUtil.php';
require_once 'MailService.php';
use Slim\Http\UploadedFile;

class PersonaService {

    private $repository;

    public function __construct()
    {
        $this->repository= new PersonaRepository();
    }
    public function get(int $idPersona): ?Persona {

        return $this->repository->get($idPersona);
    }

    public function getAll(): array {
        return $this->repository->getAll();
    }

    public function create(Persona $persona): Persona {
        /*if($persona->getEsUsuario()) {
            $claveActivacionCodigo = bin2hex(openssl_random_pseudo_bytes(8));
            $claveActivacionTimeout = Config::get('authentication.activation.timeout');

            $claveActivacionExpiracion = (new DateTime())->modify("+{$claveActivacionTimeout} minutes")->format('Y-m-d H:i:s');

            $persona->getUsuario()->setClaveActivacionCodigo($claveActivacionCodigo);
            $persona->getUsuario()->setClaveActivacionExpiracion($claveActivacionExpiracion);
        }*/

        $persona = (new PersonaRepository())->create($persona);
        /*
                if($persona->getEsUsuario()) {
                    $mailService = new MailService();
                    $mailService->sendBlankPasswordLink($persona);
                }
        */
        return $persona;
    }

    public function update(Persona $persona): void {
        $personaRepository = new PersonaRepository();
        $personaRepository->update($persona);
    }

    public function delete(int $idPersona): void {
        $personaRepository = new PersonaRepository();
        $personaRepository->delete($idPersona);
    }

    public function grid(DataTablesResponse $dataTablesResponse, DataTableRequest $dataTableRequest) {
        $personasRepository = new PersonaRepository();
        return ($personasRepository->grid($dataTablesResponse, $dataTableRequest));
    }

    public function getAllByPermiso($permiso): ?array{

        return $this->repository->getAllByPermiso($permiso);
    }

    public function savePhoto(UploadedFile $photoFile): string {
        // TODO: Verificar errores.
        $directory = Config::get('storage.personas.photo.path');
        $photoFilename = FileUtil::moveUploadedFile($directory, $photoFile);
        return $photoFilename;
    }

    public function getPhoto(string $photoFilename) {
        // TODO: Verificar errores.
        $directory = Config::get('storage.personas.photo.path');
        $photoFile = FileUtil::readFile($directory, $photoFilename);
        return $photoFile;
    }
}