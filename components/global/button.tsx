const GlobalButton = ({ icon, text, onClick, className }: { icon: JSX.Element; text: string; onClick: () => void; className?: string }) => (
    <button
        className={`inline-flex items-center space-x-0.5 rounded px-1 text-sm font-medium transition duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-stone-700 ${className}`}
        onClick={onClick}
    >
        {icon}
        <span>{text}</span>
    </button>
);

export default GlobalButton;
