<?php

namespace App\Http\Requests\Inventario;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TrasladoRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'id_producto' => [
                'required',
                'integer',
                Rule::exists('productos', 'id_producto')->where('activo', true),
            ],
            'id_ubicacion_origen' => [
                'required',
                'integer',
                Rule::exists('ubicaciones', 'id_ubicacion')->where('activo', true),
                'different:id_ubicacion_destino',
            ],
            'id_ubicacion_destino' => [
                'required',
                'integer',
                Rule::exists('ubicaciones', 'id_ubicacion')->where('activo', true),
                'different:id_ubicacion_origen',
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
            'id_ubicacion_origen.exists' => 'La ubicación origen no existe o está desactivada.',
            'id_ubicacion_destino.exists' => 'La ubicación destino no existe o está desactivada.',
            'id_ubicacion_origen.different' => 'La ubicación origen y destino no pueden ser la misma.',
            'cantidad.min' => 'La cantidad debe ser mayor a 0.',
        ];
    }
}
