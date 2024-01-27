export const apiBaseUrl = 'https://bkhome-backend.azurewebsites.net/api/v1';

export const getApiResponseData = (result) => {
    const { isError, isIdle, error } = result;
    if (isError) throw new Error('Error fetching data: ' + error);
    if (isIdle) throw new Error('Timeout fetching data');

    return result?.data;
};
