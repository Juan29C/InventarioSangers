import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { UbicacionResponse } from '../schemas/Inferface';

export const listarUbicacionesService = async (): Promise<UbicacionResponse[]> => {
    const response = await axiosWithoutMultipart.get<UbicacionResponse[]>('ubicaciones');
    return response.data;
};
