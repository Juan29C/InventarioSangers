<?php

namespace App\Http\Requests\Categoria;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Categoria;

class UpdateCategoriaRequest extends FormRequest
{
    public function rules(): array
    {
        $routeParam = $this->route('categoria');

        $idCategoria = $routeParam instanceof Categoria
            ? $routeParam->id_categoria
            : (int) $routeParam;

        return [
            'nombre_categoria' => [
                'required',
                'string',
                'max:50',
                "unique:categorias,nombre_categoria,{$idCategoria},id_categoria"
            ],
        ];
    }
}