import { axiosWithoutMultipart } from '../../../../../api/axiosInstance';
import type { PromocionResponse } from '../../schema/Interface';

export const listarPromocionesService = async (id_producto?: number): Promise<PromocionResponse[]> => {
    const params = id_producto ? { id_producto } : {};
    const response = await axiosWithoutMultipart.get<PromocionResponse[]>('promociones', { params });
    return response.data;
};
