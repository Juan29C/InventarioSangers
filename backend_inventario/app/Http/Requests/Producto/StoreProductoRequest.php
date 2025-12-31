<?php

namespace App\Http\Requests\Producto;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductoRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'sku' => ['nullable', 'string', 'max:50', 'unique:productos,sku'],
            'nombre' => ['required', 'string', 'max:100'],
            'descripcion' => ['nullable', 'string'],
            'precio_compra' => ['nullable', 'numeric', 'min:0'],
            'precio_venta_unitario' => ['required', 'numeric', 'min:0'],
            'stock_minimo' => ['nullable', 'integer', 'min:0'],
            'id_categoria' => ['nullable', 'exists:categorias,id_categoria'],
            'activo' => ['nullable', 'boolean'],
        ];
    }
}
