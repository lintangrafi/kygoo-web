'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTheme } from '@/src/contexts/ThemeContext';
import { TextInput, FormSubmit, FormError, FormSuccess } from '@/src/components/FormComponents';
import { validateForm, validators, getError, ValidationError } from '@/src/lib/form-validation';
import { authService } from '@/src/services';

type Step = 'email' | 'verify' | 'reset' | 'success';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { currentTheme } = useTheme();

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const emailValidationRules = {
    email: (v: string) => validators.email(v),
  };

  const passwordValidationRules = {
    password: (v: string) => {
      if (!v || v.length < 8) return 'Password must be at least 8 characters';
      if (!/[A-Z]/.test(v)) return 'Password must contain uppercase letter';
      if (!/[0-9]/.test(v)) return 'Password must contain number';
      return null;
    },
    confirmPassword: (v: string) =>
      formData.password && v !== formData.password
        ? 'Passwords do not match'
        : null,
  };

  const handleEmailSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setErrorMessage(null);

    const validation = validateForm({ email }, emailValidationRules);
    if (!validation.isValid) {
      setErrors(validation.errors as ValidationError[]);
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.requestPasswordReset(email);

      if (response.success) {
        setStep('verify');
        setErrors([]);
      } else {
        throw new Error(response.error || 'Failed to send reset code');
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Email not found in our system'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setErrorMessage(null);

    if (!code || code.length !== 6) {
      setErrorMessage('Please enter a valid 6-digit code');
      return;
    }

    setIsLoading(true);

    try {
      // Verify code is valid (optional backend call)
      setStep('reset');
      setErrors([]);
    } catch (error) {
      setErrorMessage('Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setErrorMessage(null);

    const validation = validateForm(formData, passwordValidationRules);
    if (!validation.isValid) {
      setErrors(validation.errors as ValidationError[]);
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.resetPassword(code, formData.password);

      if (response.success) {
        setStep('success');
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      } else {
        throw new Error(response.error || 'Failed to reset password');
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to reset password'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => prev.filter((err) => err.field !== name));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <motion.div
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1
            className="text-3xl md:text-4xl font-bold mb-2"
            style={{ color: currentTheme.colors.primary }}
          >
            Kygoo Group
          </h1>
          <p className="text-gray-600">Reset your password</p>
        </motion.div>

        {/* Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-lg p-8 border"
            style={{ borderColor: currentTheme.colors.primary + '20' }}
        >
          {/* Step 1: Email */}
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <motion.div variants={itemVariants}>
                <p className="text-sm text-gray-600 mb-4">
                  Enter your email address and we'll send you a code to reset your password.
                </p>
              </motion.div>

              {errorMessage && (
                <motion.div variants={itemVariants}>
                  <FormError message={errorMessage} />
                </motion.div>
              )}

              <motion.div variants={itemVariants}>
                <TextInput
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setEmail(e.target.value);
                    setErrors([]);
                  }}
                  error={getError('email', errors) || undefined}
                  required
                  color={currentTheme.colors.primary}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <FormSubmit isLoading={isLoading} color={currentTheme.colors.primary}>
                  {isLoading ? 'Sending...' : 'Send Reset Code'}
                </FormSubmit>
              </motion.div>
            </form>
          )}

          {/* Step 2: Verification Code */}
          {step === 'verify' && (
            <form onSubmit={handleCodeSubmit} className="space-y-6">
              <motion.div variants={itemVariants}>
                <p className="text-sm text-gray-600 mb-4">
                  We've sent a 6-digit code to <strong>{email}</strong>
                </p>
              </motion.div>

              {errorMessage && (
                <motion.div variants={itemVariants}>
                  <FormError message={errorMessage} />
                </motion.div>
              )}

              <motion.div variants={itemVariants}>
                <TextInput
                  label="Verification Code"
                  name="code"
                  placeholder="000000"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.replace(/\D/g, '').substring(0, 6));
                    setErrorMessage(null);
                  }}
                  maxLength={6}
                  required
                  color={currentTheme.colors.primary}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <FormSubmit isLoading={isLoading} color={currentTheme.colors.primary}>
                  {isLoading ? 'Verifying...' : 'Verify Code'}
                </FormSubmit>
              </motion.div>

              <motion.div variants={itemVariants} className="text-center">
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="text-sm hover:underline"
                  style={{ color: currentTheme.colors.primary }}
                >
                  Use different email
                </button>
              </motion.div>
            </form>
          )}

          {/* Step 3: New Password */}
          {step === 'reset' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <motion.div variants={itemVariants}>
                <p className="text-sm text-gray-600 mb-4">
                  Create a new password for your account.
                </p>
              </motion.div>

              {errorMessage && (
                <motion.div variants={itemVariants}>
                  <FormError message={errorMessage} />
                </motion.div>
              )}

              <motion.div variants={itemVariants}>
                <TextInput
                  label="New Password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handlePasswordChange}
                  error={getError('password', errors) || undefined}
                  helpText="At least 8 characters, 1 uppercase, 1 number"
                  required
                  color={currentTheme.colors.primary}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <TextInput
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handlePasswordChange}
                  error={getError('confirmPassword', errors) || undefined}
                  required
                  color={currentTheme.colors.primary}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <FormSubmit isLoading={isLoading} color={currentTheme.colors.primary}>
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </FormSubmit>
              </motion.div>
            </form>
          )}

          {/* Step 4: Success */}
          {step === 'success' && (
            <form className="space-y-6">
              <motion.div variants={itemVariants} className="text-center">
                <div
                  className="text-4xl mb-4"
                  style={{ color: currentTheme.colors.primary }}
                >
                  ✓
                </div>
                <FormSuccess message="Password reset successful! Redirecting to login..." />
              </motion.div>
            </form>
          )}
        </motion.div>

        {/* Back to Login */}
        {step !== 'success' && (
          <motion.div variants={itemVariants} className="mt-6 text-center">
            <Link
              href="/auth/login"
              className="text-sm hover:underline"
              style={{ color: currentTheme.colors.primary }}
            >
              Back to login
            </Link>
          </motion.div>
        )}
      </motion.div>
    </main>
  );
}
