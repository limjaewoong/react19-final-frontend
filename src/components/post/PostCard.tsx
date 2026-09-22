import {CalendarDays, Eye} from "lucide-react";
import {Link} from "react-router";
import {format} from "date-fns";

export default function PostCard({post}: {post: posts}) {
    return (
        <div
            className="bg-slate-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
            <Link
                to={`/post/${post._id}`}
                className="block relative aspect-video overflow-hidden"
                data-discover="true"
            >
                <img
                    alt="The Impact of Technology on the Workplace: How Technology Is Changing"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    src={post.thumbnail}
                />
                <div className="absolute top-3 left-3">
                    <span className="bg-blue-500 text-white text-xs font-semibold px-2.5 py-1 rounded-md">
                        {post.category}
                    </span>
                </div>
            </Link>
            <div className="p-4">
                <Link to={`/post/${post._id}`} data-discover="true">
                    <h2 className="text-white text-lg font-bold line-clamp-2 mb-3 hover:text-blue-400">
                        {post.title}
                    </h2>
                </Link>
                <div className="flex items-center">
                    <img
                        alt={post.author.nickname}
                        className="w-6 h-6 rounded-full mr-2"
                        src={post.author.profileImage}
                    />
                    <span className="text-gray-300 text-sm mr-3">{post.author.nickname}</span>
                    <div className="flex items-center text-xs text-gray-400">
                        <Eye className="h-3 w-3 mr-4" aria-hidden="true"/>
                        <span>{post.viewCount}</span>
                    </div>
                    <span className="text-gray-300 text-sm mr-3"></span>
                    <div className="flex items-center text-xs text-gray-400">
                        <CalendarDays className="h-3 w-3 mr-1" aria-hidden="true"/>
                        <span>{format(new Date(post.createdAt), 'yyyy-MM-dd HH:mm')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
