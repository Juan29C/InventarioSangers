<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'nombres' => ['required','string','max:100'],
            'apellidos' => ['required','string','max:100'],
            'email' => ['required','email','unique:usuarios'],
            'password' => ['required','string','min:6'],
            'telefono' => ['nullable','string','max:30'],
            'rol' => ['required','in:admin,trabajador'],
        ]);

        $user = Usuario::create([
            'nombres' => $data['nombres'],
            'apellidos' => $data['apellidos'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'telefono' => $data['telefono'] ?? null,
            'rol' => $data['rol'],
        ]);

        
        $token = Auth::guard('api')->login($user);  

        return response()->json([
            'usuario' => $user,
            'token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required','email'],
            'password' => ['required','string'],
        ]);

        if (! $token = Auth::guard('api')->attempt([
            'email' => $credentials['email'],
            'password' => $credentials['password'],
        ])) {
            return response()->json(['message' => 'Credenciales inválidas'], 401);
        }

        return response()->json([
            'usuario' => auth('api')->user(),
            'token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    public function me()
    {
        return response()->json(auth('api')->user());
    }

    public function logout()
    {
        Auth::guard('api')->logout();
        return response()->json(['message' => 'Sesión cerrada']);
    }
}
