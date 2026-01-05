<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockUbicacion extends Model
{
    protected $table = 'stock_ubicacion';
    protected $primaryKey = 'id_stock';
    public $timestamps = false;

    protected $fillable = [
        'id_producto',
        'id_ubicacion',
        'cantidad'
    ];

    public function producto()
    {
        return $this->belongsTo(
            Producto::class,
            'id_producto',
            'id_producto'
        );
    }

    public function ubicacion()
    {
        return $this->belongsTo(
            Ubicacion::class,
            'id_ubicacion',
            'id_ubicacion'
        );
    }
    public function getRouteKeyName()
    {
        return 'id_stock';
    }
}
