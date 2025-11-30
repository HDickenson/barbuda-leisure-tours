'use client';

import { useState } from 'react';
import styles from './BookingForm.module.css';

interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  tour: string;
  date: string;
  guests: number;
  message: string;
}

export default function BookingForm() {
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    phone: '',
    tour: '',
    date: '',
    guests: 1,
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const tours = [
    'Discover Barbuda by Sea',
    'Discover Barbuda by Air',
    'Private Charter by Air',
    'Private Charter by Sea'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guests' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitMessage("Thank you! Your booking request has been received. We'll contact you shortly.");
        setFormData({
          name: '',
          email: '',
          phone: '',
          tour: '',
          date: '',
          guests: 1,
          message: ''
        });
      } else {
        setSubmitMessage('Something went wrong. Please try again or contact us directly.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      setSubmitMessage('Unable to submit. Please email us at bookings@barbudaleisure.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>
          Book Your Barbuda Adventure
        </h2>
        <p className={styles.description}>
          Fill out the form below and we&apos;ll get back to you within 24 hours
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroupRow}>
            <div>
              <label htmlFor="email" className={styles.label}>
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>

            <div>
              <label htmlFor="phone" className={styles.label}>
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.formGroupRow3}>
            <div>
              <label htmlFor="tour" className={styles.label}>
                Select Tour *
              </label>
              <select
                id="tour"
                name="tour"
                value={formData.tour}
                onChange={handleChange}
                required
                className={styles.select}
              >
                <option value="">Choose a tour...</option>
                {tours.map(tour => (
                  <option key={tour} value={tour}>{tour}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="date" className={styles.label}>
                Preferred Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className={styles.input}
              />
            </div>

            <div>
              <label htmlFor="guests" className={styles.label}>
                Guests *
              </label>
              <input
                type="number"
                id="guests"
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                required
                min="1"
                max="50"
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="message" className={styles.label}>
              Special Requests or Questions
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className={styles.textarea}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.submitButton}
          >
            {isSubmitting ? 'Submitting...' : 'Request Booking'}
          </button>

          {submitMessage && (
            <div className={`${styles.messageContainer} ${submitMessage.includes('Thank you') ? styles.messageSuccess : styles.messageError}`}>
              {submitMessage}
            </div>
          )}
        </form>

        <p className={styles.contactInfo}>
          Or call us directly at <a href="tel:+2687282538" className={styles.contactLink}>+268-728-2538</a>
        </p>
      </div>
    </section>
  );
}
