'use client';

import { FormEvent, useMemo, useState } from 'react';
import Link from 'next/link';
import { Bodoni_Moda, Manrope } from 'next/font/google';
import { motion } from 'framer-motion';
import { contactInquiryService } from '@/src/services';
import styles from './page.module.css';

const displayFont = Bodoni_Moda({
  subsets: ['latin'],
  variable: '--font-contact-display',
  weight: ['500', '600', '700'],
});

const bodyFont = Manrope({
  subsets: ['latin'],
  variable: '--font-contact-body',
  weight: ['400', '500', '600', '700'],
});

type BookingFormState = {
  fullName: string;
  email: string;
  phone: string;
  businessLine: string;
  eventType: string;
  eventDate: string;
  location: string;
  guestCount: string;
  budgetRange: string;
  notes: string;
  agree: boolean;
};

type FormErrors = Partial<Record<keyof BookingFormState, string>>;

const BUSINESS_LINES = [
  { value: 'studio', label: 'Kygoo Studio' },
  { value: 'photobooth', label: 'Kygoo Photobooth' },
  { value: 'digital', label: 'Kygoo Digital' },
  { value: 'coffee', label: 'Kygoo Coffee' },
];

const BUDGET_RANGES = [
  'Di bawah Rp 10 juta',
  'Rp 10 - 30 juta',
  'Rp 30 - 75 juta',
  'Rp 75 - 150 juta',
  'Di atas Rp 150 juta',
];

const INITIAL_STATE: BookingFormState = {
  fullName: '',
  email: '',
  phone: '',
  businessLine: 'studio',
  eventType: '',
  eventDate: '',
  location: '',
  guestCount: '',
  budgetRange: '',
  notes: '',
  agree: false,
};

const STUDIO_PHONE_NUMBER = '6281284917960';
const GENERAL_PHONE_NUMBER = '6285717531630';

const isEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value);

export default function ContactPage() {
  const [form, setForm] = useState<BookingFormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const selectedLine = useMemo(
    () => BUSINESS_LINES.find((line) => line.value === form.businessLine)?.label ?? 'Kygoo Group',
    [form.businessLine]
  );

  const targetPhoneNumber = form.businessLine === 'studio' ? STUDIO_PHONE_NUMBER : GENERAL_PHONE_NUMBER;

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!form.fullName.trim() || form.fullName.trim().length < 2) {
      nextErrors.fullName = 'Nama minimal 2 karakter.';
    }
    if (!form.email.trim() || !isEmail(form.email.trim())) {
      nextErrors.email = 'Gunakan format email yang valid.';
    }
    if (!form.phone.trim() || form.phone.trim().length < 9) {
      nextErrors.phone = 'Nomor WhatsApp minimal 9 digit.';
    }
    if (!form.eventType.trim()) {
      nextErrors.eventType = 'Isi jenis event atau campaign.';
    }
    if (!form.eventDate) {
      nextErrors.eventDate = 'Pilih tanggal pelaksanaan.';
    }
    if (!form.location.trim()) {
      nextErrors.location = 'Lokasi dibutuhkan untuk estimasi tim.';
    }
    if (!form.guestCount.trim()) {
      nextErrors.guestCount = 'Isi estimasi jumlah tamu/audiens.';
    }
    if (!form.budgetRange) {
      nextErrors.budgetRange = 'Pilih range budget.';
    }
    if (!form.agree) {
      nextErrors.agree = 'Perlu persetujuan untuk lanjut booking.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (event.target as HTMLInputElement).checked : value,
    }));

    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError('');

    if (!validate()) {
      return;
    }

    const bookingPayload = {
      name: form.fullName,
      email: form.email,
      phone: form.phone,
      business_line: form.businessLine as 'studio' | 'photobooth' | 'digital' | 'coffee',
      event_type: form.eventType,
      event_date: form.eventDate,
      location: form.location,
      guest_count: form.guestCount,
      budget_range: form.budgetRange,
      notes: form.notes,
      message: [
        'Halo tim Kygoo, saya ingin booking layanan.',
        '',
        `Nama: ${form.fullName}`,
        `Email: ${form.email}`,
        `WhatsApp: ${form.phone}`,
        `Lini bisnis: ${selectedLine}`,
        `Jenis event: ${form.eventType}`,
        `Tanggal: ${form.eventDate}`,
        `Lokasi: ${form.location}`,
        `Estimasi tamu: ${form.guestCount}`,
        `Budget: ${form.budgetRange}`,
        `Catatan: ${form.notes || '-'}`,
      ].join('\n'),
      source: 'contact_page',
    };

    const message = [
      'Halo tim Kygoo, saya ingin booking layanan.',
      '',
      `Nama: ${form.fullName}`,
      `Email: ${form.email}`,
      `WhatsApp: ${form.phone}`,
      `Lini bisnis: ${selectedLine}`,
      `Jenis event: ${form.eventType}`,
      `Tanggal: ${form.eventDate}`,
      `Lokasi: ${form.location}`,
      `Estimasi tamu: ${form.guestCount}`,
      `Budget: ${form.budgetRange}`,
      `Catatan: ${form.notes || '-'}`,
    ].join('\n');

    const whatsappWindow = window.open('about:blank', '_blank');

    contactInquiryService
      .createInquiry(bookingPayload)
      .then((response) => {
        if (response.error || !response.data) {
          throw new Error(response.message || response.error || 'Failed to save booking');
        }

        if (whatsappWindow) {
          whatsappWindow.location.href = `https://wa.me/${targetPhoneNumber}?text=${encodeURIComponent(message)}`;
        } else {
          window.location.href = `https://wa.me/${targetPhoneNumber}?text=${encodeURIComponent(message)}`;
        }

        setSubmitted(true);
      })
      .catch((error) => {
        if (whatsappWindow) {
          whatsappWindow.close();
        }
        setSubmitError(error instanceof Error ? error.message : 'Gagal menyimpan booking ke server.');
      });
  };

  return (
    <main className={`${styles.page} ${displayFont.variable} ${bodyFont.variable}`}>
      <div className={styles.grain} aria-hidden="true" />

      <section className={styles.hero}>
        <motion.p
          className={styles.kicker}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          Booking experience
        </motion.p>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          Ceritakan event Anda,
          <br />
          kami siapkan orkestrasinya.
        </motion.h1>
        <motion.p
          className={styles.lead}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
        >
          Halaman ini dirancang sebagai ruang briefing cepat: isi kebutuhan inti Anda, lalu lanjut ke
          WhatsApp dengan format request yang rapi agar tim kami bisa langsung mengeksekusi estimasi.
        </motion.p>

        <div className={styles.metrics}>
          <article>
            <span>Response SLA</span>
            <strong>&lt; 24 jam kerja</strong>
          </article>
          <article>
            <span>Coverage</span>
            <strong>Jabodetabek + nasional</strong>
          </article>
          <article>
            <span>Business line</span>
            <strong>4 unit terintegrasi</strong>
          </article>
        </div>
      </section>

      <section className={styles.contentGrid}>
        <motion.aside
          className={styles.infoPanel}
          initial={{ opacity: 0, x: -18 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2>Alur booking</h2>
          <ol>
            <li>Isi brief event dengan detail dasar.</li>
            <li>Submit untuk generate pesan WhatsApp otomatis.</li>
            <li>Tim account kami follow-up kebutuhan teknis.</li>
          </ol>

          <div className={styles.contactMeta}>
            <p>WhatsApp</p>
            <a href={`https://wa.me/${targetPhoneNumber}`} target="_blank" rel="noopener noreferrer">
              {form.businessLine === 'studio' ? '+62 812-8491-7960' : '+62 857-1753-1630'}
            </a>
            <p>Email</p>
            <a href="mailto:info@kygoo.group">info@kygoo.group</a>
            <p>Lokasi</p>
            <span>Jakarta Selatan, Indonesia</span>
          </div>

          <div className={styles.inlineLinks}>
            {BUSINESS_LINES.map((line) => (
              <Link key={line.value} href={`/${line.value}`}>
                {line.label}
              </Link>
            ))}
          </div>
        </motion.aside>

        <motion.form
          className={styles.formPanel}
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <header className={styles.formHeader}>
            <h2>Form booking</h2>
            <p>Semakin detail brief Anda, semakin cepat kami kirimkan opsi paket yang relevan.</p>
          </header>

          <div className={styles.formGrid}>
            <label>
              Nama lengkap
              <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Nama PIC" />
              {errors.fullName && <small>{errors.fullName}</small>}
            </label>

            <label>
              Email aktif
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="nama@brand.com"
              />
              {errors.email && <small>{errors.email}</small>}
            </label>

            <label>
              Nomor WhatsApp
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="08xxxxxxxxxx" />
              {errors.phone && <small>{errors.phone}</small>}
            </label>

            <label>
              Pilih lini bisnis
              <select name="businessLine" value={form.businessLine} onChange={handleChange}>
                {BUSINESS_LINES.map((line) => (
                  <option key={line.value} value={line.value}>
                    {line.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Jenis event / campaign
              <input
                name="eventType"
                value={form.eventType}
                onChange={handleChange}
                placeholder="Contoh: Product launch, wedding, corporate gathering"
              />
              {errors.eventType && <small>{errors.eventType}</small>}
            </label>

            <label>
              Tanggal pelaksanaan
              <input name="eventDate" type="date" value={form.eventDate} onChange={handleChange} />
              {errors.eventDate && <small>{errors.eventDate}</small>}
            </label>

            <label>
              Lokasi event
              <input name="location" value={form.location} onChange={handleChange} placeholder="Kota / venue" />
              {errors.location && <small>{errors.location}</small>}
            </label>

            <label>
              Estimasi tamu / audiens
              <input
                name="guestCount"
                value={form.guestCount}
                onChange={handleChange}
                placeholder="Contoh: 150 pax"
              />
              {errors.guestCount && <small>{errors.guestCount}</small>}
            </label>

            <label>
              Budget range
              <select name="budgetRange" value={form.budgetRange} onChange={handleChange}>
                <option value="">Pilih budget</option>
                {BUDGET_RANGES.map((budget) => (
                  <option key={budget} value={budget}>
                    {budget}
                  </option>
                ))}
              </select>
              {errors.budgetRange && <small>{errors.budgetRange}</small>}
            </label>

            <label className={styles.fullWidth}>
              Catatan tambahan
              <textarea
                name="notes"
                rows={4}
                value={form.notes}
                onChange={handleChange}
                placeholder="Cantumkan kebutuhan khusus: mood event, output konten, estimasi jam operasional, dll."
              />
            </label>

            <label className={`${styles.checkbox} ${styles.fullWidth}`}>
              <input type="checkbox" name="agree" checked={form.agree} onChange={handleChange} />
              <span>Saya setuju data ini digunakan untuk proses penawaran dan follow-up booking.</span>
            </label>
            {errors.agree && <small className={styles.fullWidth}>{errors.agree}</small>}
          </div>

          <div className={styles.formActions}>
            <button type="submit">Kirim ke WhatsApp</button>
            <p>
              Atau kirim via email ke <a href="mailto:info@kygoo.group">info@kygoo.group</a>
            </p>
          </div>

          {submitError && (
            <div className={styles.successBox} role="alert">
              {submitError}
            </div>
          )}

          {submitted && (
            <div className={styles.successBox} role="status" aria-live="polite">
              Brief Anda siap. Jendela WhatsApp sudah dibuka dengan detail booking otomatis.
            </div>
          )}
        </motion.form>
      </section>
    </main>
  );
}
