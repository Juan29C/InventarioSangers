import { axiosWithoutMultipart } from '../../../../../api/axiosInstance';
import type { CreateTipoRequest, TipoResponse } from '../../schemas/Interface';

export const actualizarTipoService = async (
    id_tipo: number,
    data: CreateTipoRequest
): Promise<TipoResponse> => {
    const response = await axiosWithoutMultipart.put<TipoResponse>(
        `categoria-tipos/${id_tipo}`,
        data
    );
    return response.data;
};
