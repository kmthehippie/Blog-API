import React from 'react';
import { Editor } from '@tinymce/tinymce-react';



const Tinymce = ({ initialContent, setContent }) => {
const vite_key = import.meta.env.VITE_TINYMCE_APIKEY

return (
    <Editor
      apiKey = {vite_key}
      init={{
        plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate mentions tableofcontents footnotes mergetags autocorrect typography inlinecss markdown',
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
      }}
      value={initialContent ? initialContent : "Enter your content here..."}
      onEditorChange={(content) => setContent(content)}
    />
  )
}

export default Tinymce