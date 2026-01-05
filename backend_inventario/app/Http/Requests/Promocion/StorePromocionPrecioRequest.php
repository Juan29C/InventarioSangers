<?php

namespace App\Http\Requests\Promocion;

use Illuminate\Foundation\Http\FormRequest;

class StorePromocionPrecioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id_producto' => ['required', 'integer', 'exists:productos,id_producto'],

            'cantidad_minima' => ['required', 'integer', 'min:1'],

            'precio_oferta' => ['required', 'numeric', 'min:0'],

            'activo' => ['nullable', 'boolean'],

            'prioridad' => ['nullable', 'integer', 'min:1', 'max:65535'],
        ];
    }
}
