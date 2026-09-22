import {useMemo} from "react";
import {twMerge} from "tailwind-merge";

function Pagination({pageRange, currentPage, maxPage, onPageChange}:
                    {
                        pageRange: number,
                        currentPage: number,
                        maxPage: number,
                        onPageChange: (page: number) => void
                    }) {
    const half = Math.floor(pageRange / 2);
    const pages = useMemo(() => {
        let start = currentPage - half;
        let end = currentPage + half;
        if (start < 1) {
            start = 1;
            end = Math.min(maxPage, pageRange);
        }

        if (end > maxPage) {
            end = maxPage;
            start = Math.max(1, maxPage - pageRange + 1);
        }

        const arr = [];
        for (let i = start; i <= end; i++) {
            arr.push(i);
        }
        return arr;

    }, [currentPage, half, maxPage, pageRange]);

    return (
        <>
            <div className="flex justify-center mt-12 gap-2">
                <button
                    className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 disabled:opacity-50"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    Previous
                </button>
                {
                    pages.map((page) => {
                        return (
                            <button key={page}
                                    onClick={() => onPageChange(page)}
                                    className={twMerge(`w-10 h-10 rounded-lg cursor-pointer ${page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300'}`)}>
                                {page}
                            </button>)
                    })
                }
                <button
                    disabled={currentPage === maxPage}
                    onClick={() => onPageChange(currentPage + 1)}
                    className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 disabled:opacity-50">
                    Next
                </button>
            </div>
        </>
    );
}

export default Pagination;