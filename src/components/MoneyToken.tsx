import type { CSSProperties } from 'react';
import type { Denomination } from '../domain/currency';
import { getDenominationVisual } from '../domain/denominations';

type TokenStyleProperties = CSSProperties & Record<string, string>;

export function MoneyToken({ denomination }: { denomination: Denomination }) {
  const visual = getDenominationVisual(denomination);
  const tokenStyle: TokenStyleProperties = {
    '--token-primary': visual.primaryColor,
    '--token-secondary': visual.secondaryColor,
    '--token-accent': visual.accentColor,
    '--token-text': visual.textColor,
  };

  if (visual.kind === 'bill') {
    return (
      <span className="money-token token-bill" style={tokenStyle} aria-hidden="true">
        {visual.label}
      </span>
    );
  }

  const ridges = Array.from({ length: 36 }, (_, index) => (
    <line
      className="coin-ridge"
      key={index}
      x1="32"
      x2="32"
      y1="2.5"
      y2="7.4"
      transform={`rotate(${index * 10} 32 32)`}
    />
  ));

  return (
    <svg
      aria-hidden="true"
      className={`money-token coin-svg ${visual.label.length > 3 ? 'coin-svg-tight' : ''}`}
      style={tokenStyle}
      viewBox="0 0 64 64"
    >
      <circle className="coin-shadow" cx="34" cy="35" r="28" />
      <circle className="coin-rim" cx="32" cy="32" r="29" />
      {ridges}
      <circle className="coin-face" cx="32" cy="32" r="23" />
      <circle className="coin-inner-ring" cx="32" cy="32" r="18" />
      <circle className="coin-value-plate" cx="32" cy="32" r="13.5" />
      <text
        className={`coin-text ${visual.label.length > 3 ? 'coin-text-tight' : ''}`}
        x="32"
        y="36"
        textAnchor="middle"
      >
        {visual.label}
      </text>
    </svg>
  );
}
