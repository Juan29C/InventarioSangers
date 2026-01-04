<?php

namespace App\Http\Requests\Ubicacion;

use Illuminate\Foundation\Http\FormRequest;

class StoreUbicacionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre_ubicacion' => [
                'required',
                'string',
                'max:100',
                'unique:ubicaciones,nombre_ubicacion'
            ],
        ];
    }
}
