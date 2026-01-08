import { axiosWithoutMultipart } from '../../../../api/axiosInstance';

export const eliminarUbicacionService = async (id_ubicacion: number): Promise<void> => {
    await axiosWithoutMultipart.delete(`ubicaciones/${id_ubicacion}`);
};
