import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { CategoriaResponse } from '../schemas/Interface';

export const listarCategoriasService = async (): Promise<CategoriaResponse[]> => {
    const response = await axiosWithoutMultipart.get<CategoriaResponse[]>('categorias');
    return response.data;
};
