<?php

class ValidationTranslation {
	public static function translate($message) {
	    $messages = [
	        '{{name}} must not be empty' => 'El campo {{name}} es requerido',
	        'All of the required rules must pass for {{name}}' => 'Valor incorrecto para el campo {{name}}',
	        '{{name}} must be valid email' => 'El campo {{name}} tiene formato inválido',
	        'Attribute {{name}} must be present' => 'El atributo {{name}} debe estar presente',
	        'Key {{name}} must be present' => 'El campo {{name}} es requerido',
	        'Key {{name}} must be valid' => 'El campo {{name}} es inválido',
	        'These rules must pass for {{name}}' => 'El campo {{name}} es inválido',
	        '{{name}} must be an integer number' => 'El campo {{name}} debe ser un número entero',
	        'No items were found for key chain {{name}}' => 'El campo {{name}} es requerido',
	        'Key chain {{name}} is not valid' => 'El campo {{name}} es inválido',
	        '{{name}} must be a boolean' => 'El campo {{name}} debe ser booleano',
	        '{{name}} is not valid' => '{{name}} no es válido'
	    ];
	    return $messages[$message];
	}
}