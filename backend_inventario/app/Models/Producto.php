<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Producto extends Model
{
    use HasFactory;

    protected $table = 'productos';
    protected $primaryKey = 'id_producto';
    public $timestamps = true;

    protected $fillable = [
        'sku',
        'nombre',
        'descripcion',
        'precio_compra',
        'precio_venta_unitario',
        'stock_minimo',
        'id_categoria',
        'id_tipo', 
        'activo',
    ];

    protected $casts = [
        'precio_compra' => 'decimal:2',
        'precio_venta_unitario' => 'decimal:2',
        'activo' => 'boolean',
    ];

    /**
     * Relación: Producto pertenece a una Categoría
     */
    public function categoria()
    {
        return $this->belongsTo(
            Categoria::class,
            'id_categoria',
            'id_categoria'
        );
    }
    public function getRouteKeyName()
    {
        return 'id_producto';
    }
}