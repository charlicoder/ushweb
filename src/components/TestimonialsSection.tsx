'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';

interface Testimonial {
    avatar: string;
    alt: string;
    nameEn: string;
    nameAr: string;
    roleEn: string;
    roleAr: string;
    textEn: string;
    textAr: string;
}

const testimonials: Testimonial[] = [
    {
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80',
        alt: 'Client at USH Spa',
        nameEn: 'Sara Al-Mutawa',
        nameAr: 'سارة المطوع',
        roleEn: 'Fashion Designer',
        roleAr: 'مصممة أزياء',
        textEn: 'USH Spa is absolutely incredible! The Thai massage therapy was the most relaxing experience. The therapists are certified and the ambiance is pure tranquility.',
        textAr: 'سبا أوش تجربة تفوق الوصف! جلسة التدليك التايلاندي كانت الأكثر راحة واسترخاءً. الأخصائيات محترفات جداً والأجواء مفعمة بالسكينة والراحة النفسية.',
    },
    {
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80',
        alt: 'Client at USH Spa',
        nameEn: 'Reem Al-Kandari',
        nameAr: 'ريم الكندري',
        roleEn: 'Wellness Enthusiast',
        roleAr: 'مهتمة بالصحة والعافية',
        textEn: 'I have been visiting USH Spa regularly. The facial treatments have transformed my skin completely. Warm, professional, and attentive staff every time.',
        textAr: 'أنا زبونة دائمة لدى معهد أوش سبا. جلسات العناية بالوجه ونضارة البشرة أحدثت فرقاً ملموساً في إشراقة بشرتي. تعامل راقٍ وخدمة استثنائية.',
    },
    {
        avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&q=80',
        alt: 'Client at USH Spa',
        nameEn: 'Dana Al-Sabah',
        nameAr: 'دانة الصباح',
        roleEn: 'Graphic Designer',
        roleAr: 'مصممة جرافيك',
        textEn: 'The hot stone therapy at USH Spa is sheer magic. I came in with severe back tension and left feeling deeply renewed. Attention to detail is unmatched.',
        textAr: 'جلسة الأحجار الساخنة في أوش سبا ساحرة بكل المقاييس. كنت أعاني من إجهاد وتشنج عضلات الظهر وخرجت بطاقة ونشاط جديدين تماماً.',
    },
    {
        avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&q=80',
        alt: 'Client at USH Spa',
        nameEn: 'Noura Al-Hajri',
        nameAr: 'نورة الهاجري',
        roleEn: 'Business Executive',
        roleAr: 'سيدة أعمال',
        textEn: 'As someone with a demanding schedule, USH Spa is my personal sanctuary. The booking process is effortless, and treatments are always exceptional.',
        textAr: 'مع ضغوط العمل اليومية، أصبح أوش سبا ملاذي الخاص لتجديد طاقتي. سهولة الحجز ودقة المواعيد والاحترافية العالية تجعلهم دائماً خياري الأول.',
    },
    {
        avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&q=80',
        alt: 'Client at USH Spa',
        nameEn: 'Maryam Al-Qattan',
        nameAr: 'مريم القطان',
        roleEn: 'Yoga Instructor',
        roleAr: 'مدربة يوغا',
        textEn: 'The body scrub and herbal wrap treatment is phenomenal. My skin feels incredibly soft. The organic products and calming scent are pure bliss.',
        textAr: 'جلسة تقشير وتغليف الجسم بالأعشاب الطبيعية كانت مذهلة. ملمس بشرتي أصبح حريرياً والزيوت العطرية النقية تشعركِ بالاسترخاء العميق.',
    },
    {
        avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&q=80',
        alt: 'Client at USH Spa',
        nameEn: 'Fatima Al-Otaibi',
        nameAr: 'فاطمة العتيبي',
        roleEn: 'Interior Architect',
        roleAr: 'مهندسة تصميم داخلي',
        textEn: 'I received a gift voucher from a dear friend for USH Spa, and it was one of the finest experiences ever. Highly recommended for every woman in Kuwait!',
        textAr: 'وصلتني قسيمة إهداء من صديقة لزيارة أوش سبا، وكانت من أروع الهدايا وأجمل التجارب. أنصح بشدة كل سيدة بزيارة هذا المعهد الراقي.',
    },
];

export default function TestimonialsSection() {
    const { isAr } = useApp();
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 3;
    const totalPages = Math.ceil(testimonials.length / itemsPerPage);

    const currentTestimonials = testimonials.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    return (
        <section id="testimonials" className="py-24 bg-white dark:bg-[#1a1310] transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-4">
                {/* Section Title */}
                <div className="section-title mb-14 text-center">
                    <span className="section-id text-spa-rose">
                        {isAr ? 'آراء عميلاتنا' : 'Testimonials'}
                    </span>
                    <h2 className="font-lustria text-3xl sm:text-4xl md:text-5xl text-spa-text dark:text-[#f7eee9] mb-4 transition-colors duration-300">
                        {isAr ? 'ماذا تقول عميلاتنا عن تجربتهن' : 'What Our Clients Say'}
                    </h2>
                    <p className="text-spa-muted dark:text-[#b5a49c] max-w-2xl mx-auto transition-colors duration-300">
                        {isAr
                            ? 'نعتز بثقة ورضا ضيفاتنا الكريمات. إليكِ بعض الانطباعات الحقيقية لعميلات خضن تجربة الاسترخاء والعناية في معهد أوش سبا.'
                            : 'Don’t just take our word for it. Here’s what our valued clients have to say about their tranquil USH Spa experience.'}
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-10">
                    {currentTestimonials.map((testimonial, idx) => (
                        <div
                            key={idx}
                            className="bg-spa-cream dark:bg-[#231a16] border border-spa-petal/40 dark:border-white/10 p-6 rounded-xl shadow-spa hover:shadow-spa-md transition-all duration-300 flex flex-col justify-between"
                        >
                            <div>
                                {/* Avatar + Author */}
                                <div className="flex items-center gap-4 mb-4">
                                    <img
                                        src={testimonial.avatar}
                                        alt={testimonial.alt}
                                        className="w-14 h-14 rounded-full object-cover border-2 border-spa-rose"
                                    />
                                    <div>
                                        <h6 className="font-lustria text-sm text-spa-text dark:text-[#f7eee9] font-bold transition-colors duration-300">
                                            {isAr ? testimonial.nameAr : testimonial.nameEn}
                                        </h6>
                                        <p className="text-spa-rose text-xs font-medium">
                                            {isAr ? testimonial.roleAr : testimonial.roleEn}
                                        </p>
                                    </div>
                                </div>

                                {/* Stars */}
                                <div className="flex gap-1 mb-3">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <svg key={star} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>

                                {/* Text */}
                                <p className="text-spa-muted dark:text-[#c4b5ad] text-sm leading-relaxed italic transition-colors duration-300">
                                    &ldquo;{isAr ? testimonial.textAr : testimonial.textEn}&rdquo;
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center gap-3">
                    {Array.from({ length: totalPages }).map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentPage(idx)}
                            className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                                currentPage === idx
                                    ? 'bg-spa-rose border-spa-rose scale-110'
                                    : 'bg-transparent border-spa-muted hover:border-spa-rose'
                            }`}
                            aria-label={`Go to testimonial page ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}