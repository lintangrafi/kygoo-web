'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TextInput,
  TextArea,
  Select,
  Checkbox,
  FormGroup,
  FormSubmit,
  FormError,
  FormSuccess,
} from '@/src/components/FormComponents';
import { validateForm, validators, ValidationError, getError } from '@/src/lib/form-validation';

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  businessLine?: string;
  subject: string;
  message: string;
  agreeTerms: boolean;
}

interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => Promise<void>;
  businessLineOptions?: Array<{ value: string; label: string }>;
  theme?: {
    color: string;
    name: string;
  };
  showBusinessLine?: boolean;
}

export const ContactForm = ({
  onSubmit,
  businessLineOptions = [
    { value: 'studio', label: '📷 Studio' },
    { value: 'photobooth', label: '📸 Photobooth' },
    { value: 'digital', label: '💻 Digital' },
    { value: 'coffee', label: '☕ Coffee' },
  ],
  theme = { color: '#00d084', name: 'Digital' },
  showBusinessLine = true,
}: ContactFormProps) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    businessLine: '',
    subject: '',
    message: '',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validationRules = {
    name: (v: string) => validators.text(v, 2, 100),
    email: (v: string) => validators.email(v),
    phone: (v: string) => validators.phone(v),
    subject: (v: string) => validators.text(v, 5, 200),
    message: (v: string) => validators.textarea(v, 20, 2000),
    agreeTerms: (v: boolean) => (!v ? 'You must agree to terms' : null),
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, type, value } = e.target as any;

    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error for this field when user starts typing
    setErrors((prev) => prev.filter((err) => err.field !== name));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    // Validate form
    const validation = validateForm(formData, validationRules);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);

    try {
      if (onSubmit) {
        await onSubmit(formData);
      }

      setSuccessMessage('Thank you! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        businessLine: '',
        subject: '',
        message: '',
        agreeTerms: false,
      });
      setErrors([]);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {successMessage && (
        <motion.div variants={itemVariants} className="mb-6">
          <FormSuccess message={successMessage} />
        </motion.div>
      )}

      {errorMessage && (
        <motion.div variants={itemVariants} className="mb-6">
          <FormError message={errorMessage} />
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="mb-8">
        <TextInput
          label="Full Name"
          name="name"
          placeholder="John Doe"
          value={formData.name}
          onChange={handleChange}
          error={getError('name', errors) || undefined}
          required
          color={theme.color}
        />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <TextInput
          label="Email Address"
          name="email"
          type="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={handleChange}
          error={getError('email', errors) || undefined}
          required
          color={theme.color}
        />
        <TextInput
          label="Phone Number"
          name="phone"
          type="tel"
          placeholder="+62 812 3456 7890"
          value={formData.phone}
          onChange={handleChange}
          error={getError('phone', errors) || undefined}
          required
          color={theme.color}
        />
      </motion.div>

      {showBusinessLine && (
        <motion.div variants={itemVariants} className="mb-8">
          <Select
            label="Business Line (Optional)"
            name="businessLine"
            value={formData.businessLine}
            onChange={handleChange}
            options={businessLineOptions}
            color={theme.color}
          />
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="mb-8">
        <TextInput
          label="Subject"
          name="subject"
          placeholder="What is this about?"
          value={formData.subject}
          onChange={handleChange}
          error={getError('subject', errors) || undefined}
          required
          color={theme.color}
        />
      </motion.div>

      <motion.div variants={itemVariants} className="mb-8">
        <TextArea
          label="Message"
          name="message"
          placeholder="Tell us more about your inquiry..."
          value={formData.message}
          onChange={handleChange}
          error={getError('message', errors) || undefined}
          required
          rows={6}
          color={theme.color}
        />
      </motion.div>

      <motion.div variants={itemVariants} className="mb-8">
        <Checkbox
          label="I agree to the terms and privacy policy"
          name="agreeTerms"
          checked={formData.agreeTerms}
          onChange={handleChange}
          error={getError('agreeTerms', errors) || undefined}
          color={theme.color}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <FormSubmit isLoading={isLoading} color={theme.color}>
          Send Message
        </FormSubmit>
      </motion.div>
    </motion.form>
  );
};
