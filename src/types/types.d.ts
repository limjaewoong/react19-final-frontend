type User = {
    id: string;
    kakaoId: string;
    email?: string;
    profileImage: string;
    nickname: string;
}

type authType = {
    isLogin: boolean;
    user: User|null;
    setUserData: (userData: User)=> void;
    logout: () => void;
}

type formStateType = {
    title: string;
    category: string;
    thumbnail: string;
    content: string;
}

type comment = {
    _id: string;
    content: string;
    author: User;
    createdAt: string;
}

type posts = {
    _id: string;
    title: string;
    category: string;
    thumbnail: string;
    content: string;
    author: User;
    comments: comment[];
    viewCount: number;
    createdAt: string;
}


type postsType = {
    title: string;
    posts?: posts[];
    sort?: string;
}

interface pagination {
    totalCount : number;
    currentPage: number;
    perPage: number;
    maxPage: number;
}

interface searchParams {
    sort: string;
    category?: string;
    search?: string;
    page: number;
}