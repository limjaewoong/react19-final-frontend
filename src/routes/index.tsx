import {createBrowserRouter, RouterProvider} from "react-router";
import Home from "./pages/Home";
import Default from "./layouts/Default";
import PostCreate from "./pages/posts/PostCreate";
import Login from "./pages/auth/Login";
import Posts from "./pages/posts/Posts";
import PostRead from "./pages/posts/PostRead";
import NotFoundPage from "./pages/NotFound";
import Kakao from "./pages/auth/callback/Kakao";
import Signup from "./pages/auth/Signup";
import EmailLogin from "./pages/auth/EmailLogin";
import {redirectIfAuthLoader, requireAuthLoader, rootLoader} from "./loader/auth.loader.ts";
import FullLoading from "../components/common/FullLoading.tsx";
import ErrorState from "../components/common/ErrorState.tsx";
import {fetchOverview, fetchPostModify, fetchPosts, fetchView} from "./loader/posts.loader.ts";

const router = createBrowserRouter([
    {
        Component: Default,
        loader: rootLoader,
        HydrateFallback: FullLoading,
        errorElement: <ErrorState/>,
        children: [
            {
                path: "",
                Component: Home,
                loader: fetchOverview
            },
            {
                path: "/posts",
                Component: Posts,
                loader: fetchPosts
            },
            {
                path: "/create-post",
                Component: PostCreate,
                loader: requireAuthLoader,
            },
            {
                path: "/edit/:id",
                Component: PostCreate,
                loader: fetchPostModify,
            },
            {
                path: "/post/:id",
                Component: PostRead,
                loader: fetchView,
            },
            {
                path: "/auth/login",
                Component: Login,
                loader: redirectIfAuthLoader
            },
            {
                path: "/auth/email-login",
                Component: EmailLogin,
                loader: redirectIfAuthLoader
            },
            {
                path: "/auth/signup",
                Component: Signup,
                loader: redirectIfAuthLoader
            },
            {
                path: "/auth/callback/kakao",
                Component: Kakao,
                loader: redirectIfAuthLoader
            },
            {
                path: "*",
                Component: NotFoundPage,
            },
        ],
    },
]);

export default function Route() {
    return (
        <>
            <RouterProvider router={router}/>
        </>
    );
}
