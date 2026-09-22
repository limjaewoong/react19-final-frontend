import {create} from "axios";

export const axiosInstance = create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});
axiosInstance.interceptors.request.use(
    (request)=> {
        const access_token = sessionStorage.getItem("access_token");
        if(access_token){
            request.headers = request.headers || {};
            request.headers.Authorization = `Bearer ${access_token}`;
        }
        return request;
    }
    ,(error)=>Promise.reject(error)
);
let retry = false;
axiosInstance.interceptors.response.use(
    (response)=>response,
    async (error)=>{
        const originReq = error.config;
        if(error.response.status === 401 && !retry){
            retry = true;
            try {
                const res = await axiosInstance.post('/auth/refresh');
                if (!res.data.accessToken) throw new Error('access token is expired');
                retry = false;
                sessionStorage.setItem("access_token", res.data.accessToken);
                return axiosInstance(originReq);
            }catch (e) {
                sessionStorage.removeItem("access_token");
                await axiosInstance.post('/auth/logout');
                return Promise.reject(e);
            }
        }
    }
);