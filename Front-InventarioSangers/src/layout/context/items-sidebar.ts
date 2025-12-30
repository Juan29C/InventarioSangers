import {
    Box,
    Home,
    Users,
    Calendar,
    UserCog,
    Shield,
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
        titulo: 'Inventario',
        icon: Box,
        link: '/administrator/inventario',
    },
    {
        titulo: 'Usuarios',
        icon: Users,
        link: '/administrator/usuarios',
    },
    {
        titulo: 'Cronograma',
        icon: Calendar,
        link: '/administrator/cronograma',
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
