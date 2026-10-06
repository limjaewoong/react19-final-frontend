import {Send} from "lucide-react";
import {authStore} from "../../store/authStore.ts";
import {Dispatch, SetStateAction, startTransition, useState} from "react";
import {axiosInstance} from "../../api/axios.ts";
import {useNavigate} from "react-router";
import {twMerge} from "tailwind-merge";

export default function CommentForm({id, setComments, setOptimisticComments}:
                                    {
                                        id: string,
                                        setComments: Dispatch<SetStateAction<comment[]>>,
                                        setOptimisticComments: (action: comment) => void;
                                    }) {
    const user = authStore.getState().user;
    const [text, setText] = useState('');
    const navi = useNavigate();
    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user) return;
        if (!text.trim()) {
            alert('Please write a comment');
            return;
        }

        startTransition(async () => {
            setOptimisticComments({
                author: {
                    id: Date.now().toString(),
                    nickname: user?.nickname,
                    profileImage: user?.profileImage
                },
                content: text,
                _id: Date.now().toString(),
                createdAt: new Date().toISOString(),
            } as comment)

            try {
                const response = await axiosInstance.post(`/posts/${id}/comments`, {content: text})
                setComments(prev => [...prev, response.data])
                setText('');
                console.log('response:', response);
            } catch (error) {
                console.error(error instanceof Error ? error.message : error);
            }
        })
    }

    const checkUser = () => {
        if (!user) {
            navi('/auth/login');
        }
    }

    return (
        <form className="mt-4" onSubmit={handleSubmit}>
            <div className="flex gap-4">
                {user &&
                    <img
                        src={user?.profileImage}
                        alt={user?.nickname}
                        className="w-10 h-10 rounded-full"
                    />
                }
                <div className="flex-1">
                    <textarea
                        name="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onFocus={checkUser}
                        placeholder={"Write a comment..."}
                        className="w-full bg-slate-800 text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                        rows={3}
                    />
                    <div className="flex justify-end mt-2">
                        <button
                            type="submit"
                            disabled={!user}
                            className={twMerge(`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors ${!user ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`)}
                        >
                            <Send className="w-4 h-4"/>
                            Comment
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
