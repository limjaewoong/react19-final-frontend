import {Mail} from "lucide-react";
import {useNavigate, useSearchParams} from "react-router";
import {useCallback, useEffect, useRef, useState} from "react";
import Redirection from "../../../../components/common/Redirection.tsx";
import {axiosInstance} from "../../../../api/axios.ts";
import {authStore} from "../../../../store/authStore.ts";


export default function Kakao() {
   // const location = useLocation();
    const navi = useNavigate();
    //console.log(location.search);
    /*const queryParams = new URLSearchParams(location.search);
    const access_token = queryParams.get("access_token");
    const email = queryParams.get("email");
    console.log('access_token:',access_token, 'email:',email);*/

    const [searchParams] = useSearchParams();
    const access_token = searchParams.get('access_token');
    //const user = authStore((state)=> state.user);
    const setUserData = authStore((state)=> state.setUserData);
    const email = searchParams.get('email');
    //console.log('access_token:', access_token, 'email:', email);
    const [showForm, setShowForm] = useState(false);
    const emailRef = useRef(null);
    const [error, setError] = useState('');

    const handleSubmit = async (formData: FormData) =>{
        const email = formData.get('email');
        //console.log('email:', email);
        try {
            if(access_token) sessionStorage.setItem("access_token",access_token);
            const {data : {user}} = await axiosInstance.patch(`/auth/update-email`,{email});
            console.log('user:',user);
            if(user){
                //const {user} = response.data;
                setUserData({
                    id: user._id,
                    kakaoId: user.kakaoId,
                    email: user.email,
                    profileImage: user.profileImage,
                    nickname: user.nickname
                });

                navi('/');
            }
        } catch (e){
            setError(e instanceof Error ? e.message : 'Unknown Error');
        }
    }

    const fetchAndSaveUser = useCallback(async ()=>{
        console.log('fetchAndSaveUser')
        setError('');
        try {
            if(access_token) sessionStorage.setItem("access_token",access_token);
            const {data: user} = await axiosInstance.get('/auth/me');
            //console.log('user',user);
            setUserData({
                id: user._id,
                kakaoId: user.kakaoId,
                email: user.email,
                profileImage: user.profileImage,
                nickname: user.nickname
            });
            navi('/');
        }catch (e){
            setError(e instanceof Error ? e.message : 'Unknown Error');
        }
    },[access_token, navi, setUserData])

    useEffect(() => {
        if (email === 'N') {
            setShowForm(true);
        }else{
            fetchAndSaveUser();
        }
        return () => {
            setShowForm(false);
        }
    }, [email, fetchAndSaveUser]);

    return (
        <>
            <>
                {/* 이메일 정보를 받아야 할 때 */}
                {showForm ?
                    (<div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
                        <div className="w-full max-w-md">
                            <div className="bg-slate-800 rounded-lg shadow-xl p-8">
                                <div className="text-center mb-8">
                                    <h1 className="text-2xl font-bold text-white mb-2">
                                        You're almost there
                                    </h1>
                                    <p className="text-gray-400">Sign up with just your email!</p>
                                </div>

                                <form className="space-y-4" action={handleSubmit}>
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-sm font-medium text-gray-300 mb-2"
                                        >
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <Mail
                                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"/>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                className="w-full bg-slate-700 text-white pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                placeholder="Enter your email"
                                                autoComplete="off"
                                                required
                                                ref={emailRef}
                                            />
                                        </div>
                                        {error && <p className="text-rose-500 mt-2">Failed Update</p>}
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={()=> navi(-1)}
                                            className="flex-1 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                        >
                                            Continue
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    ) : <Redirection/>
                }
            </>
        </>
    );
}
