export default function ApplicationLogo({ className = '', ...props }) {
    return (
        <img
            src="/images/logo.png"
            alt="Logo SIDADU"
            className={`object-contain ${className}`}
            {...props}
        />
    );
}
