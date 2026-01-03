<?php

namespace App\Http\Requests\Producto;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\CategoriaTipo;

class StoreProductoRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'sku' => ['nullable', 'string', 'max:50', 'unique:productos,sku'],
            'nombre' => ['required', 'string', 'max:100'],
            'descripcion' => ['nullable', 'string'],
            'precio_compra' => ['nullable', 'numeric', 'min:0'],
            'precio_venta_unitario' => ['required', 'numeric', 'min:0'],
            'stock_minimo' => ['nullable', 'integer', 'min:0'],

            'id_categoria' => ['nullable', 'integer', 'exists:categorias,id_categoria'],

            // NUEVO: tipo (condicional)
            'id_tipo' => [
                'nullable',
                'integer',
                'exists:categoria_tipos,id_tipo',
                function ($attribute, $value, $fail) {
                    $idCategoria = $this->input('id_categoria');

                    // Si no hay categoría, no debe haber tipo
                    if (!$idCategoria) {
                        if ($value) {
                            $fail('No se puede asignar un tipo sin categoría.');
                        }
                        return;
                    }

                    // ¿La categoría tiene tipos activos?
                    $categoriaTieneTipos = CategoriaTipo::where('id_categoria', $idCategoria)
                        ->where('activo', true)
                        ->exists();

                    if ($categoriaTieneTipos) {
                        // Si tiene tipos, el id_tipo es obligatorio
                        if (!$value) {
                            $fail('El tipo es obligatorio para esta categoría.');
                            return;
                        }

                        // Validar que el tipo pertenezca a la categoría
                        $tipoPertenece = CategoriaTipo::where('id_tipo', $value)
                            ->where('id_categoria', $idCategoria)
                            ->exists();

                        if (!$tipoPertenece) {
                            $fail('El tipo seleccionado no pertenece a la categoría indicada.');
                        }
                    } else {
                        // Si no tiene tipos, no debe enviarse id_tipo
                        if ($value) {
                            $fail('Esta categoría no usa tipos.');
                        }
                    }
                },
            ],

            'activo' => ['nullable', 'boolean'],
        ];
    }
}
