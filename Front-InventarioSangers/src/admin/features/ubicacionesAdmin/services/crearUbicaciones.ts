import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { CreateUbicacionRequest, UbicacionResponse } from '../schemas/Inferface';

export const crearUbicacionService = async (data: CreateUbicacionRequest): Promise<UbicacionResponse> => {
    const response = await axiosWithoutMultipart.post<UbicacionResponse>('ubicaciones', data);
    return response.data;
};
