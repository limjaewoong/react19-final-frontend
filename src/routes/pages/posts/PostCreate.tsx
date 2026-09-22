import {ImagePlus, Loader2} from "lucide-react";
import {useEffect, useState, useTransition} from "react";
import {useLoaderData, useNavigate} from "react-router";
import axios from "axios";
import {axiosInstance} from "../../../api/axios.ts";

const categories = [
    "Technology",
    "Lifestyle",
    "Travel",
    "Business",
    "Economy",
    "Sports",
];

export default function PostCreate() {

    const navi = useNavigate();
    const [previewImage, setPreviewImage] = useState("");
    const [isPending, startTransition] = useTransition();

    const [formState, setFormState] = useState({
        title: "",
        category: "",
        thumbnail: "",
        content: "",
    })

    const [errorState, setErrorState] = useState<formStateType>({
        title: "",
        category: "",
        thumbnail: "",
        content: "",
    })

    const post = useLoaderData();

    const handleChangeFormState = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormState((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
        setErrorState((prevState) => ({
            ...prevState,
            [e.target.name]: ""
        }));
    }

    const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;
        //console.log('selectedFile:', selectedFile);
        const allowedExt = ["png", "gif", "webp", "jpg", "jpeg"]
        const fileExt = selectedFile.name.split(".").pop()?.toLowerCase();
        if (!fileExt || !allowedExt.includes(fileExt)) {
            alert(`허용된 이미지 확장자는 ${allowedExt.join(', ')}입니다.`);
            e.target.value = "";
            return;
        }
        const maxSize = 10 * 1024 * 1024;
        if (selectedFile.size > maxSize) {
            alert(`허용된 이미지 크기는 ${maxSize / 1024 / 1024}MB 이하입니다.`);
            e.target.value = "";
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = () => {
            //console.log('reader.result:', reader.result);
            setFormState((prevState) => ({
                ...prevState,
                thumbnail: reader.result as string
            }));
            setPreviewImage(reader.result as string);
            setErrorState(prevState => ({
                ...prevState,
                thumbnail: ""
            }))
        }

    }

    const resetPreviewImage = () => {
        setFormState((prevState) => ({
            ...prevState,
            thumbnail: ""
        }));
        setPreviewImage("");
    }

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        startTransition(async () => {
            try {
                // form validation
                await validateForm();
            } catch (error) {
                console.error(error instanceof Error ? error.message : error);
            }
        })
    }

    const validateForm = async () => {
        if(formState.title.trim() === ''){
            setErrorState((prevState) => ({
                ...prevState,
                title: "Title is required"
            }));
        }
        if(formState.content.trim() === ''){
            setErrorState((prevState) => ({
                ...prevState,
                content: "Content is required"
            }));
        }
        if(formState.thumbnail.trim() === ''){
            setErrorState((prevState) => ({
                ...prevState,
                thumbnail: "Thumbnail is required"
            }));
        }
        let thumbnailUrl = post?.thumbnail || '';
        if(previewImage !== thumbnailUrl) {
            if (formState.thumbnail.trim() !== '') {
                const formData = new FormData();
                formData.append("file", formState.thumbnail);
                formData.append("upload_preset", "react-blog");
                const {data: {url}} = await axios.post(`https://api.cloudinary.com/v1_1/anpz1saa/upload`, formData);
                if (url) thumbnailUrl = url;
            }
        }

        if(Object.keys(errorState).length > 0) {
            return;
        }

        if(post){
            const {status} = await axiosInstance.put(`/posts/${post._id}`,{
                title: formState.title,
                category: formState.category,
                thumbnail: thumbnailUrl,
                content: formState.content
            });
            if(status === 200) {
                alert("Post Modified");
                navi(`/post/${post._id}`);
            }
        }else{
            const {status} = await axiosInstance.post(`/posts`,{
                title: formState.title,
                category: formState.category,
                thumbnail: thumbnailUrl,
                content: formState.content
            });
            if(status === 201) {
                alert("Post Added");
                navi('/');
            }
        }

    }

    useEffect(() => {
        if(post){
            setFormState({
                title: post.title,
                category: post.category,
                thumbnail: post.thumbnail,
                content: post.content
            });
            setPreviewImage(post.thumbnail);
        }
    }, [post]);

return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Write {post ? 'Edit' : 'New'} Post</h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
                <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-300 mb-2"
                >
                    Title
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formState.title}
                    onChange={handleChangeFormState}
                    className="w-full bg-slate-800 text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter post title"

                />
                {errorState.title && <p className="text-red-500 mt-2">{errorState.title}</p>}
            </div>

            <div>
                <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-300 mb-2"
                >
                    Category
                </label>
                <select
                    id="category"
                    className="w-full bg-slate-800 text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"

                    name="category"
                    value={formState.category}
                    onChange={handleChangeFormState}
                >
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
                {errorState.category && <p className="text-red-500 mt-2">{errorState.category}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Featured Image
                </label>
                <div className="relative">

                    {previewImage &&
                        <div className="relative w-full aspect-video mb-4">
                            <img
                                src={previewImage}
                                alt="Preview"
                                className="w-full h-full object-cover rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={resetPreviewImage}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                            >
                                ✕
                            </button>
                        </div>}

                    {!previewImage &&
                        <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                            <input
                                type="file"
                                id="image"
                                accept="image/*"
                                className="hidden"
                                onChange={handleChangeImage}
                            />
                            <label
                                htmlFor="image"
                                className="flex flex-col items-center cursor-pointer"
                            >
                                <ImagePlus className="h-12 w-12 text-gray-400 mb-3"/>
                                <span className="text-gray-300">Click to upload image</span>
                                <span className="text-gray-500 text-sm mt-1">PNG, JPG, JPEG, WEBP up to 10MB</span>
                            </label>
                        </div>
                    }
                    {errorState.thumbnail && <p className="text-red-500 mt-2">{errorState.thumbnail}</p>}
                </div>
            </div>

            <div>
                <label
                    htmlFor="content"
                    className="block text-sm font-medium text-gray-300 mb-2"
                >
                    Content
                </label>
                <textarea
                    id="content"
                    name="content"
                    value={formState.content}
                    onChange={handleChangeFormState}
                    className="w-full h-96 bg-slate-800 text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Write your post content here..."

                />
                {errorState.content && <p className="text-red-500 mt-2">{errorState.content}</p>}
            </div>

            <div className="flex gap-4">
                <button
                    type="submit"
                    disabled={isPending}
                    className="px-6 py-2.5 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors bg-gray-500"
                >
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin"/> : post ? "Modify Post" : "Publish Post"}
                </button>
                <button
                    type="button"
                    className="px-6 py-2.5 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-600 transition-colors"
                    onClick={() => navi(-1)}
                >
                    Cancel
                </button>
            </div>
        </form>
    </div>
);
}
