<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CategoriaTipo extends Model
{
    use HasFactory;

    protected $table = 'categoria_tipos';
    protected $primaryKey = 'id_tipo';
    public $timestamps = true;

    protected $fillable = [
        'id_categoria',
        'nombre_tipo',
        'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
    ];

    /**
     * Relación: Tipo pertenece a una Categoría
     */
    public function categoria()
    {
        return $this->belongsTo(
            Categoria::class,
            'id_categoria',
            'id_categoria'
        );
    }
    public function tipo()
    {
        return $this->belongsTo(
            CategoriaTipo::class,
            'id_tipo',
            'id_tipo'
        );
    }
    public function productos()
    {
        return $this->hasMany(
            Producto::class,
            'id_tipo',
            'id_tipo'
        );
    }
        public function getRouteKeyName()
    {
        return 'id_tipo';
    }
    
}
