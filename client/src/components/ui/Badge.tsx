interface BadgeProps {
  children: React.ReactNode;
  color: string;
}

export function Badge({ children, color }: BadgeProps) {
  return (
    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${color}`}>
      {children}
    </span>
  );
}
