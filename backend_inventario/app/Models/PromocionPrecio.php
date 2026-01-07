<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class PromocionPrecio extends Model
{
    protected $table = 'promociones_precio';
    protected $primaryKey = 'id_promo';
    public $timestamps = true;

    protected $fillable = [
        'id_producto',
        'cantidad_minima',
        'precio_oferta',
        'activo',
        'prioridad',
    ];

    protected $casts = [
        'id_producto' => 'integer',
        'cantidad_minima' => 'integer',
        'precio_oferta' => 'decimal:2',
        'activo' => 'boolean',
        'prioridad' => 'integer',
    ];

    /**
     * Relación: la promoción pertenece a un producto
     */
    public function producto()
    {
        return $this->belongsTo(
            Producto::class,
            'id_producto',
            'id_producto'
        );
    }

    /**
     * Route model binding por id_promo
     */
    public function getRouteKeyName()
    {
        return 'id_promo';
    }

    /**
     * Scope: solo promociones activas
     */
    public function scopeActivas(Builder $query): Builder
    {
        return $query->where('activo', true);
    }

    /**
     * Scope: promociones aplicables según cantidad comprada
     */
    public function scopeAplicables(Builder $query, int $cantidad): Builder
    {
        return $query
            ->where('cantidad_minima', '<=', $cantidad)
            ->orderBy('prioridad', 'asc')
            ->orderBy('cantidad_minima', 'desc')
            ->orderBy('precio_oferta', 'asc');
    }
}
