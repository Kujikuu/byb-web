import { useCountUp } from '@/hooks/useCountUp';

export default function StatCard({ number, label, icon: Icon }) {
    const [animatedNumber, numberRef] = useCountUp(number);

    return (
        <div className="text-center space-y-4">
            <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                    <Icon size={32} weight="bold" className="text-blue-600" />
                </div>
            </div>
            <div className="space-y-2">
                <div 
                    ref={numberRef}
                    className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tighter"
                >
                    {animatedNumber}
                </div>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">
                    {label}
                </p>
            </div>
        </div>
    );
}
