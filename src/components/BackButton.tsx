export function BackButton({ onClick, className = '' }: { onClick: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 p-3 bg-white rounded-xl shadow-md active:scale-95 transition-all ${className}`}
      aria-label="Atrás"
    >
      <span className="text-2xl">⬅️</span>
      <span className="text-sm font-bold text-gray-600">Atrás</span>
    </button>
  );
}
