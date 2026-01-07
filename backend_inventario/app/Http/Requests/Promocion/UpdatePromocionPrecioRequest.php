<?php

namespace App\Http\Requests\Promocion;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\PromocionPrecio;

class UpdatePromocionPrecioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $routeParam = $this->route('promocion'); // nombre del parámetro en la ruta

        $idPromo = $routeParam instanceof PromocionPrecio
            ? $routeParam->id_promo
            : (int) $routeParam;

        return [
            'id_producto' => ['required', 'integer', 'exists:productos,id_producto'],

            'cantidad_minima' => ['required', 'integer', 'min:1'],

            'precio_oferta' => ['required', 'numeric', 'min:0'],

            'activo' => ['nullable', 'boolean'],

            'prioridad' => ['nullable', 'integer', 'min:1', 'max:65535'],
        ];
    }
}
