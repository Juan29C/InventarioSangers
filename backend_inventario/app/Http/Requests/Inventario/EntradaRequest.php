<?php

namespace App\Http\Requests\Inventario;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EntradaRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'id_producto' => [
                'required',
                'integer',
                Rule::exists('productos', 'id_producto')->where('activo', true),
            ],
            'id_ubicacion' => [
                'required',
                'integer',
                Rule::exists('ubicaciones', 'id_ubicacion')->where('activo', true),
            ],
            'cantidad' => ['required', 'integer', 'min:1'],

            'motivo' => ['nullable', 'string', 'max:150'],
            'referencia' => ['nullable', 'string', 'max:100'],
        ];
    }

    public function messages(): array
    {
        return [
            'id_producto.exists' => 'El producto no existe o está desactivado.',
            'id_ubicacion.exists' => 'La ubicación no existe o está desactivada.',
            'cantidad.min' => 'La cantidad debe ser mayor a 0.',
        ];
    }
}
