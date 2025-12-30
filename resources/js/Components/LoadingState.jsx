import React from 'react';
import { CircleNotch } from 'phosphor-react';

export default function LoadingState({ message, size = 'md' }) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };

    return (
        <div className="flex flex-col items-center justify-center py-12">
            <CircleNotch
                className={`${sizeClasses[size]} text-blue-600 animate-spin`}
                weight="bold"
            />
            {message && (
                <p className="mt-4 text-gray-600 text-sm">{message}</p>
            )}
        </div>
    );
}
