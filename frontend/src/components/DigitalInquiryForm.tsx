'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { motion } from 'framer-motion';
import {
  TextInput,
  TextArea,
  Select,
  RadioGroup,
  Checkbox,
  FormSubmit,
  FormError,
  FormSuccess,
} from './FormComponents';
import { validateForm, validators, ValidationError, getError } from '../lib/form-validation';
import { digitalService } from '../services';

export interface DigitalInquiryData {
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  serviceCategory: string;
  projectTitle: string;
  budget: string;
  timeline: string;
  requirements: string;
  company: string;
  agreeTerms: boolean;
}

interface DigitalInquiryFormProps {
  onSuccess?: () => void;
  theme?: {
    color: string;
    name: string;
  };
}

const serviceCategories = [
  { value: 'web', label: 'Web Development' },
  { value: 'mobile', label: 'Mobile App Development' },
  { value: 'design', label: 'UI/UX Design' },
  { value: 'api', label: 'API & Backend Development' },
  { value: 'data', label: 'Data & Analytics' },
  { value: 'cloud', label: 'Cloud Infrastructure' },
];

const budgetRanges = [
  { value: '<50m', label: 'Under Rp 50,000,000' },
  { value: '50-200m', label: 'Rp 50,000,000 - Rp 200,000,000' },
  { value: '200-500m', label: 'Rp 200,000,000 - Rp 500,000,000' },
  { value: '>500m', label: 'Over Rp 500,000,000' },
];

const timelines = [
  { value: '1-3m', label: '1-3 Months' },
  { value: '3-6m', label: '3-6 Months' },
  { value: '6-12m', label: '6-12 Months' },
  { value: '>12m', label: 'Over 1 Year' },
  { value: 'flexible', label: 'Flexible' },
];

export const DigitalInquiryForm = ({
  onSuccess,
  theme = { color: '#00d084', name: 'Digital' },
}: DigitalInquiryFormProps) => {
  const [formData, setFormData] = useState<DigitalInquiryData>({
    companyName: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    serviceCategory: '',
    projectTitle: '',
    budget: '',
    timeline: '',
    requirements: '',
    company: '',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validationRules = {
    companyName: (v: string) => validators.text(v, 2, 100),
    contactName: (v: string) => validators.text(v, 2, 100),
    contactEmail: (v: string) => validators.email(v),
    contactPhone: (v: string) => validators.phone(v),
    serviceCategory: (v: string) => validators.select(v),
    projectTitle: (v: string) => validators.text(v, 5, 200),
    budget: (v: string) => validators.select(v),
    timeline: (v: string) => validators.select(v),
    requirements: (v: string) => validators.textarea(v),
    agreeTerms: (v: boolean) => (!v ? 'You must agree to terms' : null),
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, type, value } = e.target as HTMLInputElement & { type: string; value: string };

    if (type === 'checkbox') {
      setFormData((prev: DigitalInquiryData): DigitalInquiryData => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev: DigitalInquiryData): DigitalInquiryData => ({
        ...prev,
        [name]: value,
      }));
    }

    setErrors((prev: ValidationError[]): ValidationError[] => prev.filter((err) => err.field !== name));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    const validation = validateForm(formData as any, validationRules);
    if (!validation.isValid) {
      setErrors(validation.errors as ValidationError[]);
      return;
    }

    setIsLoading(true);

    try {
      const response = await digitalService.createProjectInquiry({
        title: formData.projectTitle,
        description: formData.requirements,
        service_id: formData.serviceCategory,
        client_name: formData.contactName,
        client_email: formData.contactEmail,
        budget: parseFloat(formData.budget) || 0,
        timeline: formData.timeline,
        requirements: formData.requirements,
      });

      if (response.success) {
        setSuccessMessage(
          'Inquiry submitted successfully! Our team will review and contact you within 2 business days.'
        );
        setFormData({
          companyName: '',
          contactName: '',
          contactEmail: '',
          contactPhone: '',
          serviceCategory: '',
          projectTitle: '',
          budget: '',
          timeline: '',
          requirements: '',
          company: '',
          agreeTerms: false,
        });
        if (onSuccess) onSuccess();
      } else {
        throw new Error(response.error || 'Inquiry submission failed');
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to submit inquiry');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="w-full max-w-3xl mx-auto"
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

      {/* Company Information */}
      <motion.div variants={itemVariants} className="mb-8">
        <h3 className="text-lg font-bold mb-6" style={{ color: theme.color }}>
          Company Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <TextInput
            label="Company Name"
            name="companyName"
            placeholder="Your Company"
            value={formData.companyName}
            onChange={handleChange}
            error={getError('companyName', errors) || undefined}
            required
            color={theme.color}
          />
          <TextInput
            label="Contact Name"
            name="contactName"
            placeholder="Full Name"
            value={formData.contactName}
            onChange={handleChange}
            error={getError('contactName', errors) || undefined}
            required
            color={theme.color}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextInput
            label="Email Address"
            name="contactEmail"
            type="email"
            placeholder="you@company.com"
            value={formData.contactEmail}
            onChange={handleChange}
            error={getError('contactEmail', errors) || undefined}
            required
            color={theme.color}
          />
          <TextInput
            label="Phone Number"
            name="contactPhone"
            type="tel"
            placeholder="+62 812 3456 7890"
            value={formData.contactPhone}
            onChange={handleChange}
            error={getError('contactPhone', errors) || undefined}
            required
            color={theme.color}
          />
        </div>
      </motion.div>

      {/* Project Details */}
      <motion.div variants={itemVariants} className="mb-8">
        <h3 className="text-lg font-bold mb-6" style={{ color: theme.color }}>
          Project Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Select
            label="Service Category"
            name="serviceCategory"
            value={formData.serviceCategory}
            onChange={handleChange}
            options={serviceCategories}
            error={getError('serviceCategory', errors) || undefined}
            required
            color={theme.color}
          />
          <TextInput
            label="Project Title"
            name="projectTitle"
            placeholder="Project Name"
            value={formData.projectTitle}
            onChange={handleChange}
            error={getError('projectTitle', errors) || undefined}
            required
            color={theme.color}
          />
        </div>

        <TextArea
          label="Project Requirements & Description"
          name="requirements"
          placeholder="Describe your project, goals, features, and any specific requirements..."
          value={formData.requirements}
          onChange={handleChange}
          error={getError('requirements', errors) || undefined}
          rows={6}
          color={theme.color}
        />
      </motion.div>

      {/* Budget & Timeline */}
      <motion.div variants={itemVariants} className="mb-8">
        <h3 className="text-lg font-bold mb-6" style={{ color: theme.color }}>
          Budget & Timeline
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Select
            label="Budget Range"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            options={budgetRanges}
            error={getError('budget', errors) || undefined}
            required
            color={theme.color}
          />
          <Select
            label="Project Timeline"
            name="timeline"
            value={formData.timeline}
            onChange={handleChange}
            options={timelines}
            error={getError('timeline', errors) || undefined}
            required
            color={theme.color}
          />
        </div>
      </motion.div>

      {/* Terms */}
      <motion.div variants={itemVariants} className="mb-8">
        <Checkbox
          label="I agree to Digital's inquiry terms and privacy policy"
          name="agreeTerms"
          checked={formData.agreeTerms}
          onChange={handleChange}
          error={getError('agreeTerms', errors) || undefined}
          color={theme.color}
        />
      </motion.div>

      {/* Submit */}
      <motion.div variants={itemVariants}>
        <FormSubmit isLoading={isLoading} color={theme.color}>
          Submit Inquiry
        </FormSubmit>
      </motion.div>
    </motion.form>
  );
};
