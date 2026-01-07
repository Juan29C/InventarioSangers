import { axiosWithoutMultipart } from '../../../../../api/axiosInstance';
import type { CreateSalidaRequest, SalidaResponse } from '../../schema/Interface';

export const registrarSalidaService = async (data: CreateSalidaRequest): Promise<SalidaResponse> => {
    const response = await axiosWithoutMultipart.post<SalidaResponse>('inventario/salidas', data);
    return response.data;
};
