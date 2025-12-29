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
        Schema::create('seguimiento_extintores', function (Blueprint $table) {
            $table->increments('id_seguimiento');

            $table->unsignedInteger('id_venta')->nullable();
            $table->unsignedInteger('id_cliente')->nullable();
            $table->unsignedInteger('id_producto')->nullable();
            $table->unsignedInteger('id_tecnico')->nullable();

            $table->date('fecha_venta')->nullable();
            $table->enum('estado_proceso', ['Recargado', 'No Iniciado'])->default('No Iniciado');
            $table->date('fecha_recarga_anual')->nullable();
            $table->integer('frecuencia_seguimiento_meses')->default(12);
            $table->date('fecha_entrega_programada')->nullable();

            $table->enum('estado_entrega_certificado', ['Pendiente', 'Entregado'])->default('Pendiente');
            $table->string('responsable_certificado', 100)->nullable();
            $table->string('direccion_servicio', 255)->nullable();

            $table->foreign('id_venta')->references('id_venta')->on('ventas');
            $table->foreign('id_cliente')->references('id_cliente')->on('clientes');
            $table->foreign('id_producto')->references('id_producto')->on('productos');
            $table->foreign('id_tecnico')->references('id_tecnico')->on('tecnicos');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('seguimiento_extintores');
    }
};
