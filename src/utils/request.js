import axios from 'axios';
import { apiBaseUrl } from '../constant/constant';
const request = axios.create({
    baseURL: apiBaseUrl,
});

export const get = async (path, options = {}) => {
    const response = await request.get(path, options);
    return response.data;
};

export const post = async (path, data = {}) => {
    const response = await request.post(path, data);
    return response;
};

export const update = async (path, data = {}) => {
    const response = await request.patch(path, data);
    return response;
};

export const remove = async (path, data = {}) => {
    const response = await request.delete(path, data);
    return response;
};

export default request;
