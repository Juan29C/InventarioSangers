import { axiosWithoutMultipart } from '../../../../../api/axiosInstance';
import type { CreateEntradaRequest, EntradaResponse } from '../../schema/Interface';

export const registrarEntradaService = async (data: CreateEntradaRequest): Promise<EntradaResponse> => {
    const response = await axiosWithoutMultipart.post<EntradaResponse>('inventario/entradas', data);
    return response.data;
};
