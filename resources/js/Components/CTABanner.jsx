export default function CTABanner({ title, description, buttonText, backgroundImage, onButtonClick }) {
    return (
        <section className="relative py-24 lg:py-32 overflow-hidden group">
            <div className="absolute inset-0 z-0">
                <img 
                    src={backgroundImage} 
                    className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000" 
                    alt="CTA Background" 
                />
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" />
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-3xl space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tighter">
                            {title}
                        </h2>
                        <p className="text-lg sm:text-xl text-white/90 font-medium max-w-xl">
                            {description}
                        </p>
                    </div>
                    <button 
                        onClick={onButtonClick}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-10 py-5 rounded-md text-sm transition-all uppercase tracking-wide"
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </section>
    );
}
