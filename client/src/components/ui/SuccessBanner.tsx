interface SuccessBannerProps {
  message: string;
}

export function SuccessBanner({ message }: SuccessBannerProps) {
  return (
    <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
      {message}
    </div>
  );
}
