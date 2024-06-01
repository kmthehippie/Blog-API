import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from "../hooks/useAuth"
import Unauthorized from './Unauthorized';
import "../../styles/update-comment.scss"

const UpdateComment = () => {

  const { auth } = useAuth()
  const axiosPrivate = useAxiosPrivate()
  const { postId, commentId } = useParams();
  const [formData, setFormData] = useState({});
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()
    const fetchComment = async () => {
      try { 
        const response = await axiosPrivate.get(`/post/${postId}/comment/${commentId}/update`,{
          signal: controller.signal
        });
        const commentData = response.data
        isMounted && setFormData({
          "_id": commentData._id,
          "post": commentData.post,
          "comment": commentData.comment,
          "user": commentData.user,
          "date": commentData.date
        });
        setIsAuthorized(commentData.user === auth.userId)

      } catch (error) {
        if (error.name === 'AbortError') {
          // Ignore AbortError due to cancellation
          console.log('Fetch request aborted');
      } else {
          console.error('Error fetching comment:', error);
      }
      }
    };
    fetchComment();
    return ()=>{
      isMounted = false
      controller.abort()
    }
  }, [commentId, auth.userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosPrivate.patch(
        `/post/${postId}/comment/${commentId}/update`,
        JSON.stringify(formData),
        {
          headers: { "Content-Type": "application/json"},
          credentials: "include"
        }
      );
      setSuccessMessage("Comment updated successfully!")
    } catch (error) {
      console.error('Error updating comment:', error);
    }
    
  };

  if(!isAuthorized){
    return <Unauthorized />
  }
  return (
    <div>
      {successMessage && <div className="success-message">
        <h2>{successMessage}</h2></div>}
      {!successMessage && JSON.stringify(formData) !== "{}" && formData.user === auth.userId && (
        <div className='update-comment-form'>
          <p>Hello <span className='username'>{auth.username}</span></p>
          <p>Edit the following to update your comment.</p>
          <form>            
            <label htmlFor="comment">Comment:</label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              required
            />
            <button onClick={handleSubmit}>Update Comment</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default UpdateComment;
