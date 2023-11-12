import React, { useEffect, useRef, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';

interface CKeditorProps {
  onChange: (data: string) => void;
  editorLoaded: boolean;
  name: string;
  value: string;
}

export default function CKeditor({
  onChange,
  editorLoaded,
  name,
  value,
}: CKeditorProps) {
  const editorRef = useRef<{ CKEditor: typeof CKEditor; ClassicEditor: typeof ClassicEditor }|any>();
  
  const [editorData, setEditorData] = useState<any>('')
  useEffect(() => {
    console.log(editorData);
    
  }, [editorData])
  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
      ClassicEditor: require("@ckeditor/ckeditor5-build-classic"),
    };
  }, []);
  const handleImageUpload = async (file:any) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('dir', 'blog_post');

      const response = await fetch(process.env.NEXT_PUBLIC_API_URL+'/api/v1/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        
        const imageUrl = await response.text();
        const url = process.env.NEXT_PUBLIC_UPLOAD_PATH+JSON.parse(imageUrl).url
        const imgElement = `<figure class="image"><img src="${url}" alt="blog_image" /></figure>`;
        //setEditorData(editorData + imgElement);
        //onChange(data + imgElement)
        return url
      }else{
        alert('تصویر بارگذاری نشد')
      }
    } catch (error) {
      console.error('Image upload failed:', error);
    }
  };

  const setupEditor = (editor:any) => {
    editorRef.current = editor;
    editor.plugins.get('FileRepository').createUploadAdapter = (loader:any) => {
      return {
        upload: async () => {
          const file = await loader.file;
          const url = handleImageUpload(file);

          return new Promise((resolve, reject) => {
            url.then((e) => {
                        
              resolve({ default:  e});
            })
          });
        },
      };
    };
  }
  return (
    <>
      {editorLoaded ? (
        <CKEditor
          editor={ClassicEditor}
          data={value}
          onChange={(event: any, editor: any) => {
            const data = editor.getData();            
            setEditorData(data)            
            onChange(data);
          }}
          onReady={setupEditor}
          config={{  
            language:'fa',
            ckfinder: {
              uploadUrl: '/api/upload', // مسیر آپلود تصویر
            },
          }}
          ref={editorRef}
        />
      ) : (
        <div>Editor loading</div>
      )}
    </>
  );
}