export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={className}>
      <span className="text-primary">Git</span>
      <span className="text-white">lytics</span>
    </span>
  );
}