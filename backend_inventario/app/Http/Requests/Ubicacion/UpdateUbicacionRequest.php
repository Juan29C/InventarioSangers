<?php

namespace App\Http\Requests\Ubicacion;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Ubicacion;

class UpdateUbicacionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $routeParam = $this->route('ubicacion');

        $idUbicacion = $routeParam instanceof Ubicacion
            ? $routeParam->id_ubicacion
            : (int) $routeParam;

        return [
            'nombre_ubicacion' => [
                'required',
                'string',
                'max:100',
                "unique:ubicaciones,nombre_ubicacion,{$idUbicacion},id_ubicacion",
            ],

            // Opcional si quieres permitir reactivar/desactivar desde update:
            // 'activo' => ['sometimes', 'boolean'],
        ];
    }
}
