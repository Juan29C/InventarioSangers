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
        Schema::create('certificados', function (Blueprint $table) {
            $table->increments('id_certificado');

            $table->unsignedInteger('id_venta')->nullable();
            $table->string('numero_certificado', 50)->nullable()->unique();
            $table->date('fecha_emision')->nullable();
            $table->string('responsable_firma', 100)->nullable();
            $table->enum('estado_proceso', ['Pendiente', 'Impreso', 'Entregado'])->default('Pendiente');
            $table->date('fecha_entrega_real')->nullable();
            $table->string('link_pdf', 255)->nullable();

            $table->foreign('id_venta')->references('id_venta')->on('ventas');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('certificados');
    }
};
