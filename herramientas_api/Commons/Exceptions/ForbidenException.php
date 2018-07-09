<?php

class ForbidenException extends Exception {
	private $error;

    public function __construct(?ApiError $error) {
    	$this->error = $error;
    }

	public function getError(): ?ApiError {
        return $this->error;
    }

    public function setError(?ApiError $error) {
        $this->error = $error;
    }
}