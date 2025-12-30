import { motion } from 'framer-motion';

export default function ServiceCard({ icon: Icon, title, description, highlighted = false }) {
    return (
        <motion.div
            whileHover={{ y: -8 }}
            className={`p-10 rounded-2xl border ${highlighted
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-white border-slate-100 text-slate-900'
                }`}
        >
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-8 ${highlighted ? 'bg-white/20' : 'bg-blue-50'
                }`}>
                <Icon size={28} weight="bold" className={`${highlighted ? 'text-white' : 'text-blue-600'}`} />
            </div>
            <h3 className={`text-2xl font-bold mb-4 tracking-tight ${highlighted ? 'text-white' : 'text-slate-900'
                }`}>{title}</h3>
            <p className={`text-sm font-medium leading-relaxed ${highlighted ? 'text-white/80' : 'text-slate-500'
                }`}>
                {description}
            </p>
        </motion.div>
    );
}
