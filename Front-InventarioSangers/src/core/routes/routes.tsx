import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { LazyWrapper } from './components/LazyWrapper';
import { ProtectedRoute } from './guard/ProtectedRoute';
import { AdminLayout } from '../../layout/components/AdminLayout';


const LoginForm = lazy(() =>
  import('../components/auth/LoginForm').then((module) => ({ default: module.LoginForm }))
);

// Lazy loading de las páginas administrativas
const DashboardAdmin = lazy(() =>
  import('../../admin/features/dashboardAdmin/pages/DashboardAdmin').then((module) => ({ default: module.default }))
);

const InventarioAdmin = lazy(() =>
  import('../../admin/features/inventarioAdmin/pages/InventarioAdmin').then((module) => ({ default: module.default }))
);

const UsuariosAdmin = lazy(() =>
  import('../../admin/features/usuariosAdmin/pages/UsuariosAdmin').then((module) => ({ default: module.default }))
);

const CronogramaAdmin = lazy(() =>
  import('../../admin/features/cronogramaAdmin/pages/CronogramaAdmin').then((module) => ({ default: module.default }))
);

const CrmAdmin = lazy(() =>
  import('../../admin/features/crmAdmin/pages/CrmAdmin').then((module) => ({ default: module.default }))
);

const ExtintoresAdmin = lazy(() =>
  import('../../admin/features/extintoresAdmin/pages/ExtintoresAdmin').then((module) => ({ default: module.default }))
);

const UbicacionesAdmin = lazy(() =>
  import('../../admin/features/ubicacionesAdmin/pages/UbicacionesAdmin').then((module) => ({ default: module.default }))
);

const ServiciosAdmin = lazy(() =>
  import('../../admin/features/serviciosAdmin/pages/ServiciosAdmin').then((module) => ({ default: module.default }))
);

const TipoServiciosAdmin = lazy(() =>
  import('../../admin/features/tipoServicioAdmin/pages/TipoServiciosAdmin').then((module) => ({ default: module.default }))
);
const VentasAdmin = lazy (() =>
  import('../../admin/features/ventasAdmin/pages/VentasAdmin').then((module) => ({ default: module.default }))
);

export const routes = [
  // Ruta principal - Página de login (vista principal)
  {
    path: '/',
    element: (
      <LazyWrapper>
        <LoginForm />
      </LazyWrapper>
    ),
  },



  // Login - Página de autenticación para administradores (ruta alternativa)
  {
    path: '/admin',
    element: (
      <LazyWrapper>
        <LoginForm />
      </LazyWrapper>
    ),
  },

  // Administrator - Vista para administradores (protegida)
  {
    path: '/administrator',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/administrator/dashboard" replace />,
      },
      // Gestión de Contenido
      {
        path: 'dashboard',
        element: (
          <LazyWrapper>
            <DashboardAdmin />
          </LazyWrapper>
        ),
      },
      {
        path: 'inventario/productos',
        element: (
          <LazyWrapper>
            <InventarioAdmin />
          </LazyWrapper>
        ),
      },
      {
        path: 'operaciones',
        element: (
          <LazyWrapper>
            <VentasAdmin />
          </LazyWrapper>
        ),
      },
      {
        path: 'usuarios',
        element: (
          <LazyWrapper>
            <UsuariosAdmin />
          </LazyWrapper>
        ),
      },
      {
        path: 'servicios/cronograma',
        element: (
          <LazyWrapper>
            <CronogramaAdmin />
          </LazyWrapper>
        ),
      },
      {
        path: 'servicios/historial',
        element: (
          <LazyWrapper>
            <ServiciosAdmin />
          </LazyWrapper>
        ),
      },
      {
        path: 'extintores',
        element: (
          <LazyWrapper>
            <ExtintoresAdmin />
          </LazyWrapper>
        ),
      },
      {
        path: 'inventario/ubicaciones',
        element: (
          <LazyWrapper>
            <UbicacionesAdmin />
          </LazyWrapper>
        ),
      },
      {
        path: 'servicios/tipos',
        element: (
          <LazyWrapper>
            <TipoServiciosAdmin />
          </LazyWrapper>
        ),
      },
      {
        path: 'crm',
        element: (
          <LazyWrapper>
            <CrmAdmin />
          </LazyWrapper>
        ),
      }
    ],
  },

  // Ruta 404 - Página no encontrada
  {
    path: '/404',
    element: (
      <div className='flex items-center justify-center min-h-screen p-6 bg-gray-50'>
        <div className='w-full max-w-md p-8 text-center bg-white shadow-lg rounded-xl'>
          <div className='flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full'>
            <svg className='w-10 h-10 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z'
              />
            </svg>
          </div>
          <h1 className='mb-2 text-4xl font-bold text-gray-900'>404</h1>
          <h2 className='mb-4 text-xl font-semibold text-gray-700'>Página no encontrada</h2>
          <p className='mb-6 text-gray-600'>La página que buscas no existe</p>
          <a
            href='/'
            className='inline-flex items-center px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700'>
            <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 19l-7-7m0 0l7-7m-7 7h18' />
            </svg>
            Volver al inicio
          </a>
        </div>
      </div>
    ),
  },

  // Catch all - Redirige a 404
  {
    path: '*',
    element: <Navigate to="/404" replace />,
  },
];
