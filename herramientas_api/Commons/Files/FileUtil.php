<?php
require_once "../Commons/Exceptions/BadRequestException.php";
require_once "../Model/Archivo.php";
require_once '../Repository/PedidoAvonRepository.php';

use Slim\Http\UploadedFile;

class FileUtil {
    public static function moveUploadedFile(string $directory, UploadedFile $uploadedFile, int $id)
    {
        // TODO: Verificar errores.
        $extension = pathinfo($uploadedFile->getClientFilename(), PATHINFO_EXTENSION);

        $archivos = glob($directory . DIRECTORY_SEPARATOR . "Pedido_$id.*");
        if (!is_null($archivos)) {
            foreach ($archivos as $archivo) {
                unlink($archivo);
            }
        }

        $filename = sprintf('%s.%0.8s', "Pedido_$id", $extension);

        $uploadedFile->moveTo($directory . DIRECTORY_SEPARATOR . $filename);

        (new PedidoAvonRepository())->updateFile($id);

        return $filename;
    }

    public static function readFile(string $directory, int $id)
    {
        $arrayArchivos = glob($directory . DIRECTORY_SEPARATOR . "Pedido_$id.*");
        if ($arrayArchivos) {

            $fileName = explode('\\', $arrayArchivos[0]);
            $file = file_get_contents($directory . DIRECTORY_SEPARATOR . $fileName[2]);
            $tipo = mime_content_type($arrayArchivos[0]);


            $archivo = new Archivo();
            $archivo->setNombre($fileName[2]);
            $archivo->setContenido($file);
            $archivo->setTipo($tipo);

            if ($file !== false) {
                return $archivo;
            } else {
                throw new BadRequestException("Archivo no encontrado.");
            }
        }
    }
}