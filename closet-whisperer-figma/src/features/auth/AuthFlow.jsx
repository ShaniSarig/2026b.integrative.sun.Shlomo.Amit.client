import React from 'react';
import { useViewport } from '../../hooks/useViewport.js';
import { useAuthForm } from './useAuthForm.js';
import AuthMobile from './AuthMobile.jsx';
import AuthDesktop from './AuthDesktop.jsx';

export default function AuthFlow({ onAuth, config }) {
  const { variant } = useViewport();
  const auth = useAuthForm({ onAuth, config });
  const Component = variant === 'mobile' ? AuthMobile : AuthDesktop;
  return <Component {...auth} config={config} />;
}
