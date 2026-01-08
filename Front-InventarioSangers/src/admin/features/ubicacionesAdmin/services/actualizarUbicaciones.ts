import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { CreateUbicacionRequest, UbicacionResponse } from '../schemas/Inferface';

export const actualizarUbicacionService = async (
    id_ubicacion: number,
    data: CreateUbicacionRequest
): Promise<UbicacionResponse> => {
    const response = await axiosWithoutMultipart.put<UbicacionResponse>(
        `ubicaciones/${id_ubicacion}`,
        data
    );
    return response.data;
};
