import {Clock, Filter, TrendingUp} from "lucide-react";
import AdBanner from "../../../components/common/AdBanner";
import Pagination from "../../../components/post/Pagination.tsx";
import {useLoaderData, useSearchParams} from "react-router";
import PostCard from "../../../components/post/PostCard.tsx";
import PostZero from "../../../components/post/PostZero.tsx";

export default function Posts() {

    const {posts, pagination}: { posts: posts[], pagination: pagination } = useLoaderData();
    const [search, setSearch] = useSearchParams();

    const sort = search.get('sort') ?? 'newest';
    const category = search.get('category') ?? '';
    const searchQuery = search.get('search') ?? '';
    const page = Number(search.get('page') ?? '1');

    const handleSortClick = (newSort: string) => {
        if (sort !== newSort) {
            setSearch({sort: newSort, category, search: searchQuery, page: '1'});
        }
    };

    const handleCategoryChange = (newCategory: string) => {
        setSearch({sort, category: newCategory, search: searchQuery, page: '1'});
    };

    const handlePageChange = (newPage: number) => {
        setSearch({sort, category, search: searchQuery, page: newPage.toString()});
    };


    {
        if(posts.length === 0) return (<PostZero selectedCategory={category}/>);
    }

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
            {/* Header: Title + Filter */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
                    Blog Posts
                </h1>

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-800 p-2 rounded-lg">
                        <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400"/>
                        <select
                            value={category}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            className="bg-transparent text-gray-700 dark:text-gray-300 focus:outline-none">
                            <option value={""}>ALL</option>
                            <option value={"Technology"}>Technology</option>
                            <option value={"Lifestyle"}>Lifestyle</option>
                            <option value={"Travel"}>Travel</option>
                            <option value={"Business"}>Business</option>
                            <option value={"Economy"}>Economy</option>
                            <option value={"Sports"}>Sports</option>
                        </select>
                    </div>
                    <div className="flex bg-gray-100 dark:bg-slate-800 rounded-lg">
                        <button
                            onClick={() => handleSortClick('newest')}
                            className={
                                sort === 'newest' ?
                                    `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors bg-blue-500 text-white`
                                    :
                                    `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700`
                            }
                        >
                            <Clock className="w-4 h-4"/>
                            Latest
                        </button>
                        <button
                            onClick={() => handleSortClick('views')}
                            className={
                                sort === 'views' ?
                                    `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors bg-blue-500 text-white`
                                    :
                                    `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700`
                            }
                        >
                            <TrendingUp className="w-4 h-4"/>
                            Popular
                        </button>
                    </div>
                </div>
            </div>

            {/* Post List - 정적 PostCard 예시 3개 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts && posts.map(post => (
                    <PostCard key={post._id} post={post}/>
                ))}
            </div>

            {/* Pagination */}
            {pagination.maxPage > 1 && <Pagination pageRange={5} currentPage={page} maxPage={pagination.maxPage}
                                                   onPageChange={handlePageChange}/>}

            {/* Ad Banner */}
            <div className="mt-12">
                <AdBanner/>
            </div>
        </div>
    );
}
