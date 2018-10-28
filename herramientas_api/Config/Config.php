<?php
/**
 * Created by Nicolás Snider
 * Date: 01/07/2018
 * Time: 1:12 AM
 */
return [
    'database' => [
        'host' => 'localhost',
        'port' => '3306',
        'database' => 'herramientas',
        'username' => 'root',
        'password' => ''
    ],
    'authentication' => [
        'session'  => [
            'timeout' => 60 // minutos
        ],
        'activation' => [
            'timeout' => 2880 // minutos
        ]
    ],
    'notifications' => [
        'email'  => [
            'smtp' => [
                'host' => '',
                'port' => '',
                'username' => '',
                'password' => ''
            ],
            'fromEmail' => '',
            'fromName' => '',
            'replyToEmail' => '',
            'replyToName' => ''
        ]
    ],
    'storage' => [
        'personas' => [
            'photo' => [
                'path' => ''
            ]
        ],
        'productos' => [
            'photo' => [
                'path' => ''
            ]
        ]
    ]
];