import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from "../hooks/useAuth";
import Unauthorized from './Unauthorized';
import "../../styles/delete-comment.scss";

const DeleteComment = () => {
  const { auth, closeModal } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const { postId, commentId } = useParams();
  const [formData, setFormData] = useState({});
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const fetchDelete = async () => {
      try {
        const response = await axiosPrivate.get(`/post/${postId}/comment/${commentId}/delete`, {
          signal: controller.signal
        });
        const commentData = response.data;
        if (isMounted) {
          setFormData({
            "_id": commentData._id,
            "post": commentData.post,
            "comment": commentData.comment,
            "user": commentData.user,
            "date": commentData.date
          });
          setIsAuthorized(commentData.user === auth.userId);
        }
      } catch (error) {
        console.error('Error fetching comment:', error);
      }
    };
    fetchDelete();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [commentId, auth.userId, axiosPrivate, postId]);

  const handleYes = async (e) => {
    e.preventDefault();
    try {
      await axiosPrivate.delete(`/post/${postId}/comment/${commentId}/delete`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      });
      setSuccessMessage("Comment deleted successfully!");
    
   
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleNo = () => {
    closeModal()
  };

  if (!isAuthorized) {
    return <Unauthorized />;
  }

  return (
    <div>
      {successMessage && (
        <div className="success-message">
          <h2>{successMessage}</h2>
        </div>
      )}
      {!successMessage && formData.user === auth.userId && (
        <div className='delete-comment-form'>
          <p>Hello <span className='username'>{auth.username}</span></p>
          <p>Delete your following comment?</p>
          <div className="comment-details">
            <p>{formData.comment}</p>
          </div>
          <button onClick={handleYes}>Yes</button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <button onClick={handleNo}>No</button>
        </div>
      )}
    </div>
  );
};

export default DeleteComment;
