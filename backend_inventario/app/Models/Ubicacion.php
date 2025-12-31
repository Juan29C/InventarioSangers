<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ubicacion extends Model
{
    protected $table = 'ubicaciones';
    protected $primaryKey = 'id_ubicacion';
    public $timestamps = false;

    protected $fillable = [
        'nombre_ubicacion',
         'activo',
    ];
    protected $casts = [
    'activo' => 'boolean',
    ];

    public function stocks()
    {
        return $this->hasMany(
            StockUbicacion::class,
            'id_ubicacion',
            'id_ubicacion'
        );
    }
    public function getRouteKeyName()
    {
        return 'id_ubicacion';
    }
}
