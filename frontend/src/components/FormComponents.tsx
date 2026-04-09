'use client';

import { motion } from 'framer-motion';
import { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode, ChangeEvent, FormEvent } from 'react';

interface BaseFieldProps {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  helpText?: string;
  disabled?: boolean;
}

interface TextInputProps extends Omit<BaseFieldProps, 'name'>, Omit<InputHTMLAttributes<HTMLInputElement>, 'name'> {
  name: string;
  color?: string;
}

export const TextInput = ({
  label,
  name,
  error,
  required = false,
  helpText,
  disabled = false,
  color = '#00d084',
  ...props
}: TextInputProps) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="font-semibold text-sm">
        {label}
        {required && <span style={{ color }} className="ml-1">*</span>}
      </label>

      <motion.input
        id={name}
        name={name}
        disabled={disabled}
        className="px-4 py-3 rounded-lg border-2 bg-slate-800 text-white placeholder-gray-400 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          borderColor: error ? '#ef4444' : '#4b5563',
        }}
        whileFocus={{ borderColor: error ? '#ef4444' : color }}
        {...(props as any)}
      />

      {error && <p className="text-red-500 text-xs">{error}</p>}
      {helpText && !error && <p className="text-gray-400 text-xs">{helpText}</p>}
    </div>
  );
};

interface TextAreaProps extends Omit<BaseFieldProps, 'name'>, Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'name'> {
  name: string;
  color?: string;
  rows?: number;
}

export const TextArea = ({
  label,
  name,
  error,
  required = false,
  helpText,
  disabled = false,
  color = '#00d084',
  rows = 4,
  ...props
}: TextAreaProps) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="font-semibold text-sm">
        {label}
        {required && <span style={{ color }} className="ml-1">*</span>}
      </label>

      <motion.textarea
        id={name}
        name={name}
        disabled={disabled}
        rows={rows}
        className="px-4 py-3 rounded-lg border-2 bg-slate-800 text-white placeholder-gray-400 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed resize-none"
        style={{
          borderColor: error ? '#ef4444' : '#4b5563',
        }}
        whileFocus={{ borderColor: error ? '#ef4444' : color }}
        {...(props as any)}
      />

      {error && <p className="text-red-500 text-xs">{error}</p>}
      {helpText && !error && <p className="text-gray-400 text-xs">{helpText}</p>}
    </div>
  );
};

interface SelectProps extends Omit<BaseFieldProps, 'name'>, Omit<SelectHTMLAttributes<HTMLSelectElement>, 'name'> {
  name: string;
  options: Array<{ value: string; label: string }>;
  color?: string;
}

export const Select = ({
  label,
  name,
  error,
  required = false,
  helpText,
  disabled = false,
  options,
  color = '#00d084',
  ...props
}: SelectProps) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="font-semibold text-sm">
        {label}
        {required && <span style={{ color }} className="ml-1">*</span>}
      </label>

      <motion.select
        id={name}
        name={name}
        disabled={disabled}
        className="px-4 py-3 rounded-lg border-2 bg-slate-800 text-white focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          borderColor: error ? '#ef4444' : '#4b5563',
        }}
        whileFocus={{ borderColor: error ? '#ef4444' : color }}
        {...(props as any)}
      >
        <option value="">Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </motion.select>

      {error && <p className="text-red-500 text-xs">{error}</p>}
      {helpText && !error && <p className="text-gray-400 text-xs">{helpText}</p>}
    </div>
  );
};

interface RadioGroupProps extends BaseFieldProps {
  options: Array<{ value: string; label: string }>;
  color?: string;
  value?: string;
  onChange?: ((e: ChangeEvent<HTMLInputElement>) => void) | ((e: any) => void);
}

export const RadioGroup = ({
  label,
  name,
  error,
  required = false,
  options,
  color = '#00d084',
  disabled = false,
  value,
  onChange,
}: RadioGroupProps) => {
  return (
    <div className="flex flex-col gap-3">
      <label className="font-semibold text-sm">
        {label}
        {required && <span style={{ color }} className="ml-1">*</span>}
      </label>

      <div className="flex gap-4 flex-wrap">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={onChange as any}
              disabled={disabled}
              className="w-4 h-4 cursor-pointer"
              style={{ borderColor: color, accentColor: color }}
            />
            <span className="text-sm">{opt.label}</span>
          </label>
        ))}
      </div>

      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

interface CheckboxProps extends Omit<BaseFieldProps, 'name'>, Omit<InputHTMLAttributes<HTMLInputElement>, 'name'> {
  name: string;
  color?: string;
}

export const Checkbox = ({
  label,
  name,
  error,
  disabled = false,
  color = '#00d084',
  ...props
}: CheckboxProps) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          name={name}
          disabled={disabled}
          className="w-5 h-5 cursor-pointer rounded"
          style={{ borderColor: color }}
          {...props}
        />
        <span className="text-sm font-medium">{label}</span>
      </label>

      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

interface FormGroupProps {
  children: ReactNode;
  columns?: number;
}

export const FormGroup = ({ children, columns = 1 }: FormGroupProps) => {
  return (
    <div
      className="grid gap-6"
      style={{
        gridTemplateColumns: `repeat(auto-fit, minmax(${100 / columns}%, 1fr))`,
      }}
    >
      {children}
    </div>
  );
};

interface FormSubmitProps {
  isLoading?: boolean;
  disabled?: boolean;
  color?: string;
  children: ReactNode;
}

export const FormSubmit = ({
  isLoading = false,
  disabled = false,
  color = '#00d084',
  children,
}: FormSubmitProps) => {
  return (
    <motion.button
      type="submit"
      disabled={isLoading || disabled}
      className="w-full px-6 py-3 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        background: color,
        color: '#000',
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {isLoading ? 'Submitting...' : children}
    </motion.button>
  );
};

interface FormErrorProps {
  message?: string;
}

export const FormError = ({ message }: FormErrorProps) => {
  if (!message) return null;

  return (
    <motion.div
      className="p-4 rounded-lg bg-red-500/20 border border-red-500 text-red-400 text-sm"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      ⚠️ {message}
    </motion.div>
  );
};

interface FormSuccessProps {
  message?: string;
}

export const FormSuccess = ({ message }: FormSuccessProps) => {
  if (!message) return null;

  return (
    <motion.div
      className="p-4 rounded-lg bg-green-500/20 border border-green-500 text-green-400 text-sm"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      ✅ {message}
    </motion.div>
  );
};
