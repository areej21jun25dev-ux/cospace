export default function Logo({ size = 32, text = true, light = false }) {
  return (
    <span className="inline-flex items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
        <rect width="64" height="64" rx="16" fill={light ? '#ffffff' : '#146468'} />
        <path
          d="M42 20a15 15 0 1 0 0 24"
          fill="none"
          stroke={light ? '#146468' : '#ffffff'}
          strokeWidth="7"
          strokeLinecap="round"
        />
        <circle cx="44" cy="32" r="5" fill="#f65d37" />
      </svg>
      {text && (
        <span
          className={`font-display text-xl font-bold tracking-tight ${
            light ? 'text-white' : 'text-indigo-700'
          }`}
        >
          Co<span className="text-violet-500">Space</span>
        </span>
      )}
    </span>
  );
}