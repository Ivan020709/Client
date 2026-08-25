import axios from "axios";
import { Cookies } from "react-cookie";
const jaxios = axios.create();
const cookies = new Cookies();
const beforeReq = async (config) => {
    let currentUser = cookies.get('user')
    let { accessToken } = currentUser;
    const result = await axios.get(`/api/member/refresh/${currentUser.refreshToken}`, { headers: { 'Authorization': `Bearer ${currentUser.accessToken}` } });
    currentUser.accessToken = result.data.accessToken;
    currentUser.refreshToken = result.data.refreshToken;
    cookies.set('user', JSON.stringify(currentUser), { path: '/' })
    accessToken = currentUser.accessToken;
    config.headers.Authorization = `Bearer ${accessToken}`
    return config
}
jaxios.interceptors.request.use(beforeReq);
export default jaxios;