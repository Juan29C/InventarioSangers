import { axiosWithoutMultipart } from '../../../../api/axiosInstance';

export const eliminarCategoriaService = async (id_categoria: number): Promise<void> => {
    await axiosWithoutMultipart.delete(`categorias/${id_categoria}`);
};
