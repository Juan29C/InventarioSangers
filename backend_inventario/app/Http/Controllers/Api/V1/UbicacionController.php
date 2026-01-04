<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Ubicacion;
use App\Http\Requests\Ubicacion\StoreUbicacionRequest;
use App\Http\Requests\Ubicacion\UpdateUbicacionRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\QueryException;

class UbicacionController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            Ubicacion::orderBy('nombre_ubicacion')->get()
        );
    }

    public function show(Ubicacion $ubicacion): JsonResponse
    {
        return response()->json($ubicacion);
    }

    public function store(StoreUbicacionRequest $request): JsonResponse
    {
        $ubicacion = Ubicacion::create($request->validated());
        return response()->json($ubicacion, 201);
    }

    public function update(UpdateUbicacionRequest $request, Ubicacion $ubicacion): JsonResponse
    {
        $ubicacion->update($request->validated());
        return response()->json($ubicacion);
    }

    // Desactivación lógica
    public function destroy(Ubicacion $ubicacion): JsonResponse
    {
        $ubicacion->update(['activo' => false]);

        return response()->json([
            'ok' => true,
            'tipo' => 'desactivada',
            'id_ubicacion' => $ubicacion->id_ubicacion,
            'activo' => $ubicacion->activo,
        ]);
    }

    // Eliminación física (forzada)
    public function forceDestroy(Ubicacion $ubicacion): JsonResponse
    {
        if ($ubicacion->stocks()->exists()) {
            return response()->json([
                'message' => 'No se puede eliminar físicamente una ubicación con stock asociado'
            ], 409);
        }

        try {
            $ubicacion->delete();

            return response()->json([
                'ok' => true,
                'tipo' => 'eliminada',
                'id_ubicacion' => $ubicacion->id_ubicacion,
            ]);
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'No se puede eliminar la ubicación por dependencias en el sistema'
            ], 409);
        }
    }
}
