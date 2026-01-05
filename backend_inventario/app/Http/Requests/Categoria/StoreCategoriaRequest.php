<?php

namespace App\Http\Requests\Categoria;

use Illuminate\Foundation\Http\FormRequest;

class StoreCategoriaRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'nombre_categoria' => ['required', 'string', 'max:50', 'unique:categorias,nombre_categoria'],
        ];
    }
}
