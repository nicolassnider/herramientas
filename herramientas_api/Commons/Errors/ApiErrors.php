<?php

class ApiErrors {
	public const errors = [
		"4000" => "Error en los parámetros de entrada.",
		"4010" => "Usuario no autenticado.",
		"4011" => "La sesión expiró.",
		"4030" => "No tiene permisos para realizar esta acción.",
		"4040" => "Servicio no encontrado.",
		"5000" => "Error interno de la aplicación.",
		"5001" => "Error de conexión a la base de datos.",
	];
}