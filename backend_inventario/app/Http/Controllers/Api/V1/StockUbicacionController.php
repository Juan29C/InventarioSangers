<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\StockUbicacion;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StockUbicacionController extends Controller
{
    /**
     * Listado de stock por producto y ubicación
     * Filtros opcionales: id_producto, id_ubicacion
     */
    public function index(Request $request): JsonResponse
    {
        $query = StockUbicacion::with(['producto', 'ubicacion']);

        if ($request->filled('id_producto')) {
            $query->where('id_producto', $request->id_producto);
        }

        if ($request->filled('id_ubicacion')) {
            $query->where('id_ubicacion', $request->id_ubicacion);
        }

        return response()->json(
            $query->orderBy('id_producto')->get()
        );
    }

    /**
     * Ver stock puntual (por id_stock)
     */
    public function show(StockUbicacion $stock): JsonResponse
    {
        return response()->json(
            $stock->load(['producto', 'ubicacion'])
        );
    }
}
