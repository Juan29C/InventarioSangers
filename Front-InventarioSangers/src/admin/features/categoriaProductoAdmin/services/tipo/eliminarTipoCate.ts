import { axiosWithoutMultipart } from '../../../../../api/axiosInstance';

export const eliminarTipoService = async (id_tipo: number): Promise<void> => {
    await axiosWithoutMultipart.delete(`categoria-tipos/${id_tipo}`);
};
