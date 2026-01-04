<?php

namespace App\Services;

use App\Models\Movimiento;
use App\Models\StockUbicacion;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class InventarioService
{
    /**
     * Registra una ENTRADA y actualiza stock_ubicacion.
     */
    public function entrada(
        int $idProducto,
        int $idUbicacion,
        int $cantidad,
        ?string $motivo = null,
        ?string $referencia = null
    ): Movimiento {
        $this->assertCantidadPositiva($cantidad);

        return DB::transaction(function () use ($idProducto, $idUbicacion, $cantidad, $motivo, $referencia) {

            $stock = $this->getOrCreateStockRowLocked($idProducto, $idUbicacion);
            $stock->cantidad += $cantidad;
            $stock->save();

            return Movimiento::create([
                'id_producto' => $idProducto,
                'id_ubicacion' => $idUbicacion,
                'tipo' => 'entrada',
                'cantidad' => $cantidad,
                'motivo' => $motivo,
                'referencia' => $referencia,
            ]);
        });
    }

    /**
     * Registra una SALIDA y actualiza stock_ubicacion.
     */
    public function salida(
        int $idProducto,
        int $idUbicacion,
        int $cantidad,
        ?string $motivo = null,
        ?string $referencia = null,
        bool $permitirNegativo = false
    ): Movimiento {
        $this->assertCantidadPositiva($cantidad);

        return DB::transaction(function () use ($idProducto, $idUbicacion, $cantidad, $motivo, $referencia, $permitirNegativo) {

            $stock = $this->getOrCreateStockRowLocked($idProducto, $idUbicacion);

            if (! $permitirNegativo && ($stock->cantidad - $cantidad) < 0) {
                throw ValidationException::withMessages([
                    'cantidad' => ['Stock insuficiente para realizar la salida.'],
                ]);
            }

            $stock->cantidad -= $cantidad;
            $stock->save();

            return Movimiento::create([
                'id_producto' => $idProducto,
                'id_ubicacion' => $idUbicacion,
                'tipo' => 'salida',
                'cantidad' => $cantidad,
                'motivo' => $motivo,
                'referencia' => $referencia,
            ]);
        });
    }

    /**
     * TRASLADO: salida en origen + entrada en destino (misma referencia).
     */
    public function traslado(
        int $idProducto,
        int $idUbicacionOrigen,
        int $idUbicacionDestino,
        int $cantidad,
        ?string $motivo = null,
        ?string $referencia = null
    ): array {
        if ($idUbicacionOrigen === $idUbicacionDestino) {
            throw ValidationException::withMessages([
                'id_ubicacion_destino' => ['La ubicación origen y destino no pueden ser la misma.'],
            ]);
        }

        $this->assertCantidadPositiva($cantidad);

        return DB::transaction(function () use ($idProducto, $idUbicacionOrigen, $idUbicacionDestino, $cantidad, $motivo, $referencia) {

            // Lock consistente por ubicación (evita deadlocks)
            $ids = [$idUbicacionOrigen, $idUbicacionDestino];
            sort($ids);

            $stockA = $this->getOrCreateStockRowLocked($idProducto, $ids[0]);
            $stockB = $this->getOrCreateStockRowLocked($idProducto, $ids[1]);

            $stockOrigen  = $idUbicacionOrigen === $ids[0] ? $stockA : $stockB;
            $stockDestino = $idUbicacionDestino === $ids[0] ? $stockA : $stockB;

            if (($stockOrigen->cantidad - $cantidad) < 0) {
                throw ValidationException::withMessages([
                    'cantidad' => ['Stock insuficiente en la ubicación origen para trasladar.'],
                ]);
            }

            $stockOrigen->cantidad -= $cantidad;
            $stockDestino->cantidad += $cantidad;

            $stockOrigen->save();
            $stockDestino->save();

            $ref = $referencia ?? ('TRASLADO-' . now()->format('YmdHis'));

            return [
                'referencia' => $ref,
                'salida' => Movimiento::create([
                    'id_producto' => $idProducto,
                    'id_ubicacion' => $idUbicacionOrigen,
                    'tipo' => 'salida',
                    'cantidad' => $cantidad,
                    'motivo' => $motivo ? $motivo . ' (origen)' : 'Traslado (origen)',
                    'referencia' => $ref,
                ]),
                'entrada' => Movimiento::create([
                    'id_producto' => $idProducto,
                    'id_ubicacion' => $idUbicacionDestino,
                    'tipo' => 'entrada',
                    'cantidad' => $cantidad,
                    'motivo' => $motivo ? $motivo . ' (destino)' : 'Traslado (destino)',
                    'referencia' => $ref,
                ]),
            ];
        });
    }

    /**
     * AJUSTE: fija stock a un valor objetivo.
     */
    public function ajuste(
        int $idProducto,
        int $idUbicacion,
        int $cantidadObjetivo,
        ?string $motivo = null,
        ?string $referencia = null
    ): ?Movimiento {
        if ($cantidadObjetivo < 0) {
            throw ValidationException::withMessages([
                'cantidad_objetivo' => ['La cantidad objetivo no puede ser negativa.'],
            ]);
        }

        return DB::transaction(function () use ($idProducto, $idUbicacion, $cantidadObjetivo, $motivo, $referencia) {

            $stock = $this->getOrCreateStockRowLocked($idProducto, $idUbicacion);

            $diferencia = $cantidadObjetivo - $stock->cantidad;
            if ($diferencia === 0) {
                return null;
            }

            $tipo = $diferencia > 0 ? 'entrada' : 'salida';

            $stock->cantidad = $cantidadObjetivo;
            $stock->save();

            return Movimiento::create([
                'id_producto' => $idProducto,
                'id_ubicacion' => $idUbicacion,
                'tipo' => $tipo,
                'cantidad' => abs($diferencia),
                'motivo' => $motivo ?? 'Ajuste por inventario físico',
                'referencia' => $referencia ?? ('AJUSTE-' . now()->format('YmdHis')),
            ]);
        });
    }

    /**
     * Obtiene o crea stock con lock FOR UPDATE.
     */
    private function getOrCreateStockRowLocked(int $idProducto, int $idUbicacion): StockUbicacion
    {
        $stock = StockUbicacion::where('id_producto', $idProducto)
            ->where('id_ubicacion', $idUbicacion)
            ->lockForUpdate()
            ->first();

        if ($stock) {
            return $stock;
        }

        try {
            return StockUbicacion::create([
                'id_producto' => $idProducto,
                'id_ubicacion' => $idUbicacion,
                'cantidad' => 0,
            ]);
        } catch (\Throwable $e) {
            return StockUbicacion::where('id_producto', $idProducto)
                ->where('id_ubicacion', $idUbicacion)
                ->lockForUpdate()
                ->firstOrFail();
        }
    }

    private function assertCantidadPositiva(int $cantidad): void
    {
        if ($cantidad <= 0) {
            throw ValidationException::withMessages([
                'cantidad' => ['La cantidad debe ser mayor a 0.'],
            ]);
        }
    }
}
