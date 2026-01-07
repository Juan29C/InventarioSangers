import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { CreateProductoRequest, ProductoResponse } from '../schema/Interface';

export const crearProductoService = async (data: CreateProductoRequest): Promise<ProductoResponse> => {
    const response = await axiosWithoutMultipart.post<ProductoResponse>('productos', data);
    return response.data;
};
