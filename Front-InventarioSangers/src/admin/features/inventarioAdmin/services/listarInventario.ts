import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { ProductoResponse } from '../schema/Interface';

export const listarProductosService = async (): Promise<ProductoResponse[]> => {
    const response = await axiosWithoutMultipart.get<ProductoResponse[]>('productos');
    return response.data;
};
