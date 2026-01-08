import { axiosWithoutMultipart } from '../../../api/axiosInstance';
import type { LoginRequest, LoginResponse } from '../schemas/Interface';

export const loginService = async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosWithoutMultipart.post<LoginResponse>('auth/login', data);
    return response.data;
};
