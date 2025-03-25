import  { useEffect, useState } from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { deleteBlog, getBlogs } from "../features/blogs/blogSlice";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import CustomModel from "../components/CustomModel";

const columns = [
  {
    title: "S No.",
    dataIndex: "key",
  },
  {
    title: "Title",
    dataIndex: "title",
    sorter: (a, b) => a.title.length - b.title.length,
  },
  {
    title: "Content",
    dataIndex: "content",
    sorter: (a, b) => a.content.length - b.content.length,
  },
  {
    title: "Date Created",
    dataIndex: "createdAt",
    sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const AllBlogs = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [blogId, setBlogId] = useState("");

  // Fetching blogs from Redux store
  const totalBlogs = useSelector((state) => state.blog.blogs);

  // Handle component mount and fetching blogs
  useEffect(() => {
    dispatch(getBlogs());
  }, [dispatch]);

  // Check if totalBlogs is an array before mapping over it
  const data = Array.isArray(totalBlogs)
    ? totalBlogs.map((blog, index) => ({
        key: index + 1,
        title: blog.title,
        content: blog.content.slice(0, 50) + "...", // Show a snippet of the content
        createdAt: new Date(blog.createdAt).toLocaleString(),
        action: (
          <div className="flex gap-3">
            <Link  className="text-lg">
              <FaEdit />
            </Link>
            <button
              onClick={() => showModal(blog._id)}
              className="text-xl border-0 bg-transparent"
            >
              <MdDeleteOutline />
            </button>
          </div>
        ),
      }))
    : [];

  const showModal = (id) => {
    setOpen(true);
    setBlogId(id);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const deleteBlogData = (id) => {
    setOpen(false);
    dispatch(deleteBlog(id)); // Dispatch delete blog action

    setTimeout(() => {
      dispatch(getBlogs()); // Refresh the list after deletion
    }, 200);
  };

  return (
    <>
      <div className="my-5">
        <h2 className="text-xl my-4 font-bold">Tất cả Blog</h2>
        <Table columns={columns} dataSource={data} />
      </div>
      <CustomModel
        hideModal={hideModal}
        open={open}
        btnAction={() => deleteBlogData(blogId)}
        title="Bạn có chắc chắn muốn xóa Blog này không?"
      />
    </>
  );
};

export default AllBlogs;