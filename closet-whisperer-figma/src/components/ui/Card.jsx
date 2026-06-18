import React from 'react';

export default function Card({ className = '', as: Tag = 'div', padded = true, children, ...rest }) {
  return (
    <Tag
      className={`bg-white border border-border-subtle rounded-lg shadow-card ${
        padded ? 'p-5' : ''
      } ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
