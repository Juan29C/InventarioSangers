<?php

namespace App\Http\Requests\CategoriaTipo;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCategoriaTipoRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'id_categoria' => ['required', 'integer', 'exists:categorias,id_categoria'],

            'nombre_tipo' => [
                'required',
                'string',
                'max:100',
                // único por categoría
                Rule::unique('categoria_tipos', 'nombre_tipo')
                    ->where(fn ($q) => $q->where('id_categoria', $this->input('id_categoria'))),
            ],

            'activo' => ['nullable', 'boolean'],
        ];
    }
}
