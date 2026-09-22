import {Trash} from "lucide-react";
import {format} from "date-fns";

export default function CommentComponent({comment, user, handleCommentDelete}: { comment: comment, user: User|null, handleCommentDelete: (id: string) => void }) {

    return (
        <div className="mb-6">
            <div className="flex gap-4">
                <img
                    alt={comment.author.nickname}
                    className="w-10 h-10 rounded-full"
                    src={comment.author.profileImage}
                />
                <div className="flex-1">
                    <div className="bg-slate-800 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-white">{comment.author.nickname}</span>
                            <span className="text-sm text-gray-400">{format(new Date(comment.createdAt), 'yyyy-MM-dd HH:mm')}</span>
                        </div>
                        <p className="text-gray-300">
                            {comment.content}
                        </p>
                    </div>
                    {user && user.id === comment.author.id &&
                        <div className="flex items-center gap-4 mt-2">
                            <button
                                onClick={()=> handleCommentDelete(comment._id)}
                                className="flex items-center gap-1 text-sm text-gray-400 hover:text-blue-400 transition-colors">
                                <Trash className="w-4 h-4" aria-hidden="true"/>
                                삭제
                            </button>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}
