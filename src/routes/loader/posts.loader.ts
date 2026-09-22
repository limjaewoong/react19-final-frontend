import {axiosInstance} from "../../api/axios.ts";
import {LoaderFunctionArgs} from "react-router";
import {requireAuthLoader} from "./auth.loader.ts";

export const fetchOverview = async () => {
    try{
        const {data} = await axiosInstance.get('/posts/overview');
        return data;
    }catch (e){
        console.error(e instanceof Error ? e.message : e);
    }
}

export const fetchView = async ({params}: LoaderFunctionArgs) => {
    try{
        const {data} = await axiosInstance.get(`/posts/${params.id}`);
        const {data: {posts: relatedPosts}} = await axiosInstance.get(`/posts?category=${data.category}&limit=3`);

        return {post: data, relatedPosts};
    }catch {
        return {post: null, relatedPosts: []};
    }
}

export const fetchPostModify =  async ({params} : LoaderFunctionArgs)=>{
    const auth =  requireAuthLoader();
    if(auth) return auth;
    try {
        const {data} = await axiosInstance.get(`/posts/${params.id}`);
        return data;
    } catch(e) {
        console.error(e instanceof Error ? e.message : e);
    }
}

export const fetchPosts = async ({request}: LoaderFunctionArgs) =>{
    try {
        let query = "";
        const url = new URL(request.url);
        const sort = url.searchParams.get("sort") ?? "newest";
        const category = url.searchParams.get("category") ?? "";
        const page = url.searchParams.get("page") ?? "1";
        const search = url.searchParams.get("search") ?? "";

        if(sort !== "") query += `&sort=${sort}`;
        if(category !== "") query += `&category=${category}`;
        if(page !== "") query += `&page=${page}`;
        if(search !== "") query += `&search=${search}`;

        console.log('url:', `/posts?${query}` )
        const {data} = await axiosInstance.get(`/posts?${query}`);
        console.log('data:', data)
        return data;
    } catch (e){
        console.error(e instanceof Error ? e.message : e);
    }
}