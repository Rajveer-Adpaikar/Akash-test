import { useState } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
}

type Errors = Partial<Record<'name' | 'phone' | 'email' | 'message', string>>;

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string | undefined;
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

function validate(form: { name: string; phone: string; email: string; message: string }): Errors {
  const e: Errors = {};
  if (!form.name.trim()) e.name = 'Name is required';
  if (!form.phone.trim()) e.phone = 'Phone number is required';
  else if (!/^[\d\s+\-()]{7,15}$/.test(form.phone.trim()))
    e.phone = 'Enter a valid phone number';
  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
    e.email = 'Enter a valid email address';
  return e;
}

export default function InquiryModal({ open, onClose }: Props) {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });

  if (!open) return null;

  const reset = () => {
    setSent(false);
    setSubmitting(false);
    setSubmitError('');
    setErrors({});
    setForm({ name: '', phone: '', email: '', message: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    // Fallback: if no Web3Forms key, use mailto as a backup
    if (!WEB3FORMS_KEY) {
      const body = `Name: ${encodeURIComponent(form.name)}%0APhone: ${encodeURIComponent(form.phone)}%0AEmail: ${encodeURIComponent(form.email)}%0AMessage: ${encodeURIComponent(form.message)}`;
      window.location.href = `mailto:kanwarbharat@gmail.com?subject=Inquiry%20for%20Akash%20The%20Band&body=${body}`;
      setSent(true);
      setTimeout(reset, 2000);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: 'Inquiry for Akash The Band',
          from_name: form.name,
          name: form.name,
          phone: form.phone,
          email: form.email || 'no-reply@example.com',
          message: form.message,
        }),
      });
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      setSent(true);
      setTimeout(reset, 2000);
    } catch (err) {
      setSubmitError('Failed to send. Please try again or email us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof Errors]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const inputClass = (field: keyof Errors) =>
    `w-full bg-black/60 border ${errors[field] ? 'border-red-500/60' : 'border-white/10'} rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-colors`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#101010] rounded-2xl p-6 sm:p-8 w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-white/60 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        {sent ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <CheckCircle className="w-10 h-10 text-primary" />
            <p className="text-primary text-center text-lg">Thank you! We&apos;ll reach out shortly. 🙏</p>
          </div>
        ) : (
          <>
            <h2 className="font-display text-2xl text-primary mb-1" style={{ textWrap: 'balance' }}>Inquire Now</h2>
            <p className="text-white/60 text-sm mb-6">Tell us about your event and we&apos;ll get back to you.</p>

            {submitError && (
              <div className="flex items-center gap-2 mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <p className="text-red-300 text-xs">{submitError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <input
                  type="text" placeholder="Your Name" required
                  className={inputClass('name')}
                  value={form.name} onChange={(e) => handleChange('name', e.target.value)}
                  aria-invalid={!!errors.name}
                />
                {errors.name && <p className="text-red-400 text-xs mt-1 ml-1">{errors.name}</p>}
              </div>
              <div>
                <input
                  type="tel" placeholder="Phone Number" required
                  className={inputClass('phone')}
                  value={form.phone} onChange={(e) => handleChange('phone', e.target.value)}
                  aria-invalid={!!errors.phone}
                />
                {errors.phone && <p className="text-red-400 text-xs mt-1 ml-1">{errors.phone}</p>}
              </div>
              <div>
                <input
                  type="email" placeholder="Email (optional)"
                  className={inputClass('email')}
                  value={form.email} onChange={(e) => handleChange('email', e.target.value)}
                  aria-invalid={!!errors.email}
                />
                {errors.email && <p className="text-red-400 text-xs mt-1 ml-1">{errors.email}</p>}
              </div>
              <div>
                <textarea
                  placeholder="Tell us about your event..." rows={3}
                  className={inputClass('message')}
                  value={form.message} onChange={(e) => handleChange('message', e.target.value)}
                />
              </div>
              <button
                type="submit" disabled={submitting}
                className="w-full bg-primary rounded-full text-black font-medium py-3 text-sm hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? 'Sending...' : 'Send Inquiry'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
