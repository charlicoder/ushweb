'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useApp } from '@/context/AppContext';
import { CheckCircleIcon, ExclamationTriangleIcon, HomeIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

/* ── Palette (USH Spa luxury): #543C30, #D3C0B1, #4E2712, #EBE5DE, #FFFFFF + gold accent ── */
const GOLD = '#C9A24B';
const HERO_IMAGE = '/images/feedback-hero.jpg';

type RatingKey = 'service' | 'therapist' | 'arrangement';
type Ratings = Record<RatingKey, number>;
type Phase = 'loading' | 'invalid' | 'error' | 'form' | 'thanks' | 'already';

interface FeedbackContext {
  status: 'pending' | 'submitted';
  language: 'ar' | 'en';
}

const QUESTIONS: Array<{
  key: RatingKey;
  title: [string, string];
  hint: [string, string];
}> = [
  {
    key: 'service',
    title: ['1. How would you rate our service?', '1. كيف تقيّمين خدمتنا؟'],
    hint: ['Quality of the spa service you received', 'جودة الخدمة التي حصلتِ عليها'],
  },
  {
    key: 'therapist',
    title: ['2. How would you rate your therapist?', '2. كيف تقيّمين أخصائيتك؟'],
    hint: ['Professionalism, skills, and care', 'الاحترافية والمهارة والاهتمام'],
  },
  {
    key: 'arrangement',
    title: ['3. How would you rate our overall arrangements?', '3. كيف تقيّمين ترتيباتنا بشكل عام؟'],
    hint: [
      'Cleanliness, ambience, comfort, and organization',
      'النظافة والأجواء والراحة والتنظيم',
    ],
  },
];

const RATING_LABELS: Array<[string, string]> = [
  ['Poor', 'سيئ'],
  ['Fair', 'مقبول'],
  ['Good', 'جيد'],
  ['Very good', 'جيد جداً'],
  ['Excellent', 'ممتاز'],
];

/* ── Star rating (radio group, keyboard accessible) ── */
function StarRating({
  value,
  onChange,
  label,
  getStarLabel,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
  getStarLabel: (n: number) => string;
}) {
  const [hover, setHover] = useState(0);
  const active = hover || value;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (['ArrowRight', 'ArrowUp'].includes(e.key) || ['ArrowLeft', 'ArrowDown'].includes(e.key)) {
      e.preventDefault();
      // Arrow keys follow the visual direction: in RTL, "right" goes to a lower rating.
      const rtl = document.documentElement.dir === 'rtl';
      const forward = e.key === 'ArrowUp' || (rtl ? e.key === 'ArrowLeft' : e.key === 'ArrowRight');
      const next = forward ? Math.min(5, (value || 0) + 1) : Math.max(1, (value || 2) - 1);
      onChange(next);
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKeyDown}
      onMouseLeave={() => setHover(0)}
      className="flex items-center justify-between"
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= active;
        const Icon = filled ? StarSolid : StarOutline;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={getStarLabel(n)}
            tabIndex={value === n || (!value && n === 1) ? 0 : -1}
            onClick={() => onChange(n)}
            onMouseEnter={() => setHover(n)}
            onFocus={() => setHover(0)}
            className="group rounded-full p-1.5 outline-none transition-transform duration-150 hover:scale-110 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#C9A24B]/60"
          >
            <Icon
              className="h-7 w-7 transition-colors duration-150 sm:h-8 sm:w-8"
              style={{ color: filled ? GOLD : '#6b6460' }}
              strokeWidth={filled ? undefined : 1.5}
            />
          </button>
        );
      })}
    </div>
  );
}

/* ── Centered state card (loading / invalid / thanks) ── */
function StateCard({
  icon,
  title,
  body,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="px-6 py-14 text-center sm:px-10">
      <div className="mb-5 flex justify-center">{icon}</div>
      <h1 className="font-lustria mb-2 text-2xl font-bold text-[#4E2712] dark:text-[#EBE5DE] sm:text-3xl">{title}</h1>
      <p className="mx-auto max-w-sm text-sm leading-relaxed text-[#543C30]/80 dark:text-[#D3C0B1]/80">{body}</p>
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}

export default function FeedbackClient({ token }: { token: string }) {
  const { isAr, t, dir, lang, setLang } = useApp();

  // Child effects run before the provider's, so this captures whether the visitor had
  // chosen a language before the provider persists its default.
  const hadSavedLang = useRef<boolean | null>(null);
  useEffect(() => {
    if (hadSavedLang.current === null) {
      try {
        const saved = localStorage.getItem('ush_lang');
        hadSavedLang.current = saved === 'en' || saved === 'ar';
      } catch {
        hadSavedLang.current = false;
      }
    }
  }, []);

  const [phase, setPhase] = useState<Phase>('loading');
  const [ratings, setRatings] = useState<Ratings>({ service: 0, therapist: 0, arrangement: 0 });
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setPhase('loading');
    try {
      const res = await fetch(`/api/feedback/${encodeURIComponent(token)}`, { cache: 'no-store' });
      if (res.status === 404) {
        setPhase('invalid');
        return;
      }
      const json = await res.json().catch(() => ({}));
      const data = (json?.data ?? null) as FeedbackContext | null;
      if (!res.ok || !data) {
        setPhase('error');
        return;
      }
      if (hadSavedLang.current === false && (data.language === 'ar' || data.language === 'en')) {
        setLang(data.language);
      }
      setPhase(data.status === 'submitted' ? 'already' : 'form');
    } catch {
      setPhase('error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const allRated = ratings.service > 0 && ratings.therapist > 0 && ratings.arrangement > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allRated || submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch(`/api/feedback/${encodeURIComponent(token)}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_rating: ratings.service,
          therapist_rating: ratings.therapist,
          arrangement_rating: ratings.arrangement,
          comment: comment.trim() || null,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setPhase('thanks');
      } else if (res.status === 409 || json?.error?.code === 'ALREADY_SUBMITTED') {
        setPhase('already');
      } else if (res.status === 404) {
        setPhase('invalid');
      } else {
        setSubmitError(
          t('We could not submit your feedback. Please try again.', 'تعذّر إرسال ملاحظاتك. يرجى المحاولة مرة أخرى.')
        );
      }
    } catch {
      setSubmitError(
        t('Connection problem. Please check your internet and try again.', 'مشكلة في الاتصال. يرجى التحقق من الإنترنت والمحاولة مرة أخرى.')
      );
    } finally {
      setSubmitting(false);
    }
  };

  const homeLink = (
    <Link
      href="/"
      className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
      style={{ background: 'linear-gradient(135deg,#543C30,#4E2712)' }}
    >
      <HomeIcon className="h-4 w-4" />
      {t('Back to USH Spa', 'العودة إلى أوش سبا')}
    </Link>
  );

  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#faf7f5] text-spa-text antialiased transition-colors duration-300 dark:bg-[#151210] dark:text-[#EBE5DE]">
      <Header />

      <main className="relative flex flex-grow items-start justify-center px-4 pb-20 pt-32 sm:px-6">
        <div className="pointer-events-none absolute right-10 top-16 h-96 w-96 rounded-full bg-spa-rose/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 left-10 h-80 w-80 rounded-full bg-spa-petal/25 blur-2xl" />

        <div
          dir={dir}
          className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-[#D3C0B1]/50 bg-white/95 backdrop-blur-md dark:border-white/10 dark:bg-[#2A221E]/95"
          style={{ boxShadow: '0 20px 50px rgba(84,60,48,0.08), 0 4px 16px rgba(0,0,0,0.04)' }}
        >
          {/* Language switch */}
          <div className="flex justify-end px-5 pt-4">
            <div className="inline-flex items-center rounded-full border border-[#D3C0B1]/60 bg-[#EBE5DE]/50 p-0.5 dark:border-white/15 dark:bg-white/5">
              {(['en', 'ar'] as const).map((l) => (
                <button
                  key={l}
                  id={`feedback-lang-${l}`}
                  type="button"
                  onClick={() => setLang(l)}
                  aria-pressed={lang === l}
                  className="rounded-full px-3 py-1 text-[11px] font-bold transition"
                  style={{
                    background: lang === l ? '#543C30' : 'transparent',
                    color: lang === l ? '#FFFFFF' : '#543C30',
                  }}
                >
                  {l === 'en' ? 'EN' : 'عربي'}
                </button>
              ))}
            </div>
          </div>

          {phase === 'loading' && (
            <div className="space-y-4 px-6 pb-10 pt-4 sm:px-8" aria-busy="true" aria-live="polite">
              <div className="h-44 animate-pulse rounded-2xl bg-[#EBE5DE]/70 dark:bg-white/10 sm:h-52" />
              <div className="mx-auto h-6 w-48 animate-pulse rounded bg-[#EBE5DE]/70 dark:bg-white/10" />
              <div className="mx-auto h-4 w-64 animate-pulse rounded bg-[#EBE5DE]/60 dark:bg-white/10" />
              <div className="h-24 animate-pulse rounded-2xl bg-[#EBE5DE]/50 dark:bg-white/10" />
            </div>
          )}

          {phase === 'invalid' && (
            <StateCard
              icon={<ExclamationTriangleIcon className="h-14 w-14 text-[#B7605A]" />}
              title={t('Link not found', 'الرابط غير موجود')}
              body={t(
                'This feedback link is invalid or no longer available. Please contact USH Spa if you need help.',
                'رابط التقييم هذا غير صالح أو لم يعد متاحاً. يرجى التواصل مع أوش سبا إذا احتجتِ للمساعدة.'
              )}
              action={homeLink}
            />
          )}

          {phase === 'error' && (
            <StateCard
              icon={<ExclamationTriangleIcon className="h-14 w-14 text-[#C9A24B]" />}
              title={t('Something went wrong', 'حدث خطأ ما')}
              body={t('We could not load this page. Please try again.', 'تعذّر تحميل هذه الصفحة. يرجى المحاولة مرة أخرى.')}
              action={
                <button
                  type="button"
                  onClick={() => void load()}
                  className="rounded-full px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg,#543C30,#4E2712)' }}
                >
                  {t('Try again', 'إعادة المحاولة')}
                </button>
              }
            />
          )}

          {(phase === 'thanks' || phase === 'already') && (
            <StateCard
              icon={
                <div className="relative">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-emerald-200/80 bg-gradient-to-tr from-emerald-50 to-emerald-100 shadow-inner">
                    <CheckCircleIcon className="h-12 w-12 text-emerald-600" />
                  </div>
                  <div className="pointer-events-none absolute inset-0 animate-ping rounded-full border border-emerald-400/40 opacity-20" />
                </div>
              }
              title={
                phase === 'thanks'
                  ? t('Thank you for your feedback', 'شكراً لملاحظاتك')
                  : t('Feedback already submitted', 'تم إرسال التقييم مسبقاً')
              }
              body={
                phase === 'thanks'
                  ? t(
                      'Your feedback helps us make every visit special. We look forward to welcoming you again at USH Spa.',
                      'ملاحظاتك تساعدنا على جعل كل زيارة مميزة. نتطلع لاستقبالك مجدداً في أوش سبا.'
                    )
                  : t(
                      'We have already received your feedback for this visit. Thank you for sharing your experience with us.',
                      'لقد استلمنا تقييمك لهذه الزيارة بالفعل. شكراً لمشاركتنا تجربتك.'
                    )
              }
              action={homeLink}
            />
          )}

          {phase === 'form' && (
            <form onSubmit={handleSubmit} noValidate className="px-6 pb-8 pt-2 sm:px-8">
              {/* Hero image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={HERO_IMAGE}
                alt={t('USH Spa treatment room', 'غرفة العلاج في أوش سبا')}
                className="h-44 w-full rounded-2xl object-cover sm:h-52"
              />

              <div className="mb-6 mt-5 text-center">
                <h1 className="font-lustria mb-1 text-2xl font-bold text-[#4E2712] dark:text-[#EBE5DE] sm:text-[1.7rem]">
                  {t('Share Your Experience', 'شاركينا تجربتك')}
                </h1>
                <p className="text-sm text-[#543C30]/75 dark:text-[#D3C0B1]/80">
                  {t('Your feedback helps us make every visit special.', 'ملاحظاتك تساعدنا على جعل كل زيارة مميزة.')}
                </p>
              </div>

              {QUESTIONS.map((q) => {
                const value = ratings[q.key];
                return (
                  <section key={q.key} className="border-b border-[#D3C0B1]/40 py-5 dark:border-white/10">
                    <h2 className="text-[15px] font-semibold text-[#4E2712] dark:text-[#EBE5DE]">{isAr ? q.title[1] : q.title[0]}</h2>
                    <p className="mb-3 mt-0.5 text-[13px] text-[#543C30]/70 dark:text-[#D3C0B1]/75">{isAr ? q.hint[1] : q.hint[0]}</p>
                    <StarRating
                      value={value}
                      onChange={(v) => setRatings((r) => ({ ...r, [q.key]: v }))}
                      label={isAr ? q.title[1] : q.title[0]}
                      getStarLabel={(n) => `${n} — ${isAr ? RATING_LABELS[n - 1][1] : RATING_LABELS[n - 1][0]}`}
                    />
                    <p className="mt-1 h-4 px-1.5 text-xs font-medium text-[#543C30]/70 dark:text-[#D3C0B1]/75" aria-live="polite">
                      {value ? (isAr ? RATING_LABELS[value - 1][1] : RATING_LABELS[value - 1][0]) : ''}
                    </p>
                  </section>
                );
              })}

              <section className="py-5">
                <label htmlFor="feedback-comment" className="mb-2 block text-[15px] font-semibold text-[#4E2712] dark:text-[#EBE5DE]">
                  {t('Additional comments (optional)', 'ملاحظات إضافية (اختياري)')}
                </label>
                <textarea
                  id="feedback-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  maxLength={1000}
                  rows={3}
                  placeholder={t('Tell us how we can improve...', 'أخبرينا كيف يمكننا التحسّن...')}
                  className="w-full resize-none rounded-xl border border-[#D3C0B1]/70 bg-white px-3.5 py-3 text-sm text-spa-text outline-none transition placeholder:text-[#543C30]/40 focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/25 dark:border-white/15 dark:bg-[#1E1917] dark:text-[#EBE5DE]"
                />
              </section>

              {submitError && (
                <div role="alert" className="mb-3 rounded-xl border border-[#B7605A]/30 bg-[#B7605A]/10 px-3.5 py-2.5 text-xs font-medium text-[#B7605A]">
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={!allRated || submitting}
                className="w-full rounded-full py-3 text-sm font-semibold transition-all duration-200 enabled:text-white enabled:shadow-md enabled:hover:opacity-90 enabled:active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#EBE5DE] disabled:text-[#543C30]/45 dark:disabled:bg-white/10"
                style={allRated && !submitting ? { background: 'linear-gradient(135deg,#543C30,#4E2712)' } : undefined}
              >
                {submitting ? t('Submitting…', 'جارٍ الإرسال…') : t('Submit Feedback', 'إرسال التقييم')}
              </button>
              {!allRated && (
                <p className="mt-2 text-center text-[11px] text-[#543C30]/55 dark:text-[#D3C0B1]/60">
                  {t('Please rate all three questions to continue.', 'يرجى تقييم الأسئلة الثلاثة للمتابعة.')}
                </p>
              )}
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

