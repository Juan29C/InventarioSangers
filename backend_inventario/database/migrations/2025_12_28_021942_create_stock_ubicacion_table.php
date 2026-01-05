<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('stock_ubicacion', function (Blueprint $table) {
            $table->increments('id_stock');

            $table->unsignedInteger('id_producto');
            $table->unsignedInteger('id_ubicacion');
            $table->integer('cantidad')->default(0);

            $table->unique(['id_producto', 'id_ubicacion']);

            $table->foreign('id_producto')
                ->references('id_producto')->on('productos')
                ->onDelete('cascade');

            $table->foreign('id_ubicacion')
                ->references('id_ubicacion')->on('ubicaciones')
                ->onDelete('cascade');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_ubicacion');
    }
};
