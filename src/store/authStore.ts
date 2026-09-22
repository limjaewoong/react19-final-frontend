import {create} from "zustand";
import {immer} from "zustand/middleware/immer";
import {devtools} from "zustand/middleware";
import {axiosInstance} from "../api/axios.ts";

export const authStore = create<authType>()(
    devtools(
        immer(
            (set) => ({
                isLogin: false,
                user: null,
                setUserData: (userData: User)=> set((state)=>{
                    state.isLogin = true;
                    state.user = userData;
                }),
                logout: async () =>{
                    await axiosInstance.post('/auth/logout');
                    set((state)=>{
                        state.isLogin = false;
                        state.user = null;
                        sessionStorage.removeItem("access_token");
                    })
                }
            })
        )
        ,{enabled: import.meta.env.DEV})
)