import { Mail } from "lucide-react";
import { useNavigate } from "react-router";

const AUTH_ROUTES = {
    emailLogin: "/auth/email-login",
    signup: "/auth/signup",
} as const;

const buttonBaseClass =
    "w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-colors";

const dividerLabelClass = "px-2 text-gray-400 bg-slate-800";

function Divider({ label }: { label?: string }) {
    if (!label) {
        return (
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600" />
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
                <span className={dividerLabelClass}>{label}</span>
            </div>
        </div>
    );
}

export default function Login() {
    const navigate = useNavigate();

    const handleKakaoLogin = () => {
        const apiBaseUrl = import.meta.env.VITE_API_URL;

        if (!apiBaseUrl) {
            return;
        }

        window.location.href = `${apiBaseUrl}/auth/kakao`;
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="bg-slate-800 rounded-lg shadow-xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-white mb-2">Welcome to SULOG</h1>
                        <p className="text-gray-400">Sign in with your account</p>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={() => navigate(AUTH_ROUTES.emailLogin)}
                            className={`${buttonBaseClass} bg-white text-slate-900 hover:bg-gray-100`}
                        >
                            <Mail className="w-5 h-5" />
                            Continue with Email
                        </button>

                        <Divider label="Or continue with" />

                        <button
                            onClick={handleKakaoLogin}
                            className={`${buttonBaseClass} bg-[#FEE500] text-[#000000] hover:bg-[#FDD800]`}
                        >
                            <img
                                src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_small.png"
                                alt="Kakao Logo"
                                className="w-5 h-5"
                            />
                            Continue with Kakao
                        </button>

                        <Divider label="Don't have an account?" />

                        <button
                            onClick={() => navigate(AUTH_ROUTES.signup)}
                            className={`${buttonBaseClass} bg-slate-700 text-white hover:bg-slate-600`}
                        >
                            Create an account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
