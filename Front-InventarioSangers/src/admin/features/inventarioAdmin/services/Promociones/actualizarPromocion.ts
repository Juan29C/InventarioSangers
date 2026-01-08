import { axiosWithoutMultipart } from '../../../../../api/axiosInstance';
import type { UpdatePromocionRequest, PromocionResponse } from '../../schema/Interface';

export const actualizarPromocionService = async (id_promo: number, data: UpdatePromocionRequest): Promise<PromocionResponse> => {
    const response = await axiosWithoutMultipart.put<PromocionResponse>(`promociones/${id_promo}`, data);
    return response.data;
};
