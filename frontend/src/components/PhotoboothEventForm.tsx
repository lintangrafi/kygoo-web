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
import { photoboothService } from '../services';

export interface PhotoboothEventData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  packageId: string;
  eventDate: string;
  eventTime: string;
  eventType: string;
  guestCount: string;
  location: string;
  printType: string;
  guestbookIncluded: boolean;
  specialRequests: string;
  agreeTerms: boolean;
}

interface PhotoboothEventFormProps {
  onSuccess?: () => void;
  theme?: {
    color: string;
    name: string;
  };
}

const packages = [
  { value: 'classic-photobooth', label: 'Classic Photobooth - Mulai 1.800K' },
  { value: 'full-body-photobooth', label: 'Full Body Photobooth - Mulai 2.350K' },
  { value: 'ipad-booth', label: 'iPad Booth - Mulai 1.500K' },
  { value: 'mingle-photobooth', label: 'Mingle Photo Booth - Mulai 2.250K' },
  { value: 'high-angle-photobooth', label: 'High Angle Photobooth - Mulai 3.000K / 12.000K per day' },
  { value: 'videobooth', label: 'Videobooth - Mulai 2.000K' },
  { value: 'wedding-content-creator', label: 'Wedding Content Creator - 799K' },
];

const printTypes = [
  { value: 'instant', label: 'Instant Prints (4x6")' },
  { value: 'digital', label: 'Digital Files Only' },
  { value: 'combo', label: 'Combo (Prints + Digital)' },
];

export const PhotoboothEventForm = ({
  onSuccess,
  theme = { color: '#ff006e', name: 'Photobooth' },
}: PhotoboothEventFormProps) => {
  const [formData, setFormData] = useState<PhotoboothEventData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    packageId: '',
    eventDate: '',
    eventTime: '',
    eventType: 'birthday',
    guestCount: '',
    location: '',
    printType: 'combo',
    guestbookIncluded: true,
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
    packageId: (v: string) => validators.select(v),
    eventDate: (v: string) => validators.date(v),
    eventTime: (v: string) => validators.time(v),
    guestCount: (v: string) => validators.number(v),
    location: (v: string) => validators.text(v, 3, 200),
    agreeTerms: (v: boolean) => (!v ? 'You must agree to booking terms' : null),
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, type, value } = e.target as HTMLInputElement & { type: string; value: string };

    if (type === 'checkbox') {
      setFormData((prev: PhotoboothEventData): PhotoboothEventData => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev: PhotoboothEventData): PhotoboothEventData => ({
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
      const response = await photoboothService.createEvent({
        organizer_name: formData.customerName,
        organizer_email: formData.customerEmail,
        organizer_phone: formData.customerPhone,
        package_id: formData.packageId,
        event_date: formData.eventDate,
        event_time: formData.eventTime,
        guest_count: parseInt(formData.guestCount),
        location: formData.location,
        event_name: formData.customerName,
        special_requests: formData.specialRequests,
        price: 0,
      });

      if (response.success) {
        setSuccessMessage('Event booking confirmed! Check your email for details.');
        setFormData({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          packageId: '',
          eventDate: '',
          eventTime: '',
          eventType: 'birthday',
          guestCount: '',
          location: '',
          printType: 'combo',
          guestbookIncluded: true,
          specialRequests: '',
          agreeTerms: false,
        });
        if (onSuccess) onSuccess();
      } else {
        throw new Error(response.error || 'Event booking failed');
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to submit event booking');
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
            placeholder="Jane Smith"
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
            placeholder="jane@example.com"
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

      {/* Package Selection */}
      <motion.div variants={itemVariants} className="mb-8">
        <h3 className="text-lg font-bold mb-6" style={{ color: theme.color }}>
          Package Selection
        </h3>

        <Select
          label="Choose Your Package"
          name="packageId"
          value={formData.packageId}
          onChange={handleChange}
          options={packages}
          error={getError('packageId', errors) || undefined}
          required
          color={theme.color}
        />
      </motion.div>

      {/* Event Details */}
      <motion.div variants={itemVariants} className="mb-8">
        <h3 className="text-lg font-bold mb-6" style={{ color: theme.color }}>
          Event Details
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
            label="Number of Guests"
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
              { value: 'birthday', label: 'Birthday' },
              { value: 'wedding', label: 'Wedding' },
              { value: 'corporate', label: 'Corporate' },
            ]}
            color={theme.color}
          />
        </div>

        <TextInput
          label="Event Location"
          name="location"
          placeholder="Venue address or description"
          value={formData.location}
          onChange={handleChange}
          error={getError('location', errors) || undefined}
          required
          color={theme.color}
        />
      </motion.div>

      {/* Photo Options */}
      <motion.div variants={itemVariants} className="mb-8">
        <h3 className="text-lg font-bold mb-6" style={{ color: theme.color }}>
          Photo Options
        </h3>

        <div className="mb-6">
          <RadioGroup
            label="Print Type"
            name="printType"
            value={formData.printType}
            onChange={handleChange}
            options={printTypes}
            color={theme.color}
          />
        </div>

        <Checkbox
          label="Add Guestbook (Digital signature wall)"
          name="guestbookIncluded"
          checked={formData.guestbookIncluded}
          onChange={handleChange}
          color={theme.color}
        />
      </motion.div>

      {/* Special Requests */}
      <motion.div variants={itemVariants} className="mb-8">
        <TextArea
          label="Special Requests (Optional)"
          name="specialRequests"
          placeholder="Props, themes, special effects, etc."
          value={formData.specialRequests}
          onChange={handleChange}
          rows={4}
          color={theme.color}
        />
      </motion.div>

      {/* Terms */}
      <motion.div variants={itemVariants} className="mb-8">
        <Checkbox
          label="I agree to Photobooth's booking terms and privacy policy"
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
          Book Your Event
        </FormSubmit>
      </motion.div>
    </motion.form>
  );
};
