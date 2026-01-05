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
        Schema::create('categoria_tipos', function (Blueprint $table) {
            $table->increments('id_tipo');

            $table->unsignedInteger('id_categoria');
            $table->string('nombre_tipo', 100);
            $table->boolean('activo')->default(true);

            $table->foreign('id_categoria')
                ->references('id_categoria')
                ->on('categorias')
                ->onDelete('cascade');

            $table->timestamps();

            // Evita tipos duplicados dentro de una misma categoría
            $table->unique(['id_categoria', 'nombre_tipo']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categoria_tipos');
    }
};
