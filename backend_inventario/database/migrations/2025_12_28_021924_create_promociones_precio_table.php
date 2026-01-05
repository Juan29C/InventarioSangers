<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('promociones_precio', function (Blueprint $table) {
            $table->increments('id_promo');

            $table->unsignedInteger('id_producto');
            $table->integer('cantidad_minima');          // compra mínima (>=1)
            $table->decimal('precio_oferta', 10, 2);     // precio unitario en oferta

            $table->boolean('activo')->default(true);
            $table->unsignedSmallInteger('prioridad')->default(100);

            $table->timestamps();

            $table->foreign('id_producto')
                ->references('id_producto')
                ->on('productos')
                ->cascadeOnDelete();

            $table->index(['id_producto', 'activo']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('promociones_precio');
    }
};