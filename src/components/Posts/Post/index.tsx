import Image from 'next/image';
import styles from './index.module.scss';

interface PostType {
  _id: string;
  __v: number;
  updatedAt: string;
  title: string;
  text: string;
  imgUrl: string;
  createdAt: string;
  catName: string;
  author: string;
}

const Post = ({ post }: { post: PostType }) => {
  const inputText = () => {
    return { __html: `${post?.text}` };
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.imgBox}>
        <Image alt="postImg" crossOrigin="anonymous" fill objectFit="contain" src={post?.imgUrl} />
      </div>
      <div className={styles.content}>
        <header>{post?.title}</header>
        <span>{new Date(post?.createdAt).toDateString()}</span>
        <div dangerouslySetInnerHTML={inputText()} />
      </div>
    </div>
  );
};

export default Post;