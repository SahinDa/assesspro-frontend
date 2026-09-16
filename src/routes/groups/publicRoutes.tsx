import { Route } from 'react-router-dom';
import { lazy } from 'react';
import SignInView from '@/modules/auth/views/SignInView';

const SignUpView = lazy(() => import('@/modules/auth/views/SignUpView'));
const VerifyOtpView = lazy(() => import('@/modules/auth/views/VerifyOtpView'));
const ForgotPasswordView = lazy(() => import('@/modules/auth/views/ForgotPasswordView'));
const ResetPasswordView = lazy(() => import('@/modules/auth/views/ResetPasswordView'));

export const publicRoutes = (
  <>
    <Route path="/signin" element={<SignInView />} />
    <Route path="/signup" element={<SignUpView />} />
    <Route path="/verify-otp" element={<VerifyOtpView />} />
    <Route path="/forgot-password" element={<ForgotPasswordView />} />
    <Route path="/reset-password" element={<ResetPasswordView />} />
  </>
);