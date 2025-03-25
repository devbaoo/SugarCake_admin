import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import blogService from "./blogService";

// Fetch Blogs
export const getBlogs = createAsyncThunk(
    "blog/get-blogs",
    async (thunkAPI) => {
        try {
            return await blogService.getBlogs();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Create Blog
export const createBlog = createAsyncThunk(
    "blog/create-blog",
    async (blogData, thunkAPI) => {
        try {
            return await blogService.createBlog(blogData);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Delete Blog
export const deleteBlog = createAsyncThunk(
    "blog/delete-blog",
    async (id, thunkAPI) => {
        try {
            return await blogService.deleteBlog(id);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const blogSlice = createSlice({
    name: "blog",
    initialState: {
        blogs: [], // Store list of blogs
        isError: false,
        isSuccess: false,
        isLoading: false,
        message: "",
        createdBlog: null,
        deletedBlog: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Get Blogs
            .addCase(getBlogs.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getBlogs.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.blogs = action.payload; // Assigning the array of blogs to state
            })
            .addCase(getBlogs.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload; // Store the error message
            })
            // Create Blog
            .addCase(createBlog.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createBlog.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.createdBlog = action.payload; // Store the created blog data
            })
            .addCase(createBlog.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload; // Store the error message
            })
            // Delete Blog
            .addCase(deleteBlog.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteBlog.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.deletedBlog = action.payload; // Store the deleted blog data
                // Optionally, you can remove the deleted blog from the list
                state.blogs = state.blogs.filter((blog) => blog._id !== action.payload._id);
            })
            .addCase(deleteBlog.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload; // Store the error message
            });
    },
});

export default blogSlice.reducer;