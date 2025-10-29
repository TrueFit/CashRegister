import pytest
from decimal import Decimal
from src.domain.value_objects.money import Money


class TestMoney:

    def test_create_money_from_decimal(self):
        money = Money(Decimal("10.50"))
        assert money.amount == Decimal("10.50")

    def test_create_money_from_float(self):
        money = Money(10.50)
        assert money.amount == Decimal("10.50")

    def test_money_rounds_to_two_decimals(self):
        money = Money(Decimal("10.555"))
        assert money.amount == Decimal("10.56")

    def test_money_cannot_be_negative(self):
        with pytest.raises(ValueError, match="Money amount cannot be negative"):
            Money(Decimal("-10.00"))

    def test_money_subtraction(self):
        m1 = Money(Decimal("10.00"))
        m2 = Money(Decimal("3.50"))
        result = m1 - m2
        assert result.amount == Decimal("6.50")

    def test_money_addition(self):
        m1 = Money(Decimal("10.00"))
        m2 = Money(Decimal("3.50"))
        result = m1 + m2
        assert result.amount == Decimal("13.50")

    def test_money_equality(self):
        m1 = Money(Decimal("10.00"))
        m2 = Money(Decimal("10.00"))
        assert m1 == m2

    def test_money_less_than(self):
        m1 = Money(Decimal("5.00"))
        m2 = Money(Decimal("10.00"))
        assert m1 < m2

    def test_money_less_than_or_equal(self):
        m1 = Money(Decimal("10.00"))
        m2 = Money(Decimal("10.00"))
        assert m1 <= m2

    def test_to_cents(self):
        money = Money(Decimal("10.50"))
        assert money.to_cents() == 1050

    def test_from_cents(self):
        money = Money.from_cents(1050)
        assert money.amount == Decimal("10.50")

    def test_cannot_subtract_non_money(self):
        money = Money(Decimal("10.00"))
        with pytest.raises(TypeError, match="Can only subtract Money from Money"):
            money - 5

    def test_cannot_add_non_money(self):
        money = Money(Decimal("10.00"))
        with pytest.raises(TypeError, match="Can only add Money to Money"):
            money + 5

    def test_cannot_compare_with_non_money(self):
        money = Money(Decimal("10.00"))
        with pytest.raises(TypeError, match="Can only compare Money with Money"):
            money < 5
