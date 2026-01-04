<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Promocion\StorePromocionPrecioRequest;
use App\Http\Requests\Promocion\UpdatePromocionPrecioRequest;
use App\Models\PromocionPrecio;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PromocionPrecioController extends Controller
{
    /**
     * GET /api/v1/promociones
     * Filtros opcionales:
     * - id_producto=1
     * - activo=true|false
     */
    public function index(Request $request): JsonResponse
    {
        $q = PromocionPrecio::query()->with('producto');

        if ($request->filled('id_producto')) {
            $q->where('id_producto', (int) $request->id_producto);
        }

        if ($request->filled('activo')) {
            $activo = filter_var($request->activo, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            if (!is_null($activo)) {
                $q->where('activo', $activo);
            }
        }

        return response()->json(
            $q->orderBy('prioridad')
              ->orderByDesc('cantidad_minima')
              ->get()
        );
    }

    /**
     * GET /api/v1/promociones/{promocion}
     */
    public function show(PromocionPrecio $promocion): JsonResponse
    {
        return response()->json($promocion->load('producto'));
    }

    /**
     * POST /api/v1/promociones
     */
    public function store(StorePromocionPrecioRequest $request): JsonResponse
    {
        // Regla recomendada: evitar duplicados exactos (producto + cantidad_minima)
        $exists = PromocionPrecio::where('id_producto', $request->validated('id_producto'))
            ->where('cantidad_minima', $request->validated('cantidad_minima'))
            ->where('activo', true)
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Ya existe una promoción activa para este producto con esa cantidad mínima.',
                'errors' => [
                    'cantidad_minima' => ['Ya existe una promoción activa para este producto con esa cantidad mínima.']
                ],
            ], 422);
        }

        $promocion = PromocionPrecio::create([
            'id_producto' => $request->validated('id_producto'),
            'cantidad_minima' => $request->validated('cantidad_minima'),
            'precio_oferta' => $request->validated('precio_oferta'),
            'activo' => $request->validated('activo') ?? true,
            'prioridad' => $request->validated('prioridad') ?? 100,
        ]);

        return response()->json($promocion->load('producto'), 201);
    }

    /**
     * PUT /api/v1/promociones/{promocion}
     */
    public function update(UpdatePromocionPrecioRequest $request, PromocionPrecio $promocion): JsonResponse
    {
        // Evitar duplicados exactos (producto + cantidad_minima) en promos activas
        $idProducto = (int) $request->validated('id_producto');
        $cantidadMin = (int) $request->validated('cantidad_minima');

        $exists = PromocionPrecio::where('id_producto', $idProducto)
            ->where('cantidad_minima', $cantidadMin)
            ->where('activo', true)
            ->where('id_promo', '!=', $promocion->id_promo)
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Ya existe otra promoción activa para este producto con esa cantidad mínima.',
                'errors' => [
                    'cantidad_minima' => ['Ya existe otra promoción activa para este producto con esa cantidad mínima.']
                ],
            ], 422);
        }

        $promocion->update([
            'id_producto' => $idProducto,
            'cantidad_minima' => $cantidadMin,
            'precio_oferta' => $request->validated('precio_oferta'),
            'activo' => $request->validated('activo') ?? $promocion->activo,
            'prioridad' => $request->validated('prioridad') ?? $promocion->prioridad,
        ]);

        return response()->json($promocion->fresh()->load('producto'));
    }

    /**
     * DELETE /api/v1/promociones/{promocion}
     * Borrado lógico (activo=false)
     */
    public function destroy(PromocionPrecio $promocion): JsonResponse
    {
        $promocion->update(['activo' => false]);

        return response()->json([
            'ok' => true,
            'id_promo' => $promocion->id_promo,
            'activo' => $promocion->activo,
        ]);
    }

    /**
     * GET /api/v1/productos/{producto}/promocion-aplicable?cantidad=10
     * Retorna la mejor promo activa que aplica para esa cantidad.
     */
    public function aplicablePorProducto(Request $request, int $producto): JsonResponse
    {
        $cantidad = (int) ($request->query('cantidad', 1));
        if ($cantidad < 1) $cantidad = 1;

        $promo = PromocionPrecio::query()
            ->where('id_producto', $producto)
            ->where('activo', true)
            ->where('cantidad_minima', '<=', $cantidad)
            ->orderBy('prioridad', 'asc')
            ->orderByDesc('cantidad_minima')
            ->orderBy('precio_oferta', 'asc')
            ->first();

        return response()->json([
            'id_producto' => $producto,
            'cantidad' => $cantidad,
            'promocion' => $promo ? $promo->load('producto') : null,
        ]);
    }
}
