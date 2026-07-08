import { useState } from 'react';
import { X } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function InquiryModal({ open, onClose }: Props) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `Name: ${form.name}%0APhone: ${form.phone}%0AEmail: ${form.email}%0AMessage: ${form.message}`;
    window.location.href = `mailto:kanwarbharat@gmail.com?subject=Inquiry%20for%20Akash%20The%20Band&body=${body}`;
    setSent(true);
    setTimeout(() => { setSent(false); setForm({ name: '', phone: '', email: '', message: '' }); onClose(); }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#101010] rounded-2xl p-6 sm:p-8 w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-white/60 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        {sent ? (
          <p className="text-primary text-center text-lg py-8">Thank you! We&apos;ll reach out shortly. 🙏</p>
        ) : (
          <>
            <h2 className="font-display text-2xl text-primary mb-1">Inquire Now</h2>
            <p className="text-white/60 text-sm mb-6">Tell us about your event and we&apos;ll get back to you.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text" placeholder="Your Name" required
                className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-primary/50"
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                type="tel" placeholder="Phone Number" required
                className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-primary/50"
                value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <input
                type="email" placeholder="Email (optional)"
                className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-primary/50"
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <textarea
                placeholder="Tell us about your event..." rows={3}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-primary/50 resize-none"
                value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
              <button
                type="submit"
                className="w-full bg-primary rounded-full text-black font-medium py-3 text-sm hover:brightness-110 transition-all"
              >
                Send Inquiry
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
