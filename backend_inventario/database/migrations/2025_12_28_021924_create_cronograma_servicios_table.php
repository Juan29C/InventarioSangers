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
        Schema::create('cronograma_servicios', function (Blueprint $table) {
            $table->increments('id_evento');

            $table->unsignedInteger('id_cliente')->nullable();
            $table->unsignedInteger('id_tecnico')->nullable();
            $table->unsignedInteger('id_seguimiento')->nullable();

            $table->string('titulo_servicio', 100)->nullable();
            $table->text('descripcion_tarea')->nullable();

            $table->date('fecha_programada');
            $table->time('hora_programada')->nullable();

            $table->enum('prioridad', ['Baja', 'Media', 'Alta'])->default('Media');
            $table->enum('estado_evento', ['Pendiente', 'En Proceso', 'Realizado', 'Cancelado'])->default('Pendiente');

            $table->foreign('id_cliente')->references('id_cliente')->on('clientes');
            $table->foreign('id_tecnico')->references('id_tecnico')->on('tecnicos');
            $table->foreign('id_seguimiento')->references('id_seguimiento')->on('seguimiento_extintores');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cronograma_servicios');
    }
};
