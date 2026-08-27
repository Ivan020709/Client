import axios from "axios";
import { Cookies } from "react-cookie";

const jaxios = axios.create();
const cookies = new Cookies();


// =====================================================
// Request Interceptor
// =====================================================

const beforeReq = (config) => {

    // 쿠키에서 로그인 사용자 정보 가져오기
    const loginUser = cookies.get("user");

    // 로그인 정보가 없는 경우
    if (!loginUser || !loginUser.userid) {

        alert("로그인이 필요한 서비스 입니다");

        return Promise.reject({
            response: {
                data: {
                    error: "REQUIRE_LOGIN"
                }
            }
        });
    }

    // AccessToken 가져오기
    const { accessToken } = loginUser;

    // Authorization Header에 AccessToken 추가
    config.headers = config.headers || {};

    config.headers.Authorization =
        `Bearer ${accessToken}`;

    return config;
};


// =====================================================
// Request Fail
// =====================================================

const requestFail = (err) => {

    console.log("request fail error.....");

    return Promise.reject(err);
};


// =====================================================
// Response Success
// =====================================================

const beforeRes = (res) => {

    // 정상적인 응답은 그대로 반환
    return res;
};


// =====================================================
// Response Fail
// =====================================================

const responseFail = async (err) => {

    console.log("response fail error.....");

    // -------------------------------------------------
    // 401이 아니면 그대로 에러 전달
    // -------------------------------------------------

    if (err.response?.status !== 401) {

        return Promise.reject(err);
    }


    // -------------------------------------------------
    // 원래 요청 정보
    // -------------------------------------------------

    const originalRequest = err.config;


    // -------------------------------------------------
    // 같은 요청 무한 반복 방지
    // -------------------------------------------------

    if (originalRequest && originalRequest._retry) {

        console.log(
            "이미 재시도한 요청입니다."
        );

        return Promise.reject(err);
    }


    if (originalRequest) {

        originalRequest._retry = true;
    }


    try {

        // -------------------------------------------------
        // 현재 로그인 사용자 정보
        // -------------------------------------------------

        const loginUser = cookies.get("user");


        // -------------------------------------------------
        // RefreshToken 확인
        // -------------------------------------------------

        if (
            !loginUser ||
            !loginUser.refreshToken
        ) {

            console.log(
                "RefreshToken이 없습니다."
            );

            return Promise.reject(err);
        }


        console.log(
            "AccessToken 만료"
        );

        console.log(
            "RefreshToken으로 AccessToken 갱신을 시도합니다."
        );


        // -------------------------------------------------
        // Refresh 요청
        //
        // 중요:
        // 여기서는 jaxios가 아니라
        // 기본 axios를 사용합니다.
        //
        // jaxios를 사용하면 interceptor가 다시 작동해서
        // refresh 요청 자체가 무한 반복될 수 있습니다.
        // -------------------------------------------------

        const result = await axios.get(
            `/api/member/refresh/${loginUser.refreshToken}`,
            {
                headers: {
                    Authorization:
                        `Bearer ${loginUser.accessToken}`
                },
                withCredentials: true
            }
        );


        console.log(
            "Refresh 응답:",
            result.data
        );


        // -------------------------------------------------
        // 새 AccessToken 확인
        // -------------------------------------------------

        if (!result.data.accessToken) {

            console.log(
                "새 AccessToken이 없습니다."
            );

            return Promise.reject(err);
        }


        // -------------------------------------------------
        // 새 Token 저장
        // -------------------------------------------------

        loginUser.accessToken =
            result.data.accessToken;


        loginUser.refreshToken =
            result.data.refreshToken;


        // -------------------------------------------------
        // Cookie 업데이트
        // -------------------------------------------------

        cookies.set(
            "user",
            JSON.stringify(loginUser),
            {
                path: "/"
            }
        );


        console.log(
            "새 AccessToken 저장 완료"
        );


        // -------------------------------------------------
        // 원래 요청이 존재하는 경우
        // -------------------------------------------------

        if (!originalRequest) {

            return Promise.reject(err);
        }


        // -------------------------------------------------
        // 원래 요청 Header에
        // 새 AccessToken 적용
        // -------------------------------------------------

        originalRequest.headers =
            originalRequest.headers || {};


        originalRequest.headers.Authorization =
            `Bearer ${result.data.accessToken}`;


        console.log(
            "기존 요청을 다시 보냅니다."
        );


        // -------------------------------------------------
        // 원래 요청 재전송
        //
        // jaxios를 사용해야 Request Interceptor가
        // 정상적으로 적용됩니다.
        // -------------------------------------------------

        return await jaxios(
            originalRequest
        );


    } catch (refreshError) {

        // -------------------------------------------------
        // Refresh 실패
        // -------------------------------------------------

        console.error(
            "RefreshToken 갱신 실패:",
            refreshError
        );


        return Promise.reject(
            refreshError
        );
    }
};


// =====================================================
// Interceptor 등록
// =====================================================

jaxios.interceptors.request.use(
    beforeReq,
    requestFail
);


jaxios.interceptors.response.use(
    beforeRes,
    responseFail
);


// =====================================================
// Export
// =====================================================

export default jaxios;