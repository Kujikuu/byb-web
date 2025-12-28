import { motion } from 'framer-motion';
import { usePage } from '@inertiajs/react';

const springConfig = {
    type: "spring",
    stiffness: 400,
    damping: 80,
    mass: 1,
};

export default function PageTransition({ children }) {
    const { key } = usePage();

    return (
        <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springConfig}
        >
            {children}
        </motion.div>
    );
}
