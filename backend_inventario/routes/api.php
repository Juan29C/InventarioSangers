<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CategoriaController;
use App\Http\Controllers\Api\V1\ProductoController;
use App\Http\Controllers\Api\V1\UbicacionController;
use App\Http\Controllers\Api\V1\InventarioController;
use App\Http\Controllers\Api\V1\StockUbicacionController;
use App\Http\Controllers\Api\V1\CategoriaTipoController;
use App\Http\Controllers\Api\V1\PromocionPrecioController;

Route::prefix('v1')->group(function () {

    // --------------------------------------------
    // Healthcheck
    // --------------------------------------------
    Route::get('ping', fn () => ['ok' => true]);

    // --------------------------------------------
    // Auth (Public)
    // --------------------------------------------
    Route::prefix('auth')->group(function () {
        Route::post('register', [AuthController::class, 'register']);
        Route::post('login', [AuthController::class, 'login']);
    });

    // --------------------------------------------
    // Public (GET only)
    // --------------------------------------------
    // Categorías
    Route::get('categorias', [CategoriaController::class, 'index']);
    Route::get('categorias/{categoria}', [CategoriaController::class, 'show']);

    // Productos
    Route::get('productos', [ProductoController::class, 'index']);
    Route::get('productos/{producto}', [ProductoController::class, 'show']);

    // Ubicaciones
    Route::get('ubicaciones', [UbicacionController::class, 'index']);
    Route::get('ubicaciones/{ubicacion}', [UbicacionController::class, 'show']);

    // Tipos de categoría
    Route::get('categoria-tipos', [CategoriaTipoController::class, 'index']);
    Route::get('categoria-tipos/{tipo}', [CategoriaTipoController::class, 'show']);
    Route::get('categorias/{categoria}/tipos', [CategoriaTipoController::class, 'byCategoria']);

    // Promociones (public read)
    Route::get('promociones', [PromocionPrecioController::class, 'index']);
    Route::get('promociones/{promocion}', [PromocionPrecioController::class, 'show']);

    // Promo aplicable por producto (public)
    Route::get('productos/{producto}/promocion-aplicable', [PromocionPrecioController::class, 'aplicablePorProducto']);


    // --------------------------------------------
    // Protected (JWT)
    // --------------------------------------------
    Route::middleware('auth:api')->group(function () {

        // Auth protected
        Route::prefix('auth')->group(function () {
            Route::get('me', [AuthController::class, 'me']);
            Route::post('logout', [AuthController::class, 'logout']);
        });

        // Categorías (write)
        Route::post('categorias', [CategoriaController::class, 'store']);
        Route::put('categorias/{categoria}', [CategoriaController::class, 'update']);
        Route::delete('categorias/{categoria}', [CategoriaController::class, 'destroy']);

        // Productos (write)
        Route::post('productos', [ProductoController::class, 'store']);
        Route::put('productos/{producto}', [ProductoController::class, 'update']);
        Route::delete('productos/{producto}', [ProductoController::class, 'destroy']);

        // Ubicaciones (write)
        Route::post('ubicaciones', [UbicacionController::class, 'store']);
        Route::put('ubicaciones/{ubicacion}', [UbicacionController::class, 'update']);
        Route::delete('ubicaciones/{ubicacion}', [UbicacionController::class, 'destroy']); // desactivación lógica
        Route::delete('ubicaciones/{ubicacion}/force', [UbicacionController::class, 'forceDestroy']); // eliminación física

        // StockUbicacion (estado) - protegido
        Route::get('stock', [StockUbicacionController::class, 'index']);
        Route::get('stock/{stock}', [StockUbicacionController::class, 'show']);

        // Inventario (acciones + consultas) - protegido
        Route::prefix('inventario')->group(function () {
            Route::post('entradas', [InventarioController::class, 'entrada']);
            Route::post('salidas', [InventarioController::class, 'salida']);
            Route::post('traslados', [InventarioController::class, 'traslado']);
            Route::post('ajustes', [InventarioController::class, 'ajuste']);

            Route::get('stock', [InventarioController::class, 'stock']);
            Route::get('movimientos', [InventarioController::class, 'movimientos']);
        });

        // Tipos de categoría (write)
        Route::post('categoria-tipos', [CategoriaTipoController::class, 'store']);
        Route::put('categoria-tipos/{tipo}', [CategoriaTipoController::class, 'update']);
        Route::delete('categoria-tipos/{tipo}', [CategoriaTipoController::class, 'destroy']); // lógico

         // Promociones (write)
        Route::post('promociones', [PromocionPrecioController::class, 'store']);
        Route::put('promociones/{promocion}', [PromocionPrecioController::class, 'update']);
        Route::delete('promociones/{promocion}', [PromocionPrecioController::class, 'destroy']);
    });
});
