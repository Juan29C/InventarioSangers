import {
    Box,
    Home,
    Users,
    Calendar,
    UserCog,
    Shield,
    Map,
    Briefcase,
    ClipboardList,
    LayoutGrid,
    DollarSign,
    type LucideIcon
} from 'lucide-react';

export interface MenuItem {
    titulo: string;
    icon: LucideIcon;
    link?: string;
    subMenu?: SubMenuItem[];
}

export interface SubMenuItem {
    titulo: string;
    link: string;
    icon: LucideIcon;
}

export const menuItems: MenuItem[] = [

    {
        titulo: 'Dashboard',
        icon: Home,
        link: '/administrator/dashboard',
    },
       {
        titulo: 'Gestión de Inventario', 
        icon: Briefcase,
        subMenu: [
            {
                titulo: 'Productos',
                icon: Briefcase,
                link: '/administrator/inventario/productos',
            },
            {
                titulo: 'Ubicaciones', 
                icon: Map,
                link: '/administrator/inventario/ubicaciones',
            },
            {
                titulo: 'Categorias/Tipos', 
                icon: LayoutGrid,
                link: '/administrator/inventario/categorias-tipos',
            },
        ]
    },
    {
        titulo: 'Usuarios',
        icon: Users,
        link: '/administrator/usuarios',
    },
    {
        titulo: 'Operaciones',
        icon: DollarSign,
        link: '/administrator/operaciones',
    },
    {
        titulo: 'Gestión de Servicios', // Nombre global sugerido
        icon: Briefcase,
        subMenu: [
            {
                titulo: 'Cronograma',
                icon: Calendar,
                link: '/administrator/servicios/cronograma',
            },
            {
                titulo: 'Historial de Servicios', // Reemplazo del Excel
                icon: ClipboardList,
                link: '/administrator/servicios/historial',
            },
            {
                titulo: 'Tipos de Servicio', // Para gestionar leyendas/colores
                icon: LayoutGrid,
                link: '/administrator/servicios/tipos',
            },
        ]
    },
   
    {
        titulo: 'CRM',
        icon: UserCog,
        link: '/administrator/crm',
    },
    {
        titulo: 'Extintores',
        icon: Shield,
        link: '/administrator/extintores',
    },
   
];
