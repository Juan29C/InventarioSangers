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
        Schema::create('productos', function (Blueprint $table) {
            $table->increments('id_producto');

            $table->string('sku', 50)->nullable()->unique();
            $table->string('nombre', 100);
            $table->text('descripcion')->nullable();
            $table->decimal('precio_compra', 10, 2)->nullable();
            $table->decimal('precio_venta_unitario', 10, 2);

            $table->integer('stock_minimo')->default(5);
            $table->boolean('activo')->default(true);

            // Categoría (opcional)
            $table->unsignedInteger('id_categoria')->nullable();
            $table->foreign('id_categoria')
                ->references('id_categoria')
                ->on('categorias')
                ->nullOnDelete(); // ON DELETE SET NULL

            // Tipo de categoría (opcional)
            $table->unsignedInteger('id_tipo')->nullable();
            $table->foreign('id_tipo')
                ->references('id_tipo')
                ->on('categoria_tipos')
                ->nullOnDelete(); // ON DELETE SET NULL

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('productos');
    }
};