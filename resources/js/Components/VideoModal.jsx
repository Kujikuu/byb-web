import { X } from 'phosphor-react';
import {
    Dialog,
    DialogPanel,
    Transition,
    TransitionChild,
} from '@headlessui/react';

export default function VideoModal({ isOpen, onClose, videoUrl, videoType = 'youtube' }) {
    const getEmbedUrl = () => {
        if (!videoUrl) return '';

        if (videoType === 'youtube') {
            // Extract video ID from various YouTube URL formats
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = videoUrl.match(regExp);
            const videoId = (match && match[2].length === 11) ? match[2] : null;
            return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : videoUrl;
        } else if (videoType === 'vimeo') {
            // Extract video ID from Vimeo URL
            const regExp = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/;
            const match = videoUrl.match(regExp);
            const videoId = match ? match[1] : null;
            return videoId ? `https://player.vimeo.com/video/${videoId}?autoplay=1&controls=0&muted=0` : videoUrl;
        } else {
            // Direct video URL
            return videoUrl;
        }
    };

    const embedUrl = getEmbedUrl();

    return (
        <Transition show={isOpen} leave="duration-200">
            <Dialog
                as="div"
                className="fixed inset-0 z-50 flex items-center justify-center"
                onClose={onClose}
            >
                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
                </TransitionChild>

                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <DialogPanel className="relative z-10 w-full max-w-5xl mx-4">
                        <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
                            <button
                                onClick={onClose}
                                className="absolute top-4 end-4 z-20 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center transition-colors"
                                aria-label="Close video"
                            >
                                <X size={24} weight="bold" className="text-white" />
                            </button>
                            
                            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                                {videoType === 'direct' ? (
                                    <video
                                        src={embedUrl}
                                        controls
                                        autoPlay
                                        className="absolute top-0 left-0 w-full h-full"
                                    />
                                ) : (
                                    <iframe
                                        src={embedUrl}
                                        className="absolute top-0 left-0 w-full h-full"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        title="Video player"
                                    />
                                )}
                            </div>
                        </div>
                    </DialogPanel>
                </TransitionChild>
            </Dialog>
        </Transition>
    );
}
