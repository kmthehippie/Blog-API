import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { format } from 'date-fns';
import '../../../styles/admin/adminComments.scss';
import AdminComment from './Comment';
import CfmDelete from './CfmDelete';

const AdminComments = () => {
  const [isModalActive, setIsModalActive] = useState(false);
  const [isDeleteModalActive, setIsDeleteModalActive] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const { postId } = useParams();
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const axiosPrivate = useAxiosPrivate();

  const fetchPost = async () => {
    try {
      const response = await axiosPrivate.get(`/admin/post/${postId}/update`);
      setPost(response?.data.post);
      setComments(response?.data.comments);
    } catch (err) {
      if (err.response) {
        console.error(err.response.data);
        console.error(err.response.status);
        console.error(err.response.headers);
      } else {
        console.error(err.message);
      }
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId, isDeleteModalActive]);

  useEffect(()=>{
    const handleKeyDown = (event) => {
      if(event.key === "Escape"){
        setIsModalActive(false)
        setIsDeleteModalActive(false)
      }
    }
    document.addEventListener("keydown", handleKeyDown)

    return() =>{
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  const handleCommentClick = (comment) => {
    setSelectedComment(comment);
    setIsModalActive(true);
  };
  const handleDeleteClick = (comment) => {
    setSelectedComment(comment);
    setIsDeleteModalActive(true)
  }

  return (
    <>
      <h1>Comments</h1>
      <div className="all-comments">
        <div className="post-section">
          <h2>{post.title}</h2>
          <p>{post.snippet}</p>
        </div>
        <div className="comments-section">
          <p>Total Comments: {comments.length}</p>
          {comments.map((comment) => (
            <div className="comment" key={comment._id}>
              <div className="left">
                <h4>{comment?.user?.username}</h4>
                <span className="readmore" onClick={() => handleCommentClick(comment)}>
                  <p className="trail-text">{comment?.comment}</p>
                </span>
              </div>
              <div className="right">
                <p>{comment.date ? format(new Date(comment.date), 'dd MMMM yyyy') : ''}</p>
                <span onClick ={()=> handleDeleteClick(comment)}>
                  <span id="trash" className="material-symbols-outlined">delete</span>
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className={`modal ${isModalActive ? 'active' : ''}`}>
          {isModalActive && (
            <div className="modal-outlet">
              <button className="close-modal-btn" onClick={() => setIsModalActive(false)}>
                <span className="material-symbols-outlined">cancel</span>
              </button>
              <AdminComment comment={selectedComment} closeModal={setIsModalActive} />
            </div>
          )}
        </div>
        <div className={`modal ${isDeleteModalActive ? 'active' : ''}`}>
          {isDeleteModalActive && (
            <div className="modal-outlet">
              <button className="close-modal-btn" onClick={() => setIsDeleteModalActive(false)}>
                <span className="material-symbols-outlined">cancel</span>
              </button>
              <CfmDelete comment={selectedComment} closeModal={setIsDeleteModalActive} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminComments;
