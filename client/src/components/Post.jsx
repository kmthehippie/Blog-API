import { useParams, Link, Outlet } from "react-router-dom";
import "../../styles/post.scss";
import api from "../api/axios";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import useAuth from "../hooks/useAuth";
import parse from "html-react-parser"

const Post = () => {
  const { auth, isModalActive, openModal, closeModal } = useAuth();
  const { postId } = useParams();
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  
  const fetchPost = async () => {
    try {
      const response = await api.get(`/post/${postId}`);
      setPost(response?.data.post);
      setComments(response?.data.comments);
      setContent(parse(response?.data?.post?.content))
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId, isModalActive]);


  return (
    <div className="post-bg">
      <div className="post">
        <h1>{post?.title}</h1>
        <img className="post-img" src={post?.imgurl} alt={post?.title} />
        <div className="content">{content}</div>
        <div className="post-endtag">
          Written By: {post?.author?.username || "Anonymous"} <br />
          Written On: {post.date ? format(new Date(post.date), "dd MMMM yyyy") : "N/A"}
        </div>
      </div>

      <div className="comments">
        <div className="add-new-comment">
          <Link
            to={`/post/${postId}/comment/new`}
            className="new-comment"
            onClick={openModal}
          >
            Add New Comment
            <span id="plus" className="material-symbols-outlined">add_box</span>
          </Link>
        </div>

        {comments.map((comment) => (
          <div className="comment" key={comment._id}>
            <div className="post-endtag">
              {auth?.username === comment?.user?.username && (
                <>
                  <Link
                    to={`/post/${postId}/comment/${comment._id}/update`}
                    onClick={openModal}
                  >
                    <span id="pen" className="material-symbols-outlined">edit</span>
                  </Link>
                  <Link
                    to={`/post/${postId}/comment/${comment._id}/delete`}
                    onClick={openModal}
                  >
                    <span id="trash" className="material-symbols-outlined">delete</span>
                  </Link>
                </>
              )}
              <span className="commenter">{comment?.user?.username || "Anonymous"} </span>
              &nbsp;
              <span className="comment-date">{comment.date ? format(new Date(comment.date), "dd MMMM yyyy") : ""}</span>
            </div>
            <div className="content">{comment.comment}</div>
          </div>
        ))}
      </div>

      <div className={`modal comment-update ${isModalActive ? 'active' : ''}`}>
        {isModalActive && (
          <div className="modal-outlet">
            <Outlet />
            <button className="close-modal-btn" onClick={closeModal}>
              <span className="material-symbols-outlined">cancel</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;
