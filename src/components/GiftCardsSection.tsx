'use client';

interface GiftCard {
    title: string;
    discount: string;
    description: string;
}

const giftCards: GiftCard[] = [
    {
        title: 'Relaxation Package',
        discount: '-25%',
        description: 'Swedish massage + facial treatment combo'
    },
    {
        title: 'Deep Tissue Massage',
        discount: '-30%',
        description: 'Full body deep tissue massage session'
    },
    {
        title: 'Aromatherapy Facial',
        discount: '-12%',
        description: 'Premium aromatherapy facial treatment'
    }];


export default function GiftCardsSection() {
    return (
        <section id="gift-cards" className="py-24 bg-white">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left: Content */}
                    <div>
                        <div className="section-title text-left mb-10">
                            <span className="section-id text-spa-rose">Gift Cards</span>
                            <h2 className="font-lustria text-4xl md:text-5xl text-spa-text mb-4">
                                Experience Life With Color
                            </h2>
                            <p className="text-spa-muted leading-relaxed">
                                Give the gift of relaxation and beauty. Our gift cards are the perfect way to share
                                the USH Spa experience with someone special.
                            </p>
                        </div>

                        {/* Gift Card List */}
                        <div className="flex flex-col gap-4">
                            {giftCards.map((card) =>
                                <a
                                    key={card.title}
                                    href="/gift-voucher"
                                    className="flex items-center justify-between p-5 border border-spa-petal rounded-sm hover:border-spa-rose hover:bg-spa-blush transition-all duration-300 group">

                                    <div>
                                        <h5 className="font-lustria text-lg text-spa-text group-hover:text-spa-rose transition-colors duration-300">
                                            {card.title}
                                        </h5>
                                        <p className="text-spa-muted text-sm mt-1">{card.description}</p>
                                    </div>
                                    <span className="text-spa-rose font-lustria text-xl font-bold ml-4 flex-shrink-0">
                                        {card.discount}
                                    </span>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Right: Image */}
                    <div className="relative">
                        <img
                            src="https://images.unsplash.com/photo-1716893917077-5b320c1ecfec"
                            alt="Beautifully wrapped spa gift card with rose petals and ribbon"
                            className="w-full h-[500px] object-cover rounded-sm shadow-spa-lg" />

                        <div className="absolute inset-0 bg-gradient-to-t from-spa-cherry/20 to-transparent rounded-sm" />
                    </div>
                </div>
            </div>
        </section>);

}