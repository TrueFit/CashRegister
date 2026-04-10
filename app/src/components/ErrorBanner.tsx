type ErrorBannerProps = {
  message: string
  onDismiss?: () => void
}

export function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <div className="error-banner">
      <span>{message}</span>
      {onDismiss ? (
        <button className="error-banner-dismiss" onClick={onDismiss}>
          &times;
        </button>
      ) : null}
    </div>
  )
}
