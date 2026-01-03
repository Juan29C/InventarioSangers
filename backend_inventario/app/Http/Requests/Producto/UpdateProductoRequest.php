<?php

namespace App\Http\Requests\Producto;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\CategoriaTipo;
use App\Models\Producto;

class UpdateProductoRequest extends FormRequest
{
    public function rules(): array
    {
        $routeParam = $this->route('producto');

        $idProducto = $routeParam instanceof Producto
            ? $routeParam->id_producto
            : (int) $routeParam;

        return [
            'sku' => ['nullable', 'string', 'max:50', "unique:productos,sku,{$idProducto},id_producto"],
            'nombre' => ['required', 'string', 'max:100'],
            'descripcion' => ['nullable', 'string'],
            'precio_compra' => ['nullable', 'numeric', 'min:0'],
            'precio_venta_unitario' => ['required', 'numeric', 'min:0'],
            'stock_minimo' => ['nullable', 'integer', 'min:0'],

            'id_categoria' => ['nullable', 'integer', 'exists:categorias,id_categoria'],

            // NUEVO: tipo (condicional)
            'id_tipo' => [
                'nullable',
                'integer',
                'exists:categoria_tipos,id_tipo',
                function ($attribute, $value, $fail) {
                    $idCategoria = $this->input('id_categoria');

                    // Si no se manda id_categoria, tomamos la actual del producto (para no romper updates parciales)
                    if (!$idCategoria) {
                        $producto = $this->route('producto');
                        if ($producto instanceof Producto) {
                            $idCategoria = $producto->id_categoria;
                        }
                    }

                    // Si no hay categoría, no debe haber tipo
                    if (!$idCategoria) {
                        if ($value) {
                            $fail('No se puede asignar un tipo sin categoría.');
                        }
                        return;
                    }

                    $categoriaTieneTipos = CategoriaTipo::where('id_categoria', $idCategoria)
                        ->where('activo', true)
                        ->exists();

                    if ($categoriaTieneTipos) {
                        if (!$value) {
                            $fail('El tipo es obligatorio para esta categoría.');
                            return;
                        }

                        $tipoPertenece = CategoriaTipo::where('id_tipo', $value)
                            ->where('id_categoria', $idCategoria)
                            ->exists();

                        if (!$tipoPertenece) {
                            $fail('El tipo seleccionado no pertenece a la categoría indicada.');
                        }
                    } else {
                        if ($value) {
                            $fail('Esta categoría no usa tipos.');
                        }
                    }
                },
            ],

            'activo' => ['nullable', 'boolean'],
        ];
    }
}
