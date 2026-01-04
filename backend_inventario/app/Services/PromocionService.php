<?php

namespace App\Services;

use App\Models\PromocionPrecio;

class PromocionService
{
    public function promoAplicable(int $idProducto, int $cantidadCompra): ?PromocionPrecio
    {
        $cantidadCompra = max(1, $cantidadCompra);

        return PromocionPrecio::query()
            ->where('id_producto', $idProducto)
            ->where('activo', true)
            ->where('cantidad_minima', '<=', $cantidadCompra)
            ->orderBy('prioridad', 'asc')
            ->orderBy('cantidad_minima', 'desc') // la promo más exigente que igual cumples
            ->orderBy('precio_oferta', 'asc')    // si empata, el mejor precio
            ->first();
    }
}
