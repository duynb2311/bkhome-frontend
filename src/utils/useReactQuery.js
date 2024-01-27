import { useMutation, useQuery, useQueryClient } from 'react-query';
import { api } from './api';

/**
 * A custom hook that uses the useQuery hook from react-query to fetch data from a given URL and parameters using a custom fetcher function.
 * @param {string | null} url - The URL to fetch the data from.
 * @param {Object} params - The parameters to use in the fetch request.
 * @param {UseQueryOptions<T, Error, T, QueryKeyT>} config - Additional configuration options for the useQuery hook.
 * @returns {Object} - The context object returned by the useQuery hook.
 */
export const useFetch = (url, params, config) => {
    const context = useQuery([url, params], ({ queryKey }) => fetcher({ queryKey }), {
        enabled: !!url,
        ...config,
    });

    return context;
};

/**
 *
 * @param {QueryFunctionContext<QueryKeyT>} param0
 * @returns Promise<T>
 */
export const fetcher = ({ queryKey, pageParam }) => {
    const [url, params] = queryKey;
    return api.get(url, { params: { ...params, pageParam } }).then((res) => res.data);
};

/**
 * A custom hook that wraps the useMutation hook from the React Query library.
 * This hook cancels any in-flight queries with the same URL and parameters, updates the query data with the new data,
 * invalidates the query cache, and handles any errors that occur during the mutation.
 *
 * @param {(data: T | S) => Promise<AxiosResponse<S>>} func - The mutation function to call.
 * @param {string} url - The URL for the mutation.
 * @param {object?} params - The parameters for the mutation.
 * @param {((oldData: T, newData: S) => T) | undefined} updater - The function used to update the query data.
 * @returns
 */
const useGenericMutation = (func, url, params, updater) => {
    const queryClient = useQueryClient();

    return useMutation(func, {
        onMutate: async (data) => {
            // Cancels any in-flight queries with the same URL and parameters
            await queryClient.cancelQueries([url, params]);

            // Retrieves the previous query data using and saves it to a variable.
            const previousData = queryClient.getQueryData([url, params]);

            // Sets the query data
            // The second argument to setQueryData is a callback function that updates the query data based on the previous data and the new data.
            // If an updater function is provided to the useGenericMutation hook, it is used in this callback to update the data.
            queryClient.setQueryData([url, params], (oldData) => {
                return updater ? updater(oldData, data) : data;
            });

            return previousData;
        },
        onError: (err, _, context) => {
            queryClient.setQueryData([url, params], context);
        },
        onSettled: () => {
            queryClient.invalidateQueries([url, params]);
        },
    });
};

/**
 * This is a generic hook for delete request
 * @param {string} url
 * @param {object?} params
 * @param {((oldData: T, id: string | number) => T) | undefined} updater
 */
export const useDelete = (url, params, updater) => {
    return useGenericMutation((id) => api.delete(`${url}/${id}`), url, params, updater);
};

/**
 * This is a generic hook for post request
 * @param {string} url
 * @param {object?} params
 * @param {((oldData: T, newData: S) => T)?} updater
 * @returns
 */
export const usePost = (url, params, updater) => {
    return useGenericMutation((data) => api.post(url, data), url, params, updater);
};

/**
 * This is a generic hook for put request
 * @param {string} url
 * @param {object?} params
 * @param {((oldData: T, newData: S) => T)?} updater
 * @returns
 */
export const useUpdate = (url, params, updater) => {
    return useGenericMutation((data) => api.patch(url, data), url, params, updater);
};
