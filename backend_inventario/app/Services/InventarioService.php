<?php

namespace App\Services;

use App\Models\Movimiento;
use App\Models\StockUbicacion;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;
use RuntimeException;

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
     * Por defecto NO permite dejar stock en negativo.
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

            if (!$permitirNegativo && ($stock->cantidad - $cantidad) < 0) {
                throw new RuntimeException('Stock insuficiente para realizar la salida.');
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
     * TRASLADO: se registra como 2 movimientos (salida origen + entrada destino) con una misma referencia.
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
            throw new InvalidArgumentException('La ubicación origen y destino no pueden ser la misma.');
        }
        $this->assertCantidadPositiva($cantidad);

        return DB::transaction(function () use ($idProducto, $idUbicacionOrigen, $idUbicacionDestino, $cantidad, $motivo, $referencia) {

            // Para evitar deadlocks: bloquea siempre en orden consistente
            $pairs = [
                [$idProducto, $idUbicacionOrigen],
                [$idProducto, $idUbicacionDestino],
            ];
            sort($pairs);

            $locked = [];
            foreach ($pairs as [$p, $u]) {
                $locked["$p-$u"] = $this->getOrCreateStockRowLocked($p, $u);
            }

            $stockOrigen = $locked["$idProducto-$idUbicacionOrigen"];
            $stockDestino = $locked["$idProducto-$idUbicacionDestino"];

            if (($stockOrigen->cantidad - $cantidad) < 0) {
                throw new RuntimeException('Stock insuficiente en la ubicación origen para trasladar.');
            }

            $stockOrigen->cantidad -= $cantidad;
            $stockDestino->cantidad += $cantidad;

            $stockOrigen->save();
            $stockDestino->save();

            $ref = $referencia ?? ('TRASLADO-' . now()->format('YmdHis'));

            $movSalida = Movimiento::create([
                'id_producto' => $idProducto,
                'id_ubicacion' => $idUbicacionOrigen,
                'tipo' => 'salida',
                'cantidad' => $cantidad,
                'motivo' => $motivo ? $motivo . ' (origen)' : 'Traslado (origen)',
                'referencia' => $ref,
            ]);

            $movEntrada = Movimiento::create([
                'id_producto' => $idProducto,
                'id_ubicacion' => $idUbicacionDestino,
                'tipo' => 'entrada',
                'cantidad' => $cantidad,
                'motivo' => $motivo ? $motivo . ' (destino)' : 'Traslado (destino)',
                'referencia' => $ref,
            ]);

            return [
                'referencia' => $ref,
                'salida' => $movSalida,
                'entrada' => $movEntrada,
            ];
        });
    }

    /**
     * AJUSTE: fija el stock a un valor objetivo; registra un movimiento por la diferencia.
     * Retorna null si no hay diferencia.
     */
    public function ajuste(
        int $idProducto,
        int $idUbicacion,
        int $cantidadObjetivo,
        ?string $motivo = null,
        ?string $referencia = null
    ): ?Movimiento {
        if ($cantidadObjetivo < 0) {
            throw new InvalidArgumentException('La cantidad objetivo no puede ser negativa.');
        }

        return DB::transaction(function () use ($idProducto, $idUbicacion, $cantidadObjetivo, $motivo, $referencia) {

            $stock = $this->getOrCreateStockRowLocked($idProducto, $idUbicacion);

            $diferencia = $cantidadObjetivo - $stock->cantidad;
            if ($diferencia === 0) {
                return null;
            }

            $tipo = $diferencia > 0 ? 'entrada' : 'salida';
            $cantidadMovimiento = abs($diferencia);

            $stock->cantidad = $cantidadObjetivo;
            $stock->save();

            return Movimiento::create([
                'id_producto' => $idProducto,
                'id_ubicacion' => $idUbicacion,
                'tipo' => $tipo,
                'cantidad' => $cantidadMovimiento,
                'motivo' => $motivo ?? 'Ajuste por inventario físico',
                'referencia' => $referencia ?? ('AJUSTE-' . now()->format('YmdHis')),
            ]);
        });
    }

    /**
     * Obtiene o crea la fila de stock para (producto, ubicación) con lock FOR UPDATE.
     * Requiere unique(id_producto,id_ubicacion) (ya lo tienes).
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
            // Si no existe aún, se crea con 0
            return StockUbicacion::create([
                'id_producto' => $idProducto,
                'id_ubicacion' => $idUbicacion,
                'cantidad' => 0,
            ]);
        } catch (\Throwable $e) {
            // Si hubo carrera y ya existe por el unique, re-leer con lock
            return StockUbicacion::where('id_producto', $idProducto)
                ->where('id_ubicacion', $idUbicacion)
                ->lockForUpdate()
                ->firstOrFail();
        }
    }

    private function assertCantidadPositiva(int $cantidad): void
    {
        if ($cantidad <= 0) {
            throw new InvalidArgumentException('La cantidad debe ser mayor a 0.');
        }
    }
}
