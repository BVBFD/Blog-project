'use client';

import Link from 'next/link';
import React from 'react';

import styles from './Button.module.scss';

interface ButtonPropsType extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  href: string;
  text: string;
  width: string;
  height: string;
  fontSize?: string;
  openInNewTab?: boolean;
  onClick?: (() => Record<never, string>) | (() => void);
  // style?: React.CSSProperties;
}

const Button = ({ className, href, text, width, height, fontSize, openInNewTab, onClick }: ButtonPropsType) => {
  return (
    <Link
      className={`${className} ${styles.button}`}
      href={href}
      onClick={onClick}
      style={{ width: `${width}` }}
      target={openInNewTab ? '_blank' : '_self'}
    >
      <button style={{ width: `${width}`, height: `${height}`, fontSize: `${fontSize}` }} type="button">
        {text}
      </button>
    </Link>
  );
};

Button.defaultProps = {
  className: '',
  fontSize: '1rem',
  openInNewTab: false,
  onClick: () => {},
  // style: {},
};

export default Button;
