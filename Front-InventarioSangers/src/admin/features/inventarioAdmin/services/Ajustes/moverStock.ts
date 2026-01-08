import { axiosWithoutMultipart } from '../../../../../api/axiosInstance';
import type { CreateTrasladoRequest, TrasladoResponse } from '../../schema/Interface';

export const moverStockService = async (data: CreateTrasladoRequest): Promise<TrasladoResponse> => {
    const response = await axiosWithoutMultipart.post<TrasladoResponse>('inventario/traslados', data);
    return response.data;
};
