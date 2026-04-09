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
import { coffeeService } from '../services';

export interface CoffeeOrderData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderType: 'dine-in' | 'takeaway' | 'delivery';
  items: Array<{ menuItemId: string; quantity: number }>;
  notes: string;
  agreeTerms: boolean;
}

export interface CoffeeReservationData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  reservationDate: string;
  reservationTime: string;
  partySize: string;
  specialRequests: string;
  agreeTerms: boolean;
}

interface CoffeeFormProps {
  mode?: 'order' | 'reservation';
  onSuccess?: () => void;
  theme?: {
    color: string;
    name: string;
  };
}

const menuItems = [
  { id: 'espresso', value: 'espresso', label: 'Espresso - Rp 25,000', price: 25000 },
  { id: 'americano', value: 'americano', label: 'Americano - Rp 30,000', price: 30000 },
  { id: 'cappuccino', value: 'cappuccino', label: 'Cappuccino - Rp 35,000', price: 35000 },
  { id: 'latte', value: 'latte', label: 'Latte - Rp 35,000', price: 35000 },
  { id: 'mocha', value: 'mocha', label: 'Mocha - Rp 40,000', price: 40000 },
  { id: 'cortado', value: 'cortado', label: 'Cortado - Rp 32,000', price: 32000 },
];

const specialties = [
  { id: 'seasonal', value: 'seasonal', label: 'Seasonal Specialty - Rp 45,000', price: 45000 },
  { id: 'cold_brew', value: 'cold_brew', label: 'Cold Brew - Rp 38,000', price: 38000 },
  { id: 'flat_white', value: 'flat_white', label: 'Flat White - Rp 38,000', price: 38000 },
];

const pastries = [
  { value: 'croissant', label: 'Croissant - Rp 20,000' },
  { value: 'danish', label: 'Danish Pastry - Rp 22,000' },
  { value: 'bagel', label: 'Bagel - Rp 18,000' },
  { value: 'muffin', label: 'Muffin - Rp 20,000' },
];

export const CoffeeForm = ({
  mode = 'reservation',
  onSuccess,
  theme = { color: '#6f4e37', name: 'Coffee' },
}: CoffeeFormProps) => {
  const [isOrder, setIsOrder] = useState(mode === 'order');
  const [orderData, setOrderData] = useState<CoffeeOrderData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    orderType: 'takeaway',
    items: [],
    notes: '',
    agreeTerms: false,
  });

  const [reservationData, setReservationData] = useState<CoffeeReservationData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    reservationDate: '',
    reservationTime: '',
    partySize: '',
    specialRequests: '',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: number }>({});

  const orderValidationRules = {
    customerName: (v: string) => validators.text(v, 2, 100),
    customerEmail: (v: string) => validators.email(v),
    customerPhone: (v: string) => validators.phone(v),
    orderType: (v: string) => validators.select(v),
    agreeTerms: (v: boolean) => (!v ? 'You must agree to terms' : null),
  };

  const reservationValidationRules = {
    customerName: (v: string) => validators.text(v, 2, 100),
    customerEmail: (v: string) => validators.email(v),
    customerPhone: (v: string) => validators.phone(v),
    reservationDate: (v: string) => validators.date(v),
    reservationTime: (v: string) => validators.time(v),
    partySize: (v: string) => validators.number(v),
    agreeTerms: (v: boolean) => (!v ? 'You must agree to terms' : null),
  };

  const handleOrderChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, type, value } = e.target as HTMLInputElement & { type: string; value: string };

    if (type === 'checkbox') {
      setOrderData((prev: CoffeeOrderData): CoffeeOrderData => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setOrderData((prev: CoffeeOrderData): CoffeeOrderData => ({
        ...prev,
        [name]: value,
      }));
    }

    setErrors((prev: ValidationError[]): ValidationError[] => prev.filter((err) => err.field !== name));
  };

  const handleReservationChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, type, value } = e.target as HTMLInputElement & { type: string; value: string };

    if (type === 'checkbox') {
      setReservationData((prev: CoffeeReservationData): CoffeeReservationData => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setReservationData((prev: CoffeeReservationData): CoffeeReservationData => ({
        ...prev,
        [name]: value,
      }));
    }

    setErrors((prev: ValidationError[]): ValidationError[] => prev.filter((err) => err.field !== name));
  };

  const handleItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setSelectedItems((prev) => {
        const updated = { ...prev };
        delete updated[itemId];
        return updated;
      });
    } else {
      setSelectedItems((prev) => ({
        ...prev,
        [itemId]: quantity,
      }));
    }
  };

  const handleOrderSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (Object.keys(selectedItems).length === 0) {
      setErrorMessage('Please select at least one item');
      return;
    }

    const validation = validateForm(orderData as any, orderValidationRules);
    if (!validation.isValid) {
      setErrors(validation.errors as ValidationError[]);
      return;
    }

    setIsLoading(true);

    try {
      const items = Object.entries(selectedItems).map(([id, quantity]) => ({
        menu_item_id: id,
        quantity,
      }));

      // Calculate total price
      const totalPrice = items.reduce((sum, item) => {
        const menuItem = menuItems.find(m => m.id === item.menu_item_id);
        return sum + (menuItem?.price || 0) * item.quantity;
      }, 0);

      const response = await coffeeService.createOrder({
        customer_name: orderData.customerName,
        customer_email: orderData.customerEmail,
        order_type: orderData.orderType,
        items,
        notes: orderData.notes,
        total_price: totalPrice,
      });

      if (response.success) {
        setSuccessMessage('Order submitted! You can track it in your account.');
        setOrderData({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          orderType: 'takeaway',
          items: [],
          notes: '',
          agreeTerms: false,
        });
        setSelectedItems({});
        if (onSuccess) onSuccess();
      } else {
        throw new Error(response.error || 'Order failed');
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to submit order');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReservationSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    const validation = validateForm(reservationData as any, reservationValidationRules);
    if (!validation.isValid) {
      setErrors(validation.errors as ValidationError[]);
      return;
    }

    setIsLoading(true);

    try {
      const response = await coffeeService.createReservation({
        customer_name: reservationData.customerName,
        customer_email: reservationData.customerEmail,
        customer_phone: reservationData.customerPhone,
        reservation_date: reservationData.reservationDate,
        reservation_time: reservationData.reservationTime,
        party_size: parseInt(reservationData.partySize),
        special_requests: reservationData.specialRequests,
      });

      if (response.success) {
        setSuccessMessage('Reservation confirmed! Check your email for details.');
        setReservationData({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          reservationDate: '',
          reservationTime: '',
          partySize: '',
          specialRequests: '',
          agreeTerms: false,
        });
        if (onSuccess) onSuccess();
      } else {
        throw new Error(response.error || 'Reservation failed');
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to submit reservation');
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

  if (isOrder) {
    return (
      <motion.form
        onSubmit={handleOrderSubmit}
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

        {/* Mode Toggle */}
        <motion.div variants={itemVariants} className="mb-8">
          <button
            type="button"
            onClick={() => setIsOrder(false)}
            className="text-sm underline opacity-70 hover:opacity-100 transition-opacity"
            style={{ color: theme.color }}
          >
            Want to make a reservation instead?
          </button>
        </motion.div>

        {/* Customer Information */}
        <motion.div variants={itemVariants} className="mb-8">
          <h3 className="text-lg font-bold mb-6" style={{ color: theme.color }}>
            Your Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <TextInput
              label="Full Name"
              name="customerName"
              placeholder="John Doe"
              value={orderData.customerName}
              onChange={handleOrderChange}
              error={getError('customerName', errors) || undefined}
              required
              color={theme.color}
            />
            <TextInput
              label="Email"
              name="customerEmail"
              type="email"
              placeholder="john@example.com"
              value={orderData.customerEmail}
              onChange={handleOrderChange}
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
            value={orderData.customerPhone}
            onChange={handleOrderChange}
            error={getError('customerPhone', errors) || undefined}
            required
            color={theme.color}
          />
        </motion.div>

        {/* Order Type */}
        <motion.div variants={itemVariants} className="mb-8">
          <h3 className="text-lg font-bold mb-6" style={{ color: theme.color }}>
            Order Type
          </h3>

          <RadioGroup
            label=""
            name="orderType"
            value={orderData.orderType}
            onChange={handleOrderChange}
            options={[
              { value: 'dine-in', label: 'Dine In' },
              { value: 'takeaway', label: 'Takeaway' },
              { value: 'delivery', label: 'Delivery (if available)' },
            ]}
            color={theme.color}
          />
        </motion.div>

        {/* Menu Selection */}
        <motion.div variants={itemVariants} className="mb-8">
          <h3 className="text-lg font-bold mb-6" style={{ color: theme.color }}>
            Select Items
          </h3>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-3">Coffee & Beverages</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {menuItems.map((item) => (
                  <div key={item.value} className="flex items-center gap-3 p-3 border rounded-lg">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={selectedItems[item.value] || 0}
                      onChange={(e) =>
                        handleItemQuantity(item.value, parseInt(e.target.value) || 0)
                      }
                      className="w-12 px-2 py-1 border rounded border-gray-300"
                    />
                    <span className="text-sm flex-1">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Specialties</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {specialties.map((item) => (
                  <div key={item.value} className="flex items-center gap-3 p-3 border rounded-lg">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={selectedItems[item.value] || 0}
                      onChange={(e) =>
                        handleItemQuantity(item.value, parseInt(e.target.value) || 0)
                      }
                      className="w-12 px-2 py-1 border rounded border-gray-300"
                    />
                    <span className="text-sm flex-1">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Pastries & Snacks</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pastries.map((item) => (
                  <div key={item.value} className="flex items-center gap-3 p-3 border rounded-lg">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={selectedItems[item.value] || 0}
                      onChange={(e) =>
                        handleItemQuantity(item.value, parseInt(e.target.value) || 0)
                      }
                      className="w-12 px-2 py-1 border rounded border-gray-300"
                    />
                    <span className="text-sm flex-1">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Special Requests */}
        <motion.div variants={itemVariants} className="mb-8">
          <TextArea
            label="Special Requests (Optional)"
            name="notes"
            placeholder="Any special instructions or preferences..."
            value={orderData.notes}
            onChange={handleOrderChange}
            rows={3}
            color={theme.color}
          />
        </motion.div>

        {/* Terms */}
        <motion.div variants={itemVariants} className="mb-8">
          <Checkbox
            label="I agree to Coffee Shop's order terms and privacy policy"
            name="agreeTerms"
            checked={orderData.agreeTerms}
            onChange={handleOrderChange}
            error={getError('agreeTerms', errors) || undefined}
            color={theme.color}
          />
        </motion.div>

        {/* Submit */}
        <motion.div variants={itemVariants}>
          <FormSubmit isLoading={isLoading} color={theme.color}>
            Place Order
          </FormSubmit>
        </motion.div>
      </motion.form>
    );
  }

  return (
    <motion.form
      onSubmit={handleReservationSubmit}
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

      {/* Mode Toggle */}
      <motion.div variants={itemVariants} className="mb-8">
        <button
          type="button"
          onClick={() => setIsOrder(true)}
          className="text-sm underline opacity-70 hover:opacity-100 transition-opacity"
          style={{ color: theme.color }}
        >
          Want to place an order instead?
        </button>
      </motion.div>

      {/* Customer Information */}
      <motion.div variants={itemVariants} className="mb-8">
        <h3 className="text-lg font-bold mb-6" style={{ color: theme.color }}>
          Your Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <TextInput
            label="Full Name"
            name="customerName"
            placeholder="Jane Smith"
            value={reservationData.customerName}
            onChange={handleReservationChange}
            error={getError('customerName', errors) || undefined}
            required
            color={theme.color}
          />
          <TextInput
            label="Email"
            name="customerEmail"
            type="email"
            placeholder="jane@example.com"
            value={reservationData.customerEmail}
            onChange={handleReservationChange}
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
          value={reservationData.customerPhone}
          onChange={handleReservationChange}
          error={getError('customerPhone', errors) || undefined}
          required
          color={theme.color}
        />
      </motion.div>

      {/* Reservation Details */}
      <motion.div variants={itemVariants} className="mb-8">
        <h3 className="text-lg font-bold mb-6" style={{ color: theme.color }}>
          Reservation Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <TextInput
            label="Reservation Date"
            name="reservationDate"
            type="date"
            value={reservationData.reservationDate}
            onChange={handleReservationChange}
            error={getError('reservationDate', errors) || undefined}
            required
            color={theme.color}
          />
          <TextInput
            label="Reservation Time"
            name="reservationTime"
            type="time"
            value={reservationData.reservationTime}
            onChange={handleReservationChange}
            error={getError('reservationTime', errors) || undefined}
            required
            color={theme.color}
          />
        </div>

        <TextInput
          label="Party Size"
          name="partySize"
          type="number"
          placeholder="2"
          value={reservationData.partySize}
          onChange={handleReservationChange}
          error={getError('partySize', errors) || undefined}
          required
          color={theme.color}
        />
      </motion.div>

      {/* Special Requests */}
      <motion.div variants={itemVariants} className="mb-8">
        <TextArea
          label="Special Requests (Optional)"
          name="specialRequests"
          placeholder="High chair needed, window seat preferred, celebration occasion, etc."
          value={reservationData.specialRequests}
          onChange={handleReservationChange}
          rows={4}
          color={theme.color}
        />
      </motion.div>

      {/* Terms */}
      <motion.div variants={itemVariants} className="mb-8">
        <Checkbox
          label="I agree to Coffee Shop's reservation terms and privacy policy"
          name="agreeTerms"
          checked={reservationData.agreeTerms}
          onChange={handleReservationChange}
          error={getError('agreeTerms', errors) || undefined}
          color={theme.color}
        />
      </motion.div>

      {/* Submit */}
      <motion.div variants={itemVariants}>
        <FormSubmit isLoading={isLoading} color={theme.color}>
          Make Reservation
        </FormSubmit>
      </motion.div>
    </motion.form>
  );
};
