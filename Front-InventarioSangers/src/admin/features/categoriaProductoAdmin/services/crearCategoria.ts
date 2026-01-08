import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { CreateCategoriaRequest, CategoriaResponse } from '../schemas/Interface';

export const crearCategoriaService = async (data: CreateCategoriaRequest): Promise<CategoriaResponse> => {
    const response = await axiosWithoutMultipart.post<CategoriaResponse>('categorias', data);
    return response.data;
};
