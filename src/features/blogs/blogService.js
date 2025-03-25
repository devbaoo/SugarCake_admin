import axios from "axios";
import { base_url } from "../../utils/base_url";
import { config } from "../../utils/axiosconfig";

export const getBlogs = async () => {
    try {
        const response = await axios.get(`${base_url}blog`, config);
        return response.data; // This should return an array of blogs
    } catch (error) {
        console.error("Error fetching Blogs:", error);
        throw error;
    }
};

export const createBlog = async (blog) => {
    try {
        const response = await axios.post(`${base_url}blog/`, blog, config);
        return response.data;
    } catch (error) {
        console.error("Error creating blog:", error);
        throw error;
    }
};

export const deleteBlog = async (id) => {
    try {
        const response = await axios.delete(`${base_url}blog/${id}`, config);
        return response.data; // This should return the deleted blog's ID or data
    } catch (error) {
        console.error("Error deleting blog:", error);
        throw error;
    }
};

const blogService = {
    getBlogs,
    createBlog,
    deleteBlog,
};

export default blogService;