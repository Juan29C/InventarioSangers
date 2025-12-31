<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('movimientos', function (Blueprint $table) {
            $table->increments('id_movimiento');

            $table->unsignedInteger('id_producto');
            $table->unsignedInteger('id_ubicacion');

            $table->enum('tipo', ['entrada', 'salida']);
            $table->integer('cantidad');

            $table->string('motivo', 150)->nullable();
            $table->string('referencia', 100)->nullable();

            $table->timestamp('created_at')->useCurrent();

            $table->foreign('id_producto')
                ->references('id_producto')
                ->on('productos')
                ->onDelete('cascade');

            $table->foreign('id_ubicacion')
                ->references('id_ubicacion')
                ->on('ubicaciones')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('movimientos');
    }
};
