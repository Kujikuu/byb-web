export default function ApplicationLogo({ className, variant = 'default' }) {
    const logoSrc = variant === 'white' ? '/images/byb-white.png' : '/images/byb-logo.png';

    return (
        <img
            src={logoSrc}
            className={className}
            alt="Build Your Booth Logo"
        />
    );
}
