<?php

class Config {
    public static function get(string $keyPath): string {
        $config = include('../config/config.php');
        $keys = explode(".", $keyPath);
        $value = $config;
        foreach ($keys as $key) {
            $value = $value[$key];
        }
        return $value;
    }
}