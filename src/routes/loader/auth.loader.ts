import { authStore } from "../../store/authStore.ts";
import { axiosInstance } from "../../api/axios.ts";
import {redirect} from "react-router";

/**
 * 이 로더 함수는 최상위 라우트(root route)에서 사용하기 위해 설계되었습니다.
 * 주된 목적은 초기 페이지 로드 또는 전체 페이지 새로고침 시,
 * 사용자의 인증 상태(user 정보)를 Zustand 스토어에 로드하는 것입니다.
 */
export const rootLoader = async () => {
    const userInStore = authStore.getState().user;
    const accessToken = sessionStorage.getItem("access_token");

    // 시나리오 1: 사용자 정보가 이미 스토어에 있는 경우.
    // 추가 작업이 필요 없으므로 그대로 사용자 정보를 반환합니다.
    if (userInStore) {
        return userInStore;
    }

    // 시나리오 2: 스토어에는 없지만 토큰이 있는 경우 (주로 페이지 새로고침 상황).
    if (accessToken) {
        try {
            // 토큰을 사용해 서버로부터 사용자 정보를 가져옵니다.
            const { data: user } = await axiosInstance.get('/auth/me');

            // Zustand 스토어에서 사용할 형식으로 데이터를 정리합니다.
            const userData = {
                id: user._id,
                kakaoId: user.kakaoId,
                email: user.email,
                profileImage: user.profileImage,
                nickname: user.nickname
            };

            // Zustand 스토어의 상태를 직접 업데이트합니다.
            authStore.getState().setUserData(userData);

            // 로드된 사용자 데이터를 반환합니다. (이제 useLoaderData()로도 접근 가능)
            return userData;
        } catch (error) {
            console.error("Auth Loader: 토큰으로 사용자 정보 로딩 실패.", error);
            // 토큰이 만료되었거나 유효하지 않을 가능성이 높으므로 정리합니다.
            sessionStorage.removeItem("access_token");
            return null;
        }
    }

    // 시나리오 3: 스토어에도 없고 토큰도 없는 경우. (비로그인 상태)
    return null;
};

export const requireAuthLoader = () => {
    const accessToken = sessionStorage.getItem("access_token");
    if(!accessToken){
        return redirect("/auth/login");
    }
}
export const redirectIfAuthLoader = () => {
    const accessToken = sessionStorage.getItem("access_token");
    if(accessToken){
        return redirect("/");
    }
}