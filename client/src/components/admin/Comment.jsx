import React from 'react';
import "../../../styles/admin/adminComment.scss"

const AdminComment = ({ comment, closeModal }) => {
  if (!comment) return null;

  return (
    <div className="comment-div">
    <h3>Author: {comment.user?.username}</h3>
      <span>Comment:</span>
      <p>{comment.comment}</p>
      <button onClick={() => closeModal(false)}>Close</button>
    </div>
  );
};

export default AdminComment;
