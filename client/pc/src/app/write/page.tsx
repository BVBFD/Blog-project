import React from 'react';
import styles from './page.module.scss';
import dynamic from 'next/dynamic';

// ReferenceError: self is not defined 에러
// Tui Editor 자체가 서버사이드 렌더링이 아니라 브라우저 렌더링이기 때문에
// self는 브라우저 환경에서 전역개체인 window객체를 가르키는 말.
// 즉 서버사이드 렌더링시 브라우저 환경이 아니기 떄문에 dynamic import를 통해서
// 브라우저 환경에 접속하고 난 다음 import 시켜줘야 에러가 발생하지 않음.
const DynamicEditor = dynamic(() => import('src/components/Write/Editor/Editor'), { ssr: false });

const Write = () => {
  return (
    <section className={styles.container}>
      <DynamicEditor />
    </section>
  );
};

export default Write;
