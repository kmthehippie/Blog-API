import {useState, useEffect, useRef} from 'react';
import Tinymce from './Tinymce';
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import "../../../styles/admin/newPost.scss"
import { useNavigate } from 'react-router-dom';

const NewPost = () => {

  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [snippet, setSnippet] = useState('');
  const [status, setStatus] = useState("Don'tPublish");
  const [imgurl, setImgurl] = useState('');

  const navigate = useNavigate()

  const axiosPrivate = useAxiosPrivate()
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log(title, snippet, content, status, imgurl)
      const response = await axiosPrivate.post('/admin/post/new', {
        title,
        snippet,
        content,
        status,
        imgurl,
      });
      console.log('Post created:', response.data);
      setTimeout(navigate("/admin/dashboard"), 20000)
     
    } catch (error) {
      console.error('Error creating post:', error);
    }

  };

  return (
    <>
    <h1>Create New Post</h1>
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
    </>
  );
};

export default NewPost;
