'use client';

import { useApp } from '@/context/AppContext';

interface Service {
    image: string;
    alt: string;
    titleEn: string;
    titleAr: string;
    descEn: string;
    descAr: string;
}

const services: Service[] = [
    {
        image: 'https://img.rocket.new/generatedImages/rocket_gen_img_19969baec-1767016827953.png',
        alt: 'Combination massage therapy with hot stones and essential oils',
        titleEn: 'Combination Massage',
        titleAr: 'التدليك المزدوج المتكامل',
        descEn: 'A perfect blend of Swedish and deep tissue techniques to relieve tension and promote deep relaxation throughout your body.',
        descAr: 'مزيج متناغم يجمع بين تقنيات المساج السويدي والأنسجة العميقة لإزالة التوتر العضلي وتحفيز الاسترخاء في سائر الجسد.',
    },
    {
        image: 'https://img.rocket.new/generatedImages/rocket_gen_img_18984906e-1773053888957.png',
        alt: 'Special skincare facial treatment with natural products',
        titleEn: 'Special Care Solutions',
        titleAr: 'حلول العناية المتخصصة بالبشرة',
        descEn: 'Customized skincare treatments designed to address your specific skin concerns using premium organic formulations.',
        descAr: 'برامج عناية مخصصة لمعالجة احتياجات بشرتكِ بدقة باستخدام تركيبات عضوية غنية بالمستخلصات الطبيعية الفعالة.',
    },
    {
        image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1bb336078-1773907383325.png',
        alt: 'Relaxing body treatment with warm towels and aromatherapy',
        titleEn: 'Relaxing Body Treatments',
        titleAr: 'علاجات الجسم المهدئة',
        descEn: 'Immerse yourself in our signature body treatments that cleanse, nourish, and revitalize your skin from head to toe.',
        descAr: 'استمتعي بعلاجاتنا المميزة لتنظيف وتغذية وتجديد خلايا البشرة واستعادة نضارتها من الرأس حتى القدمين.',
    },
    {
        image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1c7c52ebe-1772222079321.png',
        alt: 'Aromatherapy oils and essential oil diffuser for spa treatment',
        titleEn: 'Oils & Aromatherapy',
        titleAr: 'الزيوت وجلسات الروائح العطرية',
        descEn: 'Harness the healing power of pure essential oils in our aromatherapy sessions that calm the mind and restore the spirit.',
        descAr: 'استفيدي من الخصائص العلاجية المذهلة للزيوت العطرية النقية في جلساتنا لتهدئة الذهن واستعادة السكينة والصفاء الداخلي.',
    },
];

export default function ServicesSection() {
    const { isAr } = useApp();

    return (
        <section id="services" className="py-24 bg-spa-pearl dark:bg-[#16100d] transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-4">
                {/* Section Title */}
                <div className="section-title mb-14 text-center">
                    <span className="section-id text-spa-rose">
                        {isAr ? 'خدماتنا المتميزة' : 'Our Services'}
                    </span>
                    <h2 className="font-lustria text-3xl sm:text-4xl md:text-5xl text-spa-text dark:text-[#f7eee9] mb-4 transition-colors duration-300">
                        {isAr ? 'فن الجمال والعناية الطبيعية' : 'The Art Of Natural Beauty'}
                    </h2>
                    <p className="text-spa-muted dark:text-[#b5a49c] max-w-2xl mx-auto transition-colors duration-300">
                        {isAr
                            ? 'اكتشفي تشكيلتنا المتكاملة من خدمات السبا، حيث صُممت كل جلسة بدقة لتمنحكِ تجربة استرخاء وعافية استثنائية تناسب تطلعاتكِ.'
                            : 'Discover our comprehensive range of spa services, each crafted to deliver an exceptional wellness experience tailored to your individual needs.'}
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service) => (
                        <div
                            key={service.titleEn}
                            className="service-card bg-white dark:bg-[#231a16] border border-spa-petal/40 dark:border-white/10 rounded-xl shadow-spa hover:shadow-spa-md transition-all duration-400 overflow-hidden group flex flex-col justify-between"
                        >
                            {/* Image */}
                            <div className="overflow-hidden h-52">
                                <img
                                    src={service.image}
                                    alt={service.alt}
                                    className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
                                />
                            </div>

                            {/* Content */}
                            <div className="p-6 flex flex-col flex-1 justify-between">
                                <div>
                                    <h5 className="font-lustria text-lg text-spa-text dark:text-[#f7eee9] mb-3 group-hover:text-spa-rose transition-colors duration-300">
                                        {isAr ? service.titleAr : service.titleEn}
                                    </h5>
                                    <p className="text-spa-muted dark:text-[#b5a49c] text-sm leading-relaxed mb-4 transition-colors duration-300">
                                        {isAr ? service.descAr : service.descEn}
                                    </p>
                                </div>
                                <a
                                    href="#booking"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="text-spa-rose text-sm font-medium hover:text-spa-cherry transition-colors duration-300 inline-flex items-center gap-1.5 mt-auto"
                                >
                                    <span>{isAr ? 'احجز هذه الجلسة' : 'Find Out More'}</span>
                                    <svg
                                        className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}