import React, { useState, useEffect } from 'react';
import Tinymce from './Tinymce';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useNavigate, useParams } from 'react-router-dom';
import "../../../styles/admin/updatePost.scss"

const UpdatePost = () => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [snippet, setSnippet] = useState('');
  const [status, setStatus] = useState("Don'tPublish");
  const [imgurl, setImgurl] = useState('');
  const { postId } = useParams();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await axiosPrivate.get(`/admin/post/${postId}/update`);
        const { post } = response.data;
        setTitle(post.title);
        setSnippet(post.snippet);
        setContent(post.content);
        setStatus(post.status);
        setImgurl(post.imgurl);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPostData();
  }, [axiosPrivate, postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosPrivate.post(`/admin/post/${postId}/update`, {
        title,
        snippet,
        content,
        status,
        imgurl,
      });
      console.log('Post created:', response.data);
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="update-post">
    <h1>Update Post: </h1>
    <p>{title}</p>
    <hr/>
      <form onSubmit={handleSubmit}>
        <div className="form-block">
        <label htmlFor="title">Title: </label> 
        <input
        id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        </div>
        <div className="form-block">
        <label htmlFor="snippet">Snippet: </label>
        <input
        id="snippet"
          type="text"
          value={snippet}
          onChange={(e) => setSnippet(e.target.value)}
          placeholder="Snippet"
        />
        </div>
        
        <Tinymce initialContent = {content} setContent={setContent} />
        <div className="form-block">
        <label htmlFor="status">Status: </label> 
        <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} required>
        <option value="">Select Status</option>
        <option value="Publish">Publish</option>
        <option value="Don't Publish">Don't Publish</option>
        </select>
        </div>
        
        <div className="form-block"> 
        <label htmlFor="imgurl">Image URL: </label> 
        <input
        id="imgurl"
          type="text"
          value={imgurl}
          onChange={(e) => setImgurl(e.target.value)}
          placeholder="Image URL"
        />
        </div>
       
        <button type="submit">Update Post</button>
      </form>
    </div>
  );
};

export default UpdatePost;
