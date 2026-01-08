import { axiosWithoutMultipart } from '../../../../../api/axiosInstance';
import type { CreatePromocionRequest, PromocionResponse } from '../../schema/Interface';

export const crearPromocionService = async (data: CreatePromocionRequest): Promise<PromocionResponse> => {
    const response = await axiosWithoutMultipart.post<PromocionResponse>('promociones', data);
    return response.data;
};
