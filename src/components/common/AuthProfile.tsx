import {useEffect, useRef, useState} from "react";
import {LogOut} from "lucide-react";
import {authStore} from "../../store/authStore.ts";
import {useNavigate, useRevalidator} from "react-router";

export default function AuthProfile() {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const user = authStore.getState().user;
    const authProfileRef = useRef<HTMLDivElement|null>(null);
    const navi = useNavigate();
    const {revalidate} = useRevalidator();

    const logout = () => {
        console.log("logout");
        authStore.getState().logout();
        navi("/");
    };

    useEffect(() => {
        if(isUserMenuOpen){
            const handleClickOutside = (event: MouseEvent) => {
                if (authProfileRef.current && !authProfileRef.current.contains(event.target as Node)) {
                    setIsUserMenuOpen(false);
                }
            };
            document.addEventListener('click', handleClickOutside);
            return () => {
                document.removeEventListener('click', handleClickOutside);
            };
        }
    }, [isUserMenuOpen]);

    return (
        <>
            <div className="relative" ref={authProfileRef}>
                <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2"
                >
                    <img
                        src={user?.profileImage}
                        className="w-8 h-8 rounded-full border-2 border-blue-500"
                    />
                </button>

                {isUserMenuOpen && (
                    <div
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg py-1 z-50">
                        <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-700">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{user?.nickname}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                        </div>
                        <button
                            onClick={ async () => {
                                await logout();
                                setIsUserMenuOpen(false);
                                revalidate();
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700"
                        >
                            <LogOut className="h-4 w-4 mr-2"/>
                            Sign out
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
