'use client';

import { useApp } from '@/context/AppContext';

interface BlogPost {
    image: string;
    alt: string;
    categoryEn: string;
    categoryAr: string;
    titleEn: string;
    titleAr: string;
    excerptEn: string;
    excerptAr: string;
    authorEn: string;
    authorAr: string;
    dateEn: string;
    dateAr: string;
}

const posts: BlogPost[] = [
    {
        image: 'https://img.rocket.new/generatedImages/rocket_gen_img_143835b43-1767951777624.png',
        alt: 'Skincare tips and natural beauty products for glowing skin',
        categoryEn: 'Skincare',
        categoryAr: 'العناية بالبشرة',
        titleEn: '5 Essential Skincare Tips for Radiant, Glowing Skin',
        titleAr: '5 نصائح جوهرية لبشرة نضرة ومشرقة تشع حيوية',
        excerptEn: 'Discover the secrets to achieving naturally radiant skin with our expert skincare tips, from daily hydration routines to professional treatments that make a real difference.',
        excerptAr: 'اكتشفي أسرار الحصول على بشرة طبيعية نضرة ومتوهجة من خلال العناية اليومية بالترطيب وجلسات السبا التايلاندية المتخصصة.',
        authorEn: 'Stacey Richardson',
        authorAr: 'ستيسي ريتشاردسون',
        dateEn: 'Nov 15, 2024',
        dateAr: '15 نوفمبر 2024',
    },
    {
        image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1f57a010f-1778341951225.png',
        alt: 'Massage therapy benefits for stress relief and muscle recovery',
        categoryEn: 'Massage Therapy',
        categoryAr: 'التدليك العلاجي',
        titleEn: 'The Healing Benefits of Regular Massage Therapy',
        titleAr: 'الفوائد العلاجية المذهلة لجلسات التدليك المنتظمة',
        excerptEn: 'Regular massage therapy offers far more than just relaxation. Learn how consistent treatments can improve circulation, reduce stress, and enhance overall quality of life.',
        excerptAr: 'تمنحكِ جلسات التدليك التايلاندي المنتظمة فوائد صحية عميقة تتجاوز الاسترخاء، منها تنشيط الدورة الدموية وتخفيف آلام وتشنجات الظهر والرقبة.',
        authorEn: 'Jennifer Harper',
        authorAr: 'جينيفر هاربر',
        dateEn: 'Nov 08, 2024',
        dateAr: '08 نوفمبر 2024',
    },
    {
        image: 'https://img.rocket.new/generatedImages/rocket_gen_img_159444a96-1768552377135.png',
        alt: 'Aromatherapy essential oils and their therapeutic benefits',
        categoryEn: 'Aromatherapy',
        categoryAr: 'العلاج بالروائح العطرية',
        titleEn: 'A Guide to Aromatherapy: Scents That Heal and Restore',
        titleAr: 'دليلكِ الشامل للزيوت العطرية: روائح تعيد السكينة والصفاء',
        excerptEn: 'Explore the ancient art of aromatherapy and discover how essential oils can transform your wellness routine, from lavender for calmness to eucalyptus for renewed energy.',
        excerptAr: 'استكشفي الفن القديم للعلاج بالزيوت الطبيعية وكيف تسهم روائح اللافندر والأوكالبتوس في تهدئة الجهاز العصبي واستعادة الحيوية الذهنية.',
        authorEn: 'Jane Smith',
        authorAr: 'جين سميث',
        dateEn: 'Oct 28, 2024',
        dateAr: '28 أكتوبر 2024',
    },
];

export default function BlogSection() {
    const { isAr } = useApp();

    return (
        <section id="blog" className="py-24 bg-white dark:bg-[#1a1310] transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-4">
                {/* Section Title */}
                <div className="section-title mb-14 text-center">
                    <span className="section-id text-spa-rose">
                        {isAr ? 'مدونة العافية' : 'Our Blog'}
                    </span>
                    <h2 className="font-lustria text-3xl sm:text-4xl md:text-5xl text-spa-text dark:text-[#f7eee9] mb-4 transition-colors duration-300">
                        {isAr ? 'أحدث المقالات والنصائح الجمالية' : 'Latest News & Events'}
                    </h2>
                    <p className="text-spa-muted dark:text-[#b5a49c] max-w-2xl mx-auto transition-colors duration-300">
                        {isAr
                            ? 'تابعي أحدث الاتجاهات والنصائح الصحية وأسرار العناية بالبشرة والجسد التي يشارككِ إياها فريق الخبيرات في معهد أوش سبا.'
                            : 'Stay up to date with the latest wellness trends, spa tips, and beauty insights from our expert team at USH Spa.'}
                    </p>
                </div>

                {/* Blog Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <article
                            key={post.titleEn}
                            className="blog-post bg-white dark:bg-[#231a16] border border-spa-petal/40 dark:border-white/10 rounded-xl overflow-hidden shadow-spa hover:shadow-spa-md transition-all duration-300 flex flex-col justify-between"
                        >
                            <div>
                                <div className="blog-post-img h-48 overflow-hidden">
                                    <img
                                        src={post.image}
                                        alt={post.alt}
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                    />
                                </div>
                                <div className="p-6">
                                    <span className="text-xs uppercase tracking-wider text-spa-rose font-bold block mb-2">
                                        {isAr ? post.categoryAr : post.categoryEn}
                                    </span>
                                    <h4 className="font-lustria text-lg text-spa-text dark:text-[#f7eee9] font-bold mb-3 hover:text-spa-rose transition-colors duration-300">
                                        {isAr ? post.titleAr : post.titleEn}
                                    </h4>
                                    <p className="text-spa-muted dark:text-[#b5a49c] text-sm leading-relaxed mb-4 transition-colors duration-300">
                                        {isAr ? post.excerptAr : post.excerptEn}
                                    </p>
                                </div>
                            </div>
                            <div className="px-6 pb-6 pt-2 border-t border-spa-petal/40 dark:border-white/10 flex items-center justify-between text-xs text-spa-muted dark:text-[#b5a49c]">
                                <span>{isAr ? post.authorAr : post.authorEn}</span>
                                <span>{isAr ? post.dateAr : post.dateEn}</span>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
