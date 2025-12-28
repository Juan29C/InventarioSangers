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
        Schema::create('clientes', function (Blueprint $table) {
            $table->increments('id_cliente');
            $table->enum('tipo_persona', ['Natural', 'Juridica']);
            $table->string('nombre_razon_social', 150);
            $table->string('apellido', 100)->nullable();
            $table->enum('tipo_documento', ['DNI', 'RUC']);
            $table->string('numero_documento', 11)->unique();
            $table->string('telefono', 15)->nullable();
            $table->string('email', 100)->nullable();
            $table->timestamp('fecha_registro')->nullable()->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clientes');
    }
};
