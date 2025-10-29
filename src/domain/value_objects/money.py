"""Money value object representing monetary amounts."""
from dataclasses import dataclass
from decimal import Decimal, ROUND_HALF_UP


@dataclass(frozen=True)
class Money:

    amount: Decimal

    def __post_init__(self):
        if not isinstance(self.amount, Decimal):
            object.__setattr__(self, 'amount', Decimal(str(self.amount)))

        object.__setattr__(
            self,
            'amount',
            self.amount.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
        )

        if self.amount < 0:
            raise ValueError("Money amount cannot be negative")

    def __sub__(self, other: 'Money') -> 'Money':
        if not isinstance(other, Money):
            raise TypeError("Can only subtract Money from Money")
        return Money(self.amount - other.amount)

    def __add__(self, other: 'Money') -> 'Money':
        if not isinstance(other, Money):
            raise TypeError("Can only add Money to Money")
        return Money(self.amount + other.amount)

    def __eq__(self, other) -> bool:
        if not isinstance(other, Money):
            return False
        return self.amount == other.amount

    def __lt__(self, other: 'Money') -> bool:
        if not isinstance(other, Money):
            raise TypeError("Can only compare Money with Money")
        return self.amount < other.amount

    def __le__(self, other: 'Money') -> bool:
        if not isinstance(other, Money):
            raise TypeError("Can only compare Money with Money")
        return self.amount <= other.amount

    def to_cents(self) -> int:
        return int(self.amount * 100)

    @classmethod
    def from_cents(cls, cents: int) -> 'Money':
        return cls(Decimal(cents) / 100)