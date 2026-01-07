import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { CreateCategoriaRequest, CategoriaResponse } from '../schemas/Interface';

export const actualizarCategoriaService = async (
    id_categoria: number,
    data: CreateCategoriaRequest
): Promise<CategoriaResponse> => {
    const response = await axiosWithoutMultipart.put<CategoriaResponse>(
        `categorias/${id_categoria}`,
        data
    );
    return response.data;
};
