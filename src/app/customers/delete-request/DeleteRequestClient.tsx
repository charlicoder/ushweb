'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { USH_PHONE_DISPLAY, USH_PHONE_TEL_HREF } from '@/lib/contact';

export default function DeleteRequestClient() {
  const [countryCode, setCountryCode] = useState<string>('+965');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [reason, setReason] = useState<string>('');
  const [additionalNotes, setAdditionalNotes] = useState<string>('');
  const [acknowledged, setAcknowledged] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    referenceId: string;
    message: string;
    timeline: string;
  } | null>(null);

  const [copiedRef, setCopiedRef] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanPhoneOnly = phoneNumber.trim().replace(/\D/g, '');
    if (!cleanPhoneOnly) {
      setErrorMessage('Please enter your registered mobile phone number.');
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Please enter your account password for security verification.');
      return;
    }

    if (!acknowledged) {
      setErrorMessage('Please confirm your understanding that account deletion is permanent.');
      return;
    }

    const fullPhoneNumber = `${countryCode}${cleanPhoneOnly}`;

    try {
      setLoading(true);
      const res = await fetch('/api/customers/delete-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          phone_number: fullPhoneNumber,
          password: password.trim(),
          reason: reason || 'Not specified',
          notes: additionalNotes.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(
          data?.error?.message ||
            'Unable to process deletion request. Please check your credentials or email info@ushspa.co.'
        );
      }

      setSuccessData({
        referenceId: data.reference_id || `USH-DEL-${Date.now().toString().slice(-6)}`,
        message: data.message || 'Your account deletion request has been registered.',
        timeline: data.timeline || '7-14 business days',
      });
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred. Please contact info@ushspa.co for assistance.'
      );
    } finally {
      setLoading(false);
    }
  };

  const copyRef = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white text-spa-text antialiased">
      <Header />

      {/* Main Banner */}
      <section className="bg-gradient-to-b from-spa-cream via-spa-pearl to-white pt-28 pb-12 border-b border-spa-petal/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-2 text-xs text-spa-muted mb-4">
            <Link href="/" className="hover:text-spa-cherry transition-colors">Home</Link>
            <span>/</span>
            <Link href="/privacy-policy" className="hover:text-spa-cherry transition-colors">Privacy</Link>
            <span>/</span>
            <span className="text-spa-cherry font-medium">Account Deletion</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-semibold tracking-wider uppercase mb-3">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Google Play Data Safety &bull; Account Erasure Portal
          </div>

          <h1 className="font-lustria text-3xl sm:text-4xl text-spa-text mb-3 leading-tight">
            Request Account &amp; Data Deletion
          </h1>

          <p className="text-spa-muted text-sm sm:text-base leading-relaxed mb-6 font-light">
            Use this official portal to request the permanent deletion of your <strong className="text-spa-text font-medium">USH Spa</strong> mobile app account and all associated personal data.
          </p>

          {/* Store & Developer Identity Reference */}
          <div className="bg-white border border-spa-petal/60 rounded-sm p-4 text-xs text-spa-muted shadow-2xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <span className="block font-semibold text-spa-text">App Name:</span>
                <span className="text-spa-cherry font-medium">USH Spa</span>
              </div>
              <div>
                <span className="block font-semibold text-spa-text">Developer / Entity:</span>
                <span>Quiet Ush Thai Spa Health Institute for Women</span>
              </div>
              <div>
                <span className="block font-semibold text-spa-text">Package / App ID:</span>
                <span className="font-mono text-[11px]">com.spaush.ushspa</span>
              </div>
              <div>
                <span className="block font-semibold text-spa-text">Operating Location:</span>
                <span>Sharq, Kuwait City, Kuwait</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Body */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        {/* Step-by-Step Instructions (Google Play Requirement) */}
        <section className="bg-spa-cream/60 border border-spa-petal/60 rounded-sm p-6 space-y-4">
          <h2 className="font-lustria text-lg sm:text-xl text-spa-text flex items-center gap-2">
            <span>📋</span> Steps to Request Account Deletion
          </h2>
          <p className="text-xs text-spa-muted leading-relaxed">
            You can delete your account using any of the following verified methods:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Method 1: Web Request */}
            <div className="bg-white p-4 rounded border border-spa-petal/50 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-spa-cherry text-white flex items-center justify-center font-bold text-xs">
                  1
                </span>
                <h3 className="font-lustria font-semibold text-spa-text">
                  Submit Web Request (Below)
                </h3>
              </div>
              <p className="text-spa-muted leading-relaxed pl-8">
                Complete the secure verification form below with your registered phone number and account password. Once verified, your account and personal data will be queued for permanent erasure.
              </p>
            </div>

            {/* Method 2: In-App Immediate Deletion */}
            <div className="bg-white p-4 rounded border border-spa-petal/50 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-spa-rose text-white flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <h3 className="font-lustria font-semibold text-spa-text">
                  Direct In-App Deletion
                </h3>
              </div>
              <ol className="list-decimal list-inside text-spa-muted space-y-1 pl-8">
                <li>Open the <strong className="text-spa-text">USH Spa</strong> mobile app</li>
                <li>Tap <strong className="text-spa-text">Profile</strong> on the bottom bar</li>
                <li>Select <strong className="text-spa-text">Account Settings</strong></li>
                <li>Tap <strong className="text-red-600 font-medium">Delete Account</strong> &amp; Confirm</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Data Specification: Deleted vs Kept & Retention (Google Play Requirement) */}
        <section className="space-y-4">
          <h2 className="font-lustria text-lg sm:text-xl text-spa-text flex items-center gap-2">
            <span>🔒</span> Data Deletion Specification &amp; Retention Policies
          </h2>
          <p className="text-xs text-spa-muted leading-relaxed">
            In compliance with Google Play Store User Data policies, here is exact disclosure of what data is permanently expunged, what data is retained, and our legal justification:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Permanently Deleted */}
            <div className="bg-red-50/50 border border-red-200 rounded-sm p-4 space-y-2">
              <h3 className="font-lustria font-semibold text-red-900 flex items-center gap-2">
                <span>🗑️</span> Data Permanently Deleted
              </h3>
              <ul className="list-disc list-inside space-y-1 text-red-800 text-[11px] leading-relaxed">
                <li><strong className="text-red-900">Personal Identity &amp; Profile:</strong> Full name, phone number, email address, password hashes, and profile picture avatar.</li>
                <li><strong className="text-red-900">Authentication &amp; Sessions:</strong> Active login tokens, device push notification tokens (APNs / FCM).</li>
                <li><strong className="text-red-900">Treatment Records &amp; Notes:</strong> Saved spa preferences, therapist choices, and health/sensitivity notes voluntarily submitted.</li>
                <li><strong className="text-red-900">App Activity &amp; Wishlists:</strong> Saved favorite services and draft booking arrangements.</li>
              </ul>
            </div>

            {/* Data Kept & Justification */}
            <div className="bg-amber-50/50 border border-amber-200 rounded-sm p-4 space-y-2">
              <h3 className="font-lustria font-semibold text-amber-900 flex items-center gap-2">
                <span>📑</span> Data Kept &amp; Legal Justification
              </h3>
              <ul className="list-disc list-inside space-y-1 text-amber-800 text-[11px] leading-relaxed">
                <li><strong className="text-amber-900">Statutory Tax &amp; Invoicing Records:</strong> Completed transaction amounts, invoice numbers, and payment receipt logs.</li>
                <li><strong className="text-amber-900">Legal Basis:</strong> Mandatory retention under commercial, bookkeeping, and anti-fraud regulations in the State of Kuwait.</li>
                <li><strong className="text-amber-900">Isolation &amp; Anonymization:</strong> Retained accounting entries are stripped of direct user identifiers and isolated in secure audit archives.</li>
              </ul>
            </div>
          </div>

          <div className="bg-white border border-spa-petal/60 rounded p-4 text-xs text-spa-muted flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="font-semibold text-spa-text block">Processing &amp; Retention Timeline:</span>
              <span>Web requests are verified and executed within <strong className="text-spa-text">7 to 14 business days</strong>. Statutory transaction receipts are archived for up to 5 years as required by Kuwaiti commercial law.</span>
            </div>
            <Link
              href="/privacy-policy#account-deletion"
              className="text-xs text-spa-cherry hover:underline whitespace-nowrap"
            >
              Read Full Policy →
            </Link>
          </div>
        </section>

        {/* Verification & Request Form */}
        <section className="bg-white border-2 border-spa-petal rounded-sm p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-spa-petal/60 pb-4">
            <h2 className="font-lustria text-xl sm:text-2xl text-spa-text mb-1">
              Account Verification &amp; Deletion Form
            </h2>
            <p className="text-xs text-spa-muted leading-relaxed">
              To safeguard your account from unauthorized deletion, please enter your registered mobile phone number and password.
            </p>
          </div>

          {/* Success State */}
          {successData ? (
            <div className="bg-green-50 border border-green-200 rounded-sm p-6 space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center text-xl font-bold mx-auto">
                ✓
              </div>
              <h3 className="font-lustria text-xl text-green-900">
                Deletion Request Submitted
              </h3>
              <p className="text-xs text-green-800 max-w-md mx-auto leading-relaxed">
                {successData.message}
              </p>

              <div className="bg-white border border-green-200 p-4 rounded max-w-md mx-auto text-left space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-spa-muted">Request Reference ID:</span>
                  <span className="font-mono font-bold text-spa-text">{successData.referenceId}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-spa-muted">Expected Timeline:</span>
                  <span className="font-medium text-green-700">{successData.timeline}</span>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => copyRef(successData.referenceId)}
                    type="button"
                    className="w-full text-center text-xs bg-spa-cream hover:bg-spa-blush text-spa-cherry border border-spa-petal py-1.5 rounded transition-colors"
                  >
                    {copiedRef ? 'Copied Reference ID!' : 'Copy Reference ID'}
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-spa-muted">
                A confirmation record has been registered. If you need any assistance, contact our privacy desk at{' '}
                <a href="mailto:info@ushspa.co" className="text-spa-cherry underline">info@ushspa.co</a>.
              </p>

              <div className="pt-2">
                <Link href="/" className="btn-spa btn-rose text-xs py-2 px-5">
                  Return to Homepage
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-800 text-xs p-3.5 rounded flex items-start gap-2">
                  <span className="text-red-500 font-bold">⚠️</span>
                  <div className="leading-relaxed">{errorMessage}</div>
                </div>
              )}

              {/* Phone Number Field */}
              <div>
                <label className="block text-xs font-semibold text-spa-text uppercase tracking-wider mb-2">
                  Registered Mobile Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="flex rounded border border-spa-petal focus-within:border-spa-rose transition-colors overflow-hidden">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="bg-spa-cream/60 px-3 py-2.5 text-xs text-spa-text border-r border-spa-petal focus:outline-none"
                    aria-label="Country Code"
                  >
                    <option value="+965">🇰🇼 Kuwait (+965)</option>
                    <option value="+966">🇸🇦 Saudi Arabia (+966)</option>
                    <option value="+971">🇦🇪 UAE (+971)</option>
                    <option value="+974">🇶🇦 Qatar (+974)</option>
                    <option value="+973">🇧🇭 Bahrain (+973)</option>
                    <option value="+968">🇴🇲 Oman (+968)</option>
                    <option value="+1">🇺🇸 USA / Canada (+1)</option>
                    <option value="+44">🇬🇧 UK (+44)</option>
                  </select>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 55555564"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs text-spa-text focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-spa-muted mt-1">
                  Enter the phone number associated with your USH Spa mobile app account.
                </p>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-semibold text-spa-text uppercase tracking-wider mb-2">
                  Account Password <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded border border-spa-petal focus-within:border-spa-rose transition-colors">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your account password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs text-spa-text focus:outline-none pr-12 rounded"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-xs text-spa-muted hover:text-spa-text"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <p className="text-[11px] text-spa-muted mt-1">
                  Required to authenticate that you are the verified owner of this account.
                </p>
              </div>

              {/* Reason for Deletion (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-spa-text uppercase tracking-wider mb-2">
                  Reason for Leaving (Optional)
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs text-spa-text border border-spa-petal rounded focus:outline-none focus:border-spa-rose bg-white"
                >
                  <option value="">Select a reason (optional)...</option>
                  <option value="No longer using the USH Spa app">No longer using the USH Spa app</option>
                  <option value="Privacy concerns regarding data">Privacy concerns regarding data</option>
                  <option value="Created duplicate account">Created duplicate account</option>
                  <option value="Relocated outside Kuwait">Relocated outside Kuwait</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Additional Notes (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-spa-text uppercase tracking-wider mb-2">
                  Additional Feedback or Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Any additional feedback or specific instructions..."
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs text-spa-text border border-spa-petal rounded focus:outline-none focus:border-spa-rose"
                />
              </div>

              {/* Confirmation Checkbox */}
              <div className="p-3.5 bg-red-50/50 border border-red-200/80 rounded">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={acknowledged}
                    onChange={(e) => setAcknowledged(e.target.checked)}
                    className="mt-0.5 rounded border-red-300 text-spa-cherry focus:ring-spa-rose"
                  />
                  <span className="text-xs text-spa-text leading-relaxed">
                    <strong className="text-red-700">I confirm that I wish to permanently delete my USH Spa account.</strong> I understand that this action is irreversible, my active appointments and profile data will be permanently removed, and any unused gift vouchers linked to this account cannot be recovered once purged.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-6 rounded-sm text-xs font-medium uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${
                    loading
                      ? 'bg-spa-muted text-white cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700 text-white shadow-md'
                  }`}
                  style={{ color: '#ffffff' }}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying &amp; Submitting Request...
                    </>
                  ) : (
                    'Submit Account Deletion Request'
                  )}
                </button>
              </div>
            </form>
          )}
        </section>

        {/* Alternative Support Option */}
        <section className="bg-spa-cream/40 border border-spa-petal/50 rounded-sm p-5 text-xs text-spa-muted space-y-2">
          <h3 className="font-lustria font-semibold text-spa-text flex items-center gap-2">
            <span>💬</span> Having Trouble or Forgot Your Password?
          </h3>
          <p className="leading-relaxed">
            If you cannot remember your account password or have difficulty using this form, you can submit a manual deletion request directly to our customer privacy desk:
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
            <div className="space-y-1">
              <p>Email: <a href="mailto:info@ushspa.co?subject=Manual%20Account%20Deletion%20Request" className="text-spa-cherry hover:underline font-medium">info@ushspa.co</a></p>
              <p>Phone / WhatsApp: <a href={USH_PHONE_TEL_HREF} className="text-spa-text hover:text-spa-cherry font-medium">{USH_PHONE_DISPLAY}</a></p>
            </div>
            <a
              href="mailto:info@ushspa.co?subject=Manual%20Account%20Deletion%20Request%20-%20USH%20Spa"
              className="btn-spa btn-rose text-xs py-1.5 px-3"
            >
              Email Privacy Desk
            </a>
          </div>
        </section>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
