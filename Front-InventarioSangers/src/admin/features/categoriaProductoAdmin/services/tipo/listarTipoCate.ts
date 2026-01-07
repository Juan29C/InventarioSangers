import { axiosWithoutMultipart } from '../../../../../api/axiosInstance';
import type { TipoResponse } from '../../schemas/Interface';

export const listarTiposService = async (): Promise<TipoResponse[]> => {
    const response = await axiosWithoutMultipart.get<TipoResponse[]>('categoria-tipos');
    return response.data;
};
