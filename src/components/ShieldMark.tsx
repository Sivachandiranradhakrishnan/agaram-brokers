export default function ShieldMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 96 104"
      fill="none"
      role="img"
      aria-label="Agaram Brokers shield logo"
    >
      <path
        d="M48 5C36.4 15.8 20.9 19.7 9.2 18.4v28.1c0 25.9 17.6 42.1 38.8 52.1 21.2-10 38.8-26.2 38.8-52.1V18.4C75.1 19.7 59.6 15.8 48 5Z"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinejoin="round"
      />
      <path
        d="M27 62 42.5 22 69 82"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 59.5c8.8 2.9 16.9 8.7 23.5 16.7C53 56.7 69.4 43 87 37.6"
        stroke="#c29a37"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
