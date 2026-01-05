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

        /** @var Producto|null $producto */
        $producto = $routeParam instanceof Producto ? $routeParam : null;

        $idProducto = $producto ? $producto->id_producto : (int) $routeParam;

        return [
            'sku' => ['sometimes', 'nullable', 'string', 'max:50', "unique:productos,sku,{$idProducto},id_producto"],

            'nombre' => ['sometimes', 'required', 'string', 'max:100'],
            'descripcion' => ['sometimes', 'nullable', 'string'],

            'precio_compra' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'precio_venta_unitario' => ['sometimes', 'required', 'numeric', 'min:0'],

            'stock_minimo' => ['sometimes', 'nullable', 'integer', 'min:0'],

            'id_categoria' => ['sometimes', 'nullable', 'integer', 'exists:categorias,id_categoria'],
            'activo' => ['sometimes', 'nullable', 'boolean'],

            'id_tipo' => [
                'sometimes',
                'nullable',
                'integer',
                'exists:categoria_tipos,id_tipo',
                function ($attribute, $value, $fail) use ($producto) {

                    // Categoría final = la que viene en request, o la actual del producto
                    $idCategoria = $this->has('id_categoria')
                        ? $this->input('id_categoria')
                        : ($producto?->id_categoria);

                    // Si no hay categoría final, no debe haber tipo
                    if (!$idCategoria) {
                        if ($this->filled('id_tipo')) {
                            $fail('No se puede asignar un tipo sin categoría.');
                        }
                        return;
                    }

                    // ¿La categoría final tiene tipos activos?
                    $categoriaTieneTipos = CategoriaTipo::where('id_categoria', $idCategoria)
                        ->where('activo', true)
                        ->exists();

                    // Solo exigimos tipo si el update está tocando categoría o tipo
                    $tocandoCategoriaOTipo = $this->has('id_categoria') || $this->has('id_tipo');

                    if ($categoriaTieneTipos && $tocandoCategoriaOTipo) {
                        if (!$this->filled('id_tipo')) {
                            $fail('El tipo es obligatorio para esta categoría.');
                            return;
                        }

                        // Validar pertenencia tipo->categoría
                        $tipoPertenece = CategoriaTipo::where('id_tipo', $this->input('id_tipo'))
                            ->where('id_categoria', $idCategoria)
                            ->exists();

                        if (!$tipoPertenece) {
                            $fail('El tipo seleccionado no pertenece a la categoría indicada.');
                        }
                    }

                    if (! $categoriaTieneTipos) {
                        // Si la categoría no usa tipos, no debe enviarse id_tipo (si lo están tocando)
                        if ($this->filled('id_tipo')) {
                            $fail('Esta categoría no usa tipos.');
                        }
                    }
                },
            ],
        ];
    }
}
