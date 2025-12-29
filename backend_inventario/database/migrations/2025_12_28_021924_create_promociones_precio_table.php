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
        Schema::create('promociones_precio', function (Blueprint $table) {
            $table->increments('id_promo');

            $table->unsignedInteger('id_producto')->nullable();
            $table->integer('cantidad_minima');
            $table->decimal('precio_oferta', 10, 2);

            $table->foreign('id_producto')->references('id_producto')->on('productos');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promociones_precio');
    }
};
