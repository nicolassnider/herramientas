<?php
/**
 * Created by PhpStorm.
 * User: nicol
 * Date: 06/09/2018
 * Time: 10:37 PM
 */

return [
    'moviles' => [
        'cebe' => [
            'habilitado' => 'true'
        ],
        'estado' => [
            'habilitado' => 'true'
        ],
        'editaKm' => [
            'habilitado' => 'true',
            'maximo' => 1000
        ],
        'estados' => 'ACTIVO,NO ACTIVO,VENDIDO,COMODATO,DETRUCCIÓN TOTAL',
        'estadosActivos' => 'ACTIVO,COMODATO',
        'estadosInactivos' => 'NO ACTIVO,VENDIDO,DETRUCCIÓN TOTAL',
    ],
    'mantenimientos' => [
        'correctivo' => [
            'abono' => [
                'habilitado' => 'false'
            ],
            'tareasAsignables' => 'false'
        ]
    ]
];