<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Categoria;
use App\Models\CategoriaTipo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Requests\CategoriaTipo\StoreCategoriaTipoRequest;
use App\Http\Requests\CategoriaTipo\UpdateCategoriaTipoRequest;

class CategoriaTipoController extends Controller
{
    // GET /categoria-tipos?id_categoria=1&activo=true
    public function index(Request $request): JsonResponse
    {
        $q = CategoriaTipo::query();

        if ($request->filled('id_categoria')) {
            $q->where('id_categoria', (int) $request->id_categoria);
        }

        if ($request->filled('activo')) {
            $activo = filter_var($request->activo, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            if ($activo !== null) {
                $q->where('activo', $activo);
            }
        }

        return response()->json(
            $q->orderBy('nombre_tipo')->get()
        );
    }

    // GET /categoria-tipos/{tipo}
    public function show(CategoriaTipo $tipo): JsonResponse
    {
        return response()->json($tipo);
    }

    // GET /categorias/{categoria}/tipos?activo=true
    public function byCategoria(Categoria $categoria, Request $request): JsonResponse
    {
        $q = $categoria->tipos()->orderBy('nombre_tipo');

        if ($request->filled('activo')) {
            $activo = filter_var($request->activo, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            if ($activo !== null) {
                $q->where('activo', $activo);
            }
        }

        return response()->json($q->get());
    }

    // POST /categoria-tipos
    public function store(StoreCategoriaTipoRequest $request): JsonResponse
    {
        $data = $request->validated();

        $tipo = CategoriaTipo::create([
            'id_categoria' => $data['id_categoria'],
            'nombre_tipo'  => $data['nombre_tipo'],
            'activo'       => $data['activo'] ?? true,
        ]);

        return response()->json($tipo, 201);
    }

    // PUT /categoria-tipos/{tipo}
    public function update(UpdateCategoriaTipoRequest $request, CategoriaTipo $tipo): JsonResponse
    {
        $data = $request->validated();

        $tipo->update([
            'id_categoria' => $data['id_categoria'],
            'nombre_tipo'  => $data['nombre_tipo'],
            'activo'       => $data['activo'] ?? $tipo->activo,
        ]);

        return response()->json($tipo);
    }

    // DELETE lógico recomendado: activo=false
    public function destroy(CategoriaTipo $tipo): JsonResponse
    {
        $tipo->update(['activo' => false]);

        return response()->json([
            'ok' => true,
            'id_tipo' => $tipo->id_tipo,
            'activo' => $tipo->activo,
        ]);
    }
}
