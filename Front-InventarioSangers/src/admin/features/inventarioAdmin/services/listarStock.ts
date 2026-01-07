import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { StockUbicacionResponse } from '../schema/Interface';

export const listarStockService = async (id_producto?: number): Promise<StockUbicacionResponse[]> => {
    const params = id_producto ? { id_producto } : {};
    const response = await axiosWithoutMultipart.get<StockUbicacionResponse[]>('inventario/stock', { params });
    return response.data;
};
