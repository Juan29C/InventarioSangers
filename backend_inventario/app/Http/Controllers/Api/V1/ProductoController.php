<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use App\Http\Requests\Producto\StoreProductoRequest;
use App\Http\Requests\Producto\UpdateProductoRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductoController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $q = Producto::with(['categoria', 'tipo'])->orderBy('nombre');

        if ($request->filled('id_categoria')) {
            $q->where('id_categoria', (int) $request->id_categoria);
        }

        if ($request->filled('id_tipo')) {
            $q->where('id_tipo', (int) $request->id_tipo);
        }

        if ($request->filled('activo')) {
            $activo = filter_var($request->activo, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            if ($activo !== null) {
                $q->where('activo', $activo);
            }
        }

        return response()->json($q->get());
    }

    public function store(StoreProductoRequest $request): JsonResponse
    {
        $producto = Producto::create($request->validated());

        return response()->json(
            $producto->load(['categoria', 'tipo']),
            201
        );
    }

    public function show(Producto $producto): JsonResponse
    {
        return response()->json(
            $producto->load(['categoria', 'tipo'])
        );
    }

    public function update(UpdateProductoRequest $request, Producto $producto): JsonResponse
    {
        $producto->update($request->validated());

        return response()->json(
            $producto->fresh()->load(['categoria', 'tipo'])
        );
    }

    public function destroy(Producto $producto): JsonResponse
    {
        $producto->update(['activo' => false]);

        return response()->json([
            'ok' => true,
            'id_producto' => $producto->id_producto,
            'activo' => $producto->activo,
        ]);
    }
}
