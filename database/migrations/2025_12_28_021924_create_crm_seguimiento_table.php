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
        Schema::create('crm_seguimiento', function (Blueprint $table) {
            $table->increments('id_prospecto');

            $table->unsignedInteger('id_cliente')->nullable();
            $table->enum('estado', ['Sin Informacion', 'Interesado', 'Contactado', 'Cliente Cerrado'])
                ->default('Sin Informacion');
            $table->text('notas')->nullable();

            $table->timestamp('ultima_actualizacion')->nullable()->useCurrent()->useCurrentOnUpdate();

            $table->foreign('id_cliente')->references('id_cliente')->on('clientes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('crm_seguimiento');
    }
};
