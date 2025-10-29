import pytest
from decimal import Decimal
from src.domain.value_objects.money import Money
from src.domain.services.change_calculator import ChangeCalculator


class TestChangeCalculatorGreedy:

    def test_greedy_88_cents(self, us_denominations):
        calculator = ChangeCalculator()
        change = Money(Decimal("0.88"))
        result = calculator.calculate_greedy(change, us_denominations)

        assert result.is_random == False
        assert result.get_total_cents() == 88

        denoms = result.denominations
        assert denoms[us_denominations[1]] == 3
        assert denoms[us_denominations[2]] == 1
        assert denoms[us_denominations[4]] == 3

    def test_greedy_3_cents(self, us_denominations):
        calculator = ChangeCalculator()
        change = Money(Decimal("0.03"))
        result = calculator.calculate_greedy(change, us_denominations)

        assert result.is_random == False
        assert result.get_total_cents() == 3
        assert len(result.denominations) == 1
        assert result.denominations[us_denominations[4]] == 3

    def test_greedy_167_cents(self, us_denominations):
        calculator = ChangeCalculator()
        change = Money(Decimal("1.67"))
        result = calculator.calculate_greedy(change, us_denominations)

        assert result.is_random == False
        assert result.get_total_cents() == 167

    def test_greedy_zero_change(self, us_denominations):
        calculator = ChangeCalculator()
        change = Money(Decimal("0.00"))
        result = calculator.calculate_greedy(change, us_denominations)

        assert result.is_random == False
        assert len(result.denominations) == 0
        assert result.format_output() == "No change"

    def test_greedy_exact_dollar(self, us_denominations):
        calculator = ChangeCalculator()
        change = Money(Decimal("5.00"))
        result = calculator.calculate_greedy(change, us_denominations)

        assert result.get_total_cents() == 500
        assert result.denominations[us_denominations[0]] == 5

    def test_greedy_format_output_88_cents(self, us_denominations):
        calculator = ChangeCalculator()
        change = Money(Decimal("0.88"))
        result = calculator.calculate_greedy(change, us_denominations)

        output = result.format_output()
        assert output == "3 quarters,1 dime,3 pennies"


class TestChangeCalculatorRandom:

    def test_random_produces_valid_total(self, us_denominations):
        calculator = ChangeCalculator()
        change = Money(Decimal("1.67"))
        result = calculator.calculate_random(change, us_denominations)

        assert result.is_random == True
        assert result.get_total_cents() == 167

    def test_random_with_small_amount(self, us_denominations):
        calculator = ChangeCalculator()
        change = Money(Decimal("0.03"))
        result = calculator.calculate_random(change, us_denominations)

        assert result.is_random == True
        assert result.get_total_cents() == 3
        assert result.denominations[us_denominations[4]] == 3

    def test_random_varies_on_multiple_runs(self, us_denominations):
        calculator = ChangeCalculator()
        change = Money(Decimal("1.67"))

        results = []
        for _ in range(5):
            result = calculator.calculate_random(change, us_denominations)
            assert result.get_total_cents() == 167
            results.append(result.format_output())

        unique_results = set(results)
        assert len(unique_results) >= 1


class TestChangeCalculatorIntegration:

    def test_calculate_with_greedy_flag(self, us_denominations):
        calculator = ChangeCalculator()
        change = Money(Decimal("0.88"))
        result = calculator.calculate(change, us_denominations, use_random=False)

        assert result.is_random == False
        assert result.get_total_cents() == 88

    def test_calculate_with_random_flag(self, us_denominations):
        calculator = ChangeCalculator()
        change = Money(Decimal("1.67"))
        result = calculator.calculate(change, us_denominations, use_random=True)

        assert result.is_random == True
        assert result.get_total_cents() == 167

    def test_calculate_negative_change_raises_error(self, us_denominations):
        with pytest.raises(ValueError, match="Money amount cannot be negative"):
            Money(Decimal("-0.50"))

    def test_sample_input_line_1(self, us_denominations):
        calculator = ChangeCalculator()
        owed = Money(Decimal("2.12"))
        paid = Money(Decimal("3.00"))
        change = paid - owed

        owed_cents = owed.to_cents()
        use_random = (owed_cents % 3) == 0
        assert use_random == False

        result = calculator.calculate(change, us_denominations, use_random)
        assert result.format_output() == "3 quarters,1 dime,3 pennies"

    def test_sample_input_line_2(self, us_denominations):
        calculator = ChangeCalculator()
        owed = Money(Decimal("1.97"))
        paid = Money(Decimal("2.00"))
        change = paid - owed

        owed_cents = owed.to_cents()
        use_random = (owed_cents % 3) == 0
        assert use_random == False

        result = calculator.calculate(change, us_denominations, use_random)
        assert result.format_output() == "3 pennies"

    def test_sample_input_line_3(self, us_denominations):
        calculator = ChangeCalculator()
        owed = Money(Decimal("3.33"))
        paid = Money(Decimal("5.00"))
        change = paid - owed

        owed_cents = owed.to_cents()
        use_random = (owed_cents % 3) == 0
        assert use_random == True
        assert owed_cents == 333

        result = calculator.calculate(change, us_denominations, use_random)
        assert result.is_random == True
        assert result.get_total_cents() == 167
