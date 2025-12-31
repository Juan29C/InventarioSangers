<?php

namespace App\Http\Requests\Producto;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductoRequest extends FormRequest
{
    public function rules(): array
    {
        $id = $this->route('producto');

        return [
            'sku' => ['nullable', 'string', 'max:50', "unique:productos,sku,$id,id_producto"],
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
