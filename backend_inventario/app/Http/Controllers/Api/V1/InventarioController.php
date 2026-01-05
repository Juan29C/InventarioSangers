<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Inventario\EntradaRequest;
use App\Http\Requests\Inventario\SalidaRequest;
use App\Http\Requests\Inventario\TrasladoRequest;
use App\Http\Requests\Inventario\AjusteRequest;
use App\Models\Movimiento;
use App\Models\StockUbicacion;
use App\Services\InventarioService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InventarioController extends Controller
{
    public function __construct(private readonly InventarioService $inventario)
    {
    }

    // POST /inventario/entradas
    public function entrada(EntradaRequest $request): JsonResponse
    {
        $data = $request->validated();

        $mov = $this->inventario->entrada(
            (int) $data['id_producto'],
            (int) $data['id_ubicacion'],
            (int) $data['cantidad'],
            $data['motivo'] ?? null,
            $data['referencia'] ?? null
        );

        return response()->json([
            'ok' => true,
            'movimiento' => $mov,
        ], 201);
    }

    // POST /inventario/salidas
    public function salida(SalidaRequest $request): JsonResponse
    {
        $data = $request->validated();

        $mov = $this->inventario->salida(
            (int) $data['id_producto'],
            (int) $data['id_ubicacion'],
            (int) $data['cantidad'],
            $data['motivo'] ?? null,
            $data['referencia'] ?? null,
            (bool) ($data['permitir_negativo'] ?? false)
        );

        return response()->json([
            'ok' => true,
            'movimiento' => $mov,
        ], 201);
    }

    // POST /inventario/traslados
    public function traslado(TrasladoRequest $request): JsonResponse
    {
        $data = $request->validated();

        $result = $this->inventario->traslado(
            (int) $data['id_producto'],
            (int) $data['id_ubicacion_origen'],
            (int) $data['id_ubicacion_destino'],
            (int) $data['cantidad'],
            $data['motivo'] ?? null,
            $data['referencia'] ?? null
        );

        return response()->json([
            'ok' => true,
            'referencia' => $result['referencia'],
            'salida' => $result['salida'],
            'entrada' => $result['entrada'],
        ], 201);
    }

    // POST /inventario/ajustes
    public function ajuste(AjusteRequest $request): JsonResponse
    {
        $data = $request->validated();

        $mov = $this->inventario->ajuste(
            (int) $data['id_producto'],
            (int) $data['id_ubicacion'],
            (int) $data['cantidad_objetivo'],
            $data['motivo'] ?? null,
            $data['referencia'] ?? null
        );

        // Si no hubo diferencia, no se creó movimiento
        if ($mov === null) {
            return response()->json([
                'ok' => true,
                'message' => 'Sin cambios: el stock ya coincide con la cantidad objetivo.',
            ]);
        }

        return response()->json([
            'ok' => true,
            'movimiento' => $mov,
        ], 201);
    }

    // GET /inventario/stock?id_producto=1&id_ubicacion=2
    public function stock(Request $request): JsonResponse
    {
        $q = StockUbicacion::with(['producto', 'ubicacion']);

        if ($request->filled('id_producto')) {
            $q->where('id_producto', (int) $request->id_producto);
        }

        if ($request->filled('id_ubicacion')) {
            $q->where('id_ubicacion', (int) $request->id_ubicacion);
        }

        return response()->json(
            $q->orderBy('id_producto')->orderBy('id_ubicacion')->get()
        );
    }

    // GET /inventario/movimientos?id_producto=1&id_ubicacion=2&tipo=entrada&desde=2026-01-01&hasta=2026-01-31
    public function movimientos(Request $request): JsonResponse
    {
        $q = Movimiento::query();

        if ($request->filled('id_producto')) {
            $q->where('id_producto', (int) $request->id_producto);
        }

        if ($request->filled('id_ubicacion')) {
            $q->where('id_ubicacion', (int) $request->id_ubicacion);
        }

        if ($request->filled('tipo')) {
            $q->where('tipo', $request->tipo);
        }

        if ($request->filled('referencia')) {
            $q->where('referencia', $request->referencia);
        }

        if ($request->filled('desde')) {
            $q->whereDate('created_at', '>=', $request->desde);
        }

        if ($request->filled('hasta')) {
            $q->whereDate('created_at', '<=', $request->hasta);
        }

        return response()->json(
            $q->orderByDesc('created_at')->get()
        );
    }
}
