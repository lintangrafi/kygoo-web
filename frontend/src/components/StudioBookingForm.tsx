'use client';

import { useState } from 'react';
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
} from '@/src/components/FormComponents';
import { validateForm, validators, ValidationError, getError } from '@/src/lib/form-validation';
import { studioService } from '@/src/services';

export interface StudioBookingData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  packageId: string;
  eventDate: string;
  eventTime: string;
  eventType: string;
  guestCount: string;
  venue: string;
  specialRequests: string;
  agreeTerms: boolean;
}

interface StudioBookingFormProps {
  onSuccess?: () => void;
  theme?: {
    color: string;
    name: string;
  };
}

const services = [
  { value: 'wedding', label: 'Wedding Photography' },
  { value: 'corporate', label: 'Corporate Events' },
  { value: 'portrait', label: 'Portrait Sessions' },
  { value: 'video', label: 'Videography' },
  { value: 'editing', label: 'Editing & Retouching' },
  { value: 'album', label: 'Album Design' },
];

const packages = [
  { value: 'snow-white', label: 'Snow White - 50K / 10 menit, 75K / 15 menit' },
  { value: 'nassau-blue', label: 'Nassau Blue - 50K / 10 menit, 75K / 15 menit' },
  { value: 'grey-curtain', label: 'Grey Curtain - 35K / 5 menit, 50K / 10 menit' },
  { value: 'livingroom', label: 'Livingroom - 50K / 10 menit, 75K / 15 menit' },
  { value: 'spotlight-box', label: 'Spotlight Box - 50K / 10 menit, 75K / 15 menit' },
  { value: 'elevator-vintage', label: 'Elevator Vintage - 35K / 1 sesi, 50K / 2 sesi' },
  { value: 'window-background', label: 'Window Background - 50K / 10 menit, 75K / 15 menit' },
  { value: 'beige', label: 'Beige - 50K / 10 menit, 75K / 15 menit' },
  { value: 'vintage-box', label: 'Vintage Box - 50K / 10 menit, 75K / 15 menit' },
  { value: 'industrial-wall', label: 'Industrial Wall - 50K / 10 menit, 75K / 15 menit' },
];

export const StudioBookingForm = ({
  onSuccess,
  theme = { color: '#d4af37', name: 'Studio' },
}: StudioBookingFormProps) => {
  const [formData, setFormData] = useState<StudioBookingData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    serviceId: '',
    packageId: '',
    eventDate: '',
    eventTime: '',
    eventType: 'wedding',
    guestCount: '',
    venue: '',
    specialRequests: '',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validationRules = {
    customerName: (v: string) => validators.text(v, 2, 100),
    customerEmail: (v: string) => validators.email(v),
    customerPhone: (v: string) => validators.phone(v),
    serviceId: (v: string) => validators.select(v),
    packageId: (v: string) => validators.select(v),
    eventDate: (v: string) => validators.date(v),
    eventTime: (v: string) => validators.time(v),
    guestCount: (v: string) => validators.number(v),
    venue: (v: string) => validators.text(v, 3, 200),
    agreeTerms: (v: boolean) => (!v ? 'You must agree to booking terms' : null),
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

    setErrors((prev) => prev.filter((err) => err.field !== name));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    const validation = validateForm(formData, validationRules);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await studioService.createBooking({
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        service_id: formData.serviceId,
        date: formData.eventDate,
        time: formData.eventTime,
        notes: formData.specialRequests,
      });

      if (response.success) {
        setSuccessMessage('Booking request sent! We will confirm within 24 hours.');
        setFormData({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          serviceId: '',
          packageId: '',
          eventDate: '',
          eventTime: '',
          eventType: 'wedding',
          guestCount: '',
          venue: '',
          specialRequests: '',
          agreeTerms: false,
        });
        if (onSuccess) onSuccess();
      } else {
        throw new Error(response.error || 'Booking failed');
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to submit booking');
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

      {/* Contact Information */}
      <motion.div variants={itemVariants} className="mb-8">
        <h3 className="text-lg font-bold mb-6" style={{ color: theme.color }}>
          Your Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <TextInput
            label="Full Name"
            name="customerName"
            placeholder="John Doe"
            value={formData.customerName}
            onChange={handleChange}
            error={getError('customerName', errors) || undefined}
            required
            color={theme.color}
          />
          <TextInput
            label="Email"
            name="customerEmail"
            type="email"
            placeholder="john@example.com"
            value={formData.customerEmail}
            onChange={handleChange}
            error={getError('customerEmail', errors) || undefined}
            required
            color={theme.color}
          />
        </div>

        <TextInput
          label="Phone Number"
          name="customerPhone"
          type="tel"
          placeholder="+62 812 3456 7890"
          value={formData.customerPhone}
          onChange={handleChange}
          error={getError('customerPhone', errors) || undefined}
          required
          color={theme.color}
        />
      </motion.div>

      {/* Service Selection */}
      <motion.div variants={itemVariants} className="mb-8">
        <h3 className="text-lg font-bold mb-6" style={{ color: theme.color }}>
          Service Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Select
            label="Service Type"
            name="serviceId"
            value={formData.serviceId}
            onChange={handleChange}
            options={services}
            error={getError('serviceId', errors) || undefined}
            required
            color={theme.color}
          />
          <Select
            label="Package"
            name="packageId"
            value={formData.packageId}
            onChange={handleChange}
            options={packages}
            error={getError('packageId', errors) || undefined}
            required
            color={theme.color}
          />
        </div>

        <TextInput
          label="Venue/Location"
          name="venue"
          placeholder="Event venue address"
          value={formData.venue}
          onChange={handleChange}
          error={getError('venue', errors) || undefined}
          required
          color={theme.color}
        />
      </motion.div>

      {/* Event Details */}
      <motion.div variants={itemVariants} className="mb-8">
        <h3 className="text-lg font-bold mb-6" style={{ color: theme.color }}>
          Event Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <TextInput
            label="Event Date"
            name="eventDate"
            type="date"
            value={formData.eventDate}
            onChange={handleChange}
            error={getError('eventDate', errors) || undefined}
            required
            color={theme.color}
          />
          <TextInput
            label="Event Time"
            name="eventTime"
            type="time"
            value={formData.eventTime}
            onChange={handleChange}
            error={getError('eventTime', errors) || undefined}
            required
            color={theme.color}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <TextInput
            label="Guest Count"
            name="guestCount"
            type="number"
            placeholder="50"
            value={formData.guestCount}
            onChange={handleChange}
            error={getError('guestCount', errors) || undefined}
            required
            color={theme.color}
          />
          <RadioGroup
            label="Event Type"
            name="eventType"
            value={formData.eventType}
            onChange={handleChange}
            options={[
              { value: 'wedding', label: 'Wedding' },
              { value: 'corporate', label: 'Corporate' },
              { value: 'private', label: 'Private' },
            ]}
            color={theme.color}
          />
        </div>
      </motion.div>

      {/* Special Requests */}
      <motion.div variants={itemVariants} className="mb-8">
        <TextArea
          label="Special Requests (Optional)"
          name="specialRequests"
          placeholder="Any special requirements or preferences..."
          value={formData.specialRequests}
          onChange={handleChange}
          rows={4}
          color={theme.color}
        />
      </motion.div>

      {/* Terms */}
      <motion.div variants={itemVariants} className="mb-8">
        <Checkbox
          label="I agree to Studio's booking terms and privacy policy"
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
          Request Booking
        </FormSubmit>
      </motion.div>
    </motion.form>
  );
};
