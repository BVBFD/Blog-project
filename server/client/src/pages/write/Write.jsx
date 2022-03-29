import React, { useContext, useEffect, useRef, useState } from 'react';
import Header from '../../components/header/Header.jsx';
import styles from './Write.module.css';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import { Context } from '../../context/context.js';
import { useParams } from 'react-router-dom';
import { axiosInstance } from '../../config.js';

const Write = () => {
  const [title, setTitle] = useState('');
  const [titleImg, setTitleImg] = useState();
  const [writePageImgURL, setWritePageImgURL] = useState('');
  const [catName, setCatName] = useState('HTML');
  const { id, editable } = useContext(Context);
  const [editorText, setEditorText] = useState('');
  const editorRef = useRef();
  const param = useParams();
  const [postForEdit, setPostForEdit] = useState({});

  useEffect(async () => {
    if (param.id) {
      const response = await axiosInstance.get(`/posts/${param.id}`);
      setTitleImg(true);
      setPostForEdit(response.data);
      setTitle(response.data.title);
      setWritePageImgURL(response.data.imgUrl);
      setCatName(response.data.catName);
      setEditorText(response.data.text);
    }
    return () => setTitleImg();
  }, [param.id]);

  useEffect(() => {
    if (editorRef.current) {
      // 기존에 Image 를 Import 하는 Hook을 제거한다.
      editorRef.current.getInstance().removeHook('addImageBlobHook');

      // 새롭게 Image 를 Import 하는 Hook을 생성한다.
      editorRef.current
        .getInstance()
        .addHook('addImageBlobHook', (blob, callback) => {
          (async () => {
            let formData = new FormData();
            let fileName = `${Date.now()}${blob.name}`;
            formData.append('name', fileName);
            formData.append('file', blob);

            console.log('이미지가 업로드 됐습니다.');

            try {
              // 기존 APIs request 문법!
              const response = await fetch(
                `https://myportfolioblogproject.herokuapp.com/pic/upload`,
                {
                  method: 'POST',
                  mode: 'cors',
                  // headers: {
                  //   Authorization: `Bearer ${token}`,
                  // },
                  credentials: 'include',
                  headers: {
                    Origin: `https://res.cloudinary.com`,
                  },
                  body: formData,
                }
              );
              const updatedPicURL = await response.json();
              const imageUrl = updatedPicURL;

              // axios 라이브러리 사용!
              // const res = await axiosInstance.post(`/pic/upload`, formData);
              // const imageUrl = res.data;
              callback(imageUrl, 'image');
            } catch (err) {
              console.log(err);
            }
          })();

          return false;
        });
    }

    return () => {};
  }, [editorRef]);

  const selectImg = async (e) => {
    // 기존 APIs request 문법!
    setTitleImg(e.target.files[0]);
    if (e.target.files[0]) {
      const data = new FormData();
      const filename = `${Date.now()}${e.target.files[0].name}`;
      data.append('name', filename);
      data.append('file', e.target.files[0]);
      try {
        const response = await fetch(
          `https://myportfolioblogproject.herokuapp.com/pic/upload`,
          {
            method: 'POST',
            mode: 'cors',
            // headers: {
            //   Authorization: `Bearer ${token}`,
            // },
            body: data,
          }
        );
        const updatedPicURL = await response.json();
        setWritePageImgURL(updatedPicURL);
      } catch (err) {
        window.alert(err);
      }
    }

    // axios 라이브러리 사용!
    // setTitleImg(e.target.files[0]);
    // if (e.target.files[0]) {
    //   const data = new FormData();
    //   const filename = `${Date.now()}${e.target.files[0].name}`;
    //   data.append("name", filename);
    //   data.append("file", e.target.files[0]);
    //   try {
    //     const res = await axios.post(
    //       `${process.env.REACT_APP_BASE_URL}/pic/upload`,
    //       data
    //     );
    //     setWritePageImgURL(res.data);
    //   } catch (err) {
    //     console.log(err);
    //   }
    // }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (id !== 'lse126' || !editable) {
      window.alert('개인블로그 입니다. 편집은 주인장만 가능!');
      return;
    }
    // 기존 APIs request 문법!
    try {
      const response = await fetch(
        `https://myportfolioblogproject.herokuapp.com/posts`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            imgUrl: writePageImgURL,
            title: title,
            text: editorText,
            catName: catName,
            author: id,
          }),
        }
      );
      const data = await response.json();
      window.location.replace(`/post/${data.savedNewPost._id}`);
    } catch (err) {
      window.alert('개인블로그 입니다. 편집은 주인장만 가능!');
    }

    // axios 라이브러리 사용!
    // try {
    //   const res = await axios.post(
    //     `${process.env.REACT_APP_BASE_URL}/posts`,
    //     {
    //       imgUrl: writePageImgURL,
    //       title: title,
    //       text: editorText,
    //       catName: catName,
    //       author: id,
    //     }
    //   );
    //   console.log(res);
    //   window.location.replace(`/post/${res.data.savedNewPost?._id}`);
    // } catch (err) {
    //   console.log(err);
    // }
  };

  const handleEdit = async (event) => {
    event.preventDefault();
    // 기존 APIs request 문법!
    try {
      const res = await fetch(
        `https://myportfolioblogproject.herokuapp.com/posts/${param.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            // Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            imgUrl: writePageImgURL,
            title: title,
            text: editorText,
            catName: catName,
            author: id,
          }),
        }
      );

      const data = await res.json();

      console.log(data);

      res.status === 401 &&
        window.alert(`${res.statusText} 이 글 작성자만 편집할 수 있습니다!`);

      res.status === 201 && window.location.replace(`/post/${param.id}`);
    } catch (err) {
      window.alert(err);
    }

    // axios 라이브러리 사용!
    // try {
    //   await axios.put(`${process.env.REACT_APP_BASE_URL}/posts/${param.id}`, {
    //     imgUrl: writePageImgURL,
    //     title: title,
    //     text: editorText,
    //     catName: catName,
    //     author: id,
    //   });
    //   window.location.replace(`/post/${param.id}`);
    // } catch (err) {
    //   console.log(err);
    // }
  };

  return (
    <section className={styles.write}>
      <Header />
      {titleImg ? (
        <div className={styles.titleImgBox}>
          <img
            src={param.id ? postForEdit.imgUrl : writePageImgURL}
            alt=''
            crossOrigin='anonymous'
          />
        </div>
      ) : (
        <img src='../images/postdefaultimg.png' style={{ width: '100%' }} />
      )}
      <form
        onSubmit={param.id === undefined ? handleSubmit : handleEdit}
        className={styles.titleImgAddBox}
      >
        <div className={styles.titleInputBox}>
          <label className={styles.imgFileLabel} htmlFor='imgFileInput'>
            <i class='fas fa-plus'></i>
          </label>
          <input
            onChange={selectImg}
            id='imgFileInput'
            type='file'
            style={{ display: 'none' }}
          />
          <input
            className={styles.titleInput}
            type='text'
            autoFocus={true}
            placeholder='Title'
            onChange={(e) => setTitle(e.target.value)}
            defaultValue={param.id ? postForEdit.title : ''}
          />
          <select
            onChange={(e) => setCatName(e.target.value)}
            name='Category'
            className={styles.selectCategory}
            defaultValue={param.id ? postForEdit.catName : 'HTML'}
          >
            <option value='HTML'>HTML</option>
            <option value='CSS'>CSS</option>
            <option value='JavaScript'>JavaScript</option>
            <option value='React'>React</option>
            <option value='Node JS'>Node JS</option>
            <option value='TypeScript'>TypeScript</option>
            <option value='Game'>Game</option>
            <option value='Book'>Book</option>
          </select>
          <button type='submit' className={styles.uploadBtn}>
            Upload
          </button>
        </div>
        <Editor
          className={styles.editor}
          ref={editorRef}
          onChange={(e) =>
            setEditorText(editorRef.current?.getInstance().getHTML())
          }
          previewStyle='vertical'
          height='90vh'
          initialValue={postForEdit?.text}
          initialEditType='markdown'
          toolbarItems={[
            ['heading', 'bold', 'italic', 'strike'],
            ['hr', 'quote'],
            ['ul', 'ol', 'task', 'indent', 'outdent'],
            ['table', 'image', 'link'],
            ['code', 'codeblock'],
          ]}
          plugins={[colorSyntax]}
          customHTMLRenderer={{
            image(node, context) {
              const { destination } = node;
              const { getChildrenText, skipChildren } = context;
              skipChildren();
              return {
                type: 'openTag',
                tagName: 'img',
                selfClose: true,
                attributes: {
                  src: destination,
                  alt: getChildrenText(node),
                  crossOrigin: 'anonymous',
                },
              };
            },
          }}
        />
        {param.id && (
          <div
            style={{
              width: '100%',
              padding: '1.2rem',
              backgroundColor: '#999',
              color: '#fff',
            }}
          >
            {postForEdit.text}
          </div>
        )}
      </form>
    </section>
  );
};

export default Write;
