import { axiosWithoutMultipart } from '../../../../../api/axiosInstance';
import type { CreateTipoRequest, TipoResponse } from '../../schemas/Interface';

export const crearTipoService = async (data: CreateTipoRequest): Promise<TipoResponse> => {
    const response = await axiosWithoutMultipart.post<TipoResponse>('categoria-tipos', data);
    return response.data;
};
