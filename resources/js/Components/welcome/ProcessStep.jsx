export default function ProcessStep({ number, title, description }) {
    return (
        <div className="relative z-10">
            <div className="text-8xl font-black text-slate-100 mb-[-3rem] select-none">
                {number}
            </div>
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h3>
                <p className="text-slate-500 text-xs font-medium leading-relaxed max-w-[16rem] mx-auto">
                    {description}
                </p>
            </div>
        </div>
    );
}
