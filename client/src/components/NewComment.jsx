import { useState } from 'react';
import { useParams } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import "../../styles/new-comment.scss"
import useAuth from "../hooks/useAuth"


const NewComment = () => {
  const { auth } = useAuth()
  const { postId } = useParams()
  const axiosPrivate = useAxiosPrivate();
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosPrivate.post(`/post/${postId}/comment/new`, 
        JSON.stringify({
          "comment" : comment
        }),  {   
          headers: {"Content-Type": "application/json"},
          credentials: "include"
      }
      );
      // Handle success, reset form and update UI as needed
   
      setSuccessMessage(`${JSON.stringify(response.data.comment)}`)
      setComment('');
      setError('');
    } catch (error) {
      // Handle error
      console.error('Error creating new comment:', error);
      setError('Failed to create new comment');
    }
  };

  return (
    <>
    {successMessage && <div className='success-message'>
      <h4>Success!</h4>
      <p className="response-comment-p">The comment: <br/>
      <br/> <div className="response-comment">{(successMessage)}</div> <br/><br/>has been added</p>
      </div>}
    {!successMessage && <div className="new-comment-form">
    <p>Hi <span className='username'>{auth.username}</span><br/> Add your comment here!</p>
    <form onSubmit={handleSubmit}>
      <textarea
        value={comment}
        onChange={(e) => 
          setComment(e.target.value) }
        placeholder="Enter your comment"
        required
      />
      <button type="submit">Submit</button>
    </form>
    {error && <div className="error">{error}</div>}
  </div>}
  </>
  );
};

export default NewComment;
