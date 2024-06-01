import React from 'react'
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import "../../../styles/admin/cfmDelete.scss"
import { useParams } from 'react-router-dom';

const CfmDelete = ({comment, closeModal}) => {
    
    const postId = useParams()
    const commentId = comment._id
    const axiosPrivate = useAxiosPrivate()
    
    const handleYes = async()=>{
        console.log(postId.postId)
        const response = await axiosPrivate.delete(`/admin/dashboard/${postId.postId}/${commentId}/delete`)
        closeModal(false)
    }

    if (!comment) return null;
    return (
        <div className="comment-div">
        <h3>Delete this comment?</h3>
          <span>Comment:</span>
          <p>{comment.comment}</p>
          <div className="button-div">
          <button onClick={() => handleYes()}>Yes</button>
          <button onClick={() => closeModal(false)}>No</button>
          </div>
          
        </div>
  )
}

export default CfmDelete