<?php

namespace App\Http\Requests\CategoriaTipo;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\CategoriaTipo;

class UpdateCategoriaTipoRequest extends FormRequest
{
    public function rules(): array
    {
        $routeParam = $this->route('tipo');

        $idTipo = $routeParam instanceof CategoriaTipo
            ? $routeParam->id_tipo
            : (int) $routeParam;

        return [
            'id_categoria' => ['required', 'integer', 'exists:categorias,id_categoria'],

            'nombre_tipo' => [
                'required',
                'string',
                'max:100',
                // único por categoría, excluyendo el registro actual
                Rule::unique('categoria_tipos', 'nombre_tipo')
                    ->where(fn ($q) => $q->where('id_categoria', $this->input('id_categoria')))
                    ->ignore($idTipo, 'id_tipo'),
            ],

            'activo' => ['nullable', 'boolean'],
        ];
    }
}
