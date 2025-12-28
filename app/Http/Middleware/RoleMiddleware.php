<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = auth('api')->user(); // usuario autenticado por JWT

        if (! $user) {
            return response()->json(['message' => 'No autenticado'], 401);
        }

        // rol en tu tabla: 'admin' o 'trabajador'
        if (! in_array($user->rol, $roles, true)) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        return $next($request);
    }
}
