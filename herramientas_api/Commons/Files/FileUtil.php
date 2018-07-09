<?php
require_once '../Commons/Exceptions/BadRequestException.php';
use Slim\Http\UploadedFile;

class FileUtil {
	public static function moveUploadedFile(string $directory, UploadedFile $uploadedFile) {
		// TODO: Verificar errores.
	    $extension = pathinfo($uploadedFile->getClientFilename(), PATHINFO_EXTENSION);
	    $basename = bin2hex(openssl_random_pseudo_bytes(8));
	    $filename = sprintf('%s.%0.8s', $basename, $extension);

	    $uploadedFile->moveTo($directory . DIRECTORY_SEPARATOR . $filename);

	    return $filename;
	}

	public static function readFile(string $directory, string $filename) {
		$file = @file_get_contents($directory . DIRECTORY_SEPARATOR . $filename);
		if($file !== false) {
			return $file;
		} else {
			throw new BadRequestException("Archivo no encontrado.");			
		}
	}
}