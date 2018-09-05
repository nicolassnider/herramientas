<?php
require_once '../Repository/WidgetRepository.php';
require_once '../Commons/Files/FileUtil.php';

use Slim\Http\UploadedFile;

class WidgetService {
    private $repository;

    public function __construct() {
        $this->repository = new WidgetRepository();
    }

    public function getWidgets()
    {
        return $this->repository->getWidgets();
    }



}
