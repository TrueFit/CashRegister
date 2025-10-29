from typing import List, Tuple
from pathlib import Path
from decimal import Decimal
from src.domain.value_objects.money import Money


class FileProcessor:

    @staticmethod
    def parse_line(line: str) -> Tuple[Money, Money]:
        line = line.strip()
        if not line:
            raise ValueError("Empty line")

        parts = line.split(",")
        if len(parts) != 2:
            raise ValueError(f"Invalid format. Expected: 'owed,paid'. Got: '{line}'")

        try:
            owed = Money(Decimal(parts[0].strip()))
            paid = Money(Decimal(parts[1].strip()))
        except Exception as e:
            raise ValueError(f"Invalid amounts in line: '{line}'. Error: {e}")

        if paid < owed:
            raise ValueError(f"Paid amount ({paid.amount}) is less than owed ({owed.amount})")

        return owed, paid

    @staticmethod
    def read_input_file(file_path: str) -> List[Tuple[Money, Money]]:
        path = Path(file_path)
        if not path.exists():
            raise FileNotFoundError(f"Input file not found: {file_path}")

        transactions = []
        with open(path, "r") as f:
            for line_num, line in enumerate(f, start=1):
                line = line.strip()
                if not line:
                    continue

                try:
                    owed, paid = FileProcessor.parse_line(line)
                    transactions.append((owed, paid))
                except ValueError as e:
                    raise ValueError(f"Error on line {line_num}: {e}")

        return transactions

    @staticmethod
    def write_output_file(file_path: str, results: List[str]) -> None:
        path = Path(file_path)
        path.parent.mkdir(parents=True, exist_ok=True)

        with open(path, "w") as f:
            for result in results:
                f.write(result + "\n")
