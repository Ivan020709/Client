import axios from 'axios';

axios.interceptors.response.use(
    (response) => {
        return response;
    },

    (error) => {

        console.error(error);

        // 에러 로그 저장
        if (error.config?.url !== '/api/admin/errorLog') {

            axios.post('/api/admin/errorLog', {
                level: 'ERROR',
                type: 'AxiosError',
                statusCode: error.response?.status || 0,
                method: error.config?.method?.toUpperCase(),
                api: error.config?.url,
                msg: error.message
            });

        }

        return Promise.reject(error);
    }
);