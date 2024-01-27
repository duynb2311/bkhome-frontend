import { useMutation } from 'react-query';
import { apiBaseUrl } from '../constant/constant';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * A custom hook that uses the useMutation hook from react-query to perform a login operation.
 * @param {(((data: boolean, variables: void, context: unknown) => void | Promise<unknown>) | undefined)?} onSuccess - A callback function to be called on successful login.
 * @param {(((error: unknown, variables: void, context: unknown) => void | Promise<unknown>) | undefined)?} onError - A callback function to be called if an error occurs during login.
 * @returns {Object} - The mutation object returned by the useMutation hook.
 */
export const useLogin = ({ onSuccess, onError }) => {
    const { login, logout } = useContext(AuthContext);

    const mutation = useMutation({
        mutationFn: async (authData) => {
            const { username, password } = authData;
            if (!username || !password) return false;

            const authResult = await axios.post(`${apiBaseUrl}/auth/login`, { username, password });
            if (authResult.status >= 400) return false;

            const accessToken = authResult.data.accessToken;
            const userResult = await axios.get(`${apiBaseUrl}/auth/profile`, {
                params: {
                    Authorization: `${accessToken}`,
                },
            });
            if (userResult.status >= 400) return false;
            if (userResult.data.length === 0) return false;

            const userInfo = await axios.get(`${apiBaseUrl}/auth/user/info?id=${userResult.data}`, {
                params: {
                    Authorization: `${accessToken}`,
                },
            });

            const user = userInfo.data;
            login(user, accessToken, username);
            return true;
        },
        onSuccess,
        onError,
    });

    return mutation;
};

export const useLogout = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: async () => {
            logout();
            navigate('/');
            window.location.reload()
        },
    });

    return mutation;
};
