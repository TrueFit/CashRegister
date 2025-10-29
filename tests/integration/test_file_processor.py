import pytest
import tempfile
from pathlib import Path
from decimal import Decimal
from src.infrastructure.file_processor import FileProcessor
from src.domain.value_objects.money import Money


class TestFileProcessor:

    def test_parse_valid_line(self):
        line = "2.12,3.00"
        owed, paid = FileProcessor.parse_line(line)

        assert owed.amount == Decimal("2.12")
        assert paid.amount == Decimal("3.00")

    def test_parse_line_with_spaces(self):
        line = " 2.12 , 3.00 "
        owed, paid = FileProcessor.parse_line(line)

        assert owed.amount == Decimal("2.12")
        assert paid.amount == Decimal("3.00")

    def test_parse_empty_line_raises_error(self):
        with pytest.raises(ValueError, match="Empty line"):
            FileProcessor.parse_line("")

    def test_parse_invalid_format_raises_error(self):
        with pytest.raises(ValueError, match="Invalid format"):
            FileProcessor.parse_line("2.12")

    def test_parse_invalid_amounts_raises_error(self):
        with pytest.raises(ValueError, match="Invalid amounts"):
            FileProcessor.parse_line("abc,def")

    def test_parse_paid_less_than_owed_raises_error(self):
        with pytest.raises(ValueError, match="Paid amount.*is less than owed"):
            FileProcessor.parse_line("3.00,2.00")

    def test_read_input_file(self):
        with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.txt') as f:
            f.write("2.12,3.00\n")
            f.write("1.97,2.00\n")
            f.write("3.33,5.00\n")
            temp_path = f.name

        try:
            transactions = FileProcessor.read_input_file(temp_path)

            assert len(transactions) == 3
            assert transactions[0][0].amount == Decimal("2.12")
            assert transactions[0][1].amount == Decimal("3.00")
            assert transactions[1][0].amount == Decimal("1.97")
            assert transactions[1][1].amount == Decimal("2.00")
            assert transactions[2][0].amount == Decimal("3.33")
            assert transactions[2][1].amount == Decimal("5.00")
        finally:
            Path(temp_path).unlink()

    def test_read_input_file_with_empty_lines(self):
        with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.txt') as f:
            f.write("2.12,3.00\n")
            f.write("\n")
            f.write("1.97,2.00\n")
            temp_path = f.name

        try:
            transactions = FileProcessor.read_input_file(temp_path)
            assert len(transactions) == 2
        finally:
            Path(temp_path).unlink()

    def test_read_nonexistent_file_raises_error(self):
        with pytest.raises(FileNotFoundError):
            FileProcessor.read_input_file("/nonexistent/path.txt")

    def test_write_output_file(self):
        with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.txt') as f:
            temp_path = f.name

        try:
            results = [
                "3 quarters,1 dime,3 pennies",
                "3 pennies",
                "1 dollar,1 quarter,6 nickels,12 pennies"
            ]

            FileProcessor.write_output_file(temp_path, results)

            with open(temp_path, 'r') as f:
                lines = f.readlines()

            assert len(lines) == 3
            assert lines[0].strip() == "3 quarters,1 dime,3 pennies"
            assert lines[1].strip() == "3 pennies"
            assert lines[2].strip() == "1 dollar,1 quarter,6 nickels,12 pennies"
        finally:
            Path(temp_path).unlink()
