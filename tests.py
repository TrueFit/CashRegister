import unittest
import tempfile
import os
from change_calculator import calculate_change, process_file
from denominations import USD_DENOMINATIONS, EUR_DENOMINATIONS, MXN_DENOMINATIONS

class TestChangeCalculator(unittest.TestCase):
    
    def test_basic_change_calculation(self):
        """Test standard minimum change calculation"""
        result = calculate_change(2.12, 3.00, USD_DENOMINATIONS, random_divisor=None)
        # Should be 88 cents: 3 quarters (75), 1 dime (10), 3 pennies (3) = 88
        # Keys should be singular as defined in denominations
        expected_parts = {'quarter': 3, 'dime': 1, 'penny': 3}
        self.assertEqual(result, expected_parts)
        
    def test_exact_change(self):
        """Test when no change is needed"""
        result = calculate_change(5.00, 5.00, USD_DENOMINATIONS, random_divisor=None)
        self.assertEqual(result, {})
        
    def test_divisible_by_3_random(self):
        """Test random change when owed amount is divisible by 3"""
        owed = 3.33  # 333 cents, divisible by 3
        paid = 5.00
        change_amount = paid - owed  # 1.67 = 167 cents
        
        # Test multiple times to ensure randomness and correctness
        for _ in range(10):
            result = calculate_change(owed, paid, USD_DENOMINATIONS, random_divisor=3)
            # Verify the total is correct
            total_cents = sum(count * USD_DENOMINATIONS[coin] for coin, count in result.items())
            self.assertEqual(total_cents, 167)
            # Verify we have at least one denomination (unless change is 0)
            if change_amount > 0:
                self.assertTrue(any(count > 0 for count in result.values()))
                
    def test_pluralization(self):
        """Test that pluralization works correctly"""
        from change_calculator import format_change_output
        single = {'dollar': 1, 'quarter': 1, 'dime': 1, 'nickel': 1, 'penny': 1}
        multiple = {'dollar': 2, 'quarter': 3, 'dime': 0, 'nickel': 5, 'penny': 2}
        
        single_output = format_change_output(single)
        multiple_output = format_change_output(multiple)
        
        self.assertIn("1 dollar", single_output)
        self.assertIn("1 quarter", single_output)
        self.assertIn("1 dime", single_output)
        self.assertIn("1 nickel", single_output)
        self.assertIn("1 penny", single_output)
        
        self.assertIn("2 dollars", multiple_output)
        self.assertIn("3 quarters", multiple_output)
        self.assertIn("5 nickels", multiple_output)
        self.assertIn("2 pennies", multiple_output)
        self.assertNotIn("0 dimes", multiple_output)
        
    def test_file_processing(self):
        """Test end-to-end file processing"""
        input_content = "2.12,3.00\n1.97,2.00\n3.33,5.00\n"
        expected_outputs = [
            "3 quarters,1 dime,3 pennies",
            "3 pennies"
            # Third line is random, so we'll just verify it's not empty and correct
        ]
        
        with tempfile.NamedTemporaryFile(mode='w', delete=False) as input_file:
            input_file.write(input_content)
            input_file_path = input_file.name
            
        with tempfile.NamedTemporaryFile(mode='w', delete=False) as output_file:
            output_file_path = output_file.name
            
        try:
            process_file(input_file_path, output_file_path, USD_DENOMINATIONS, random_divisor=3)
            
            with open(output_file_path, 'r') as f:
                outputs = [line.strip() for line in f.readlines()]
                
            # Check first two lines match expected
            self.assertEqual(outputs[0], expected_outputs[0])
            self.assertEqual(outputs[1], expected_outputs[1])
            
            # Check third line is valid (not empty and sums to 167 cents)
            third_line_result = self._parse_output_to_dict(outputs[2])
            total = sum(count * USD_DENOMINATIONS[coin] for coin, count in third_line_result.items())
            self.assertEqual(total, 167)
            
        finally:
            os.unlink(input_file_path)
            os.unlink(output_file_path)
            
    def _parse_output_to_dict(self, output_str):
        """Helper to parse output string back to dictionary for validation"""
        if not output_str:
            return {}
        parts = output_str.split(',')
        result = {}
        for part in parts:
            part = part.strip()
            words = part.split()
            if len(words) >= 2:
                count = int(words[0])
                coin_name = words[1].rstrip('s')  # Remove plural 's'
                if coin_name == 'pennie':  # Handle penny -> pennies
                    coin_name = 'penny'
                result[coin_name] = count
        return result
        
    def test_different_currencies(self):
        """Test with different currency denominations"""
        # Euro example: 1.50 owed, 2.00 paid = 50 cents change
        result = calculate_change(1.50, 2.00, EUR_DENOMINATIONS, random_divisor=None)
        # Should use 1 x 50 cent coin
        self.assertEqual(result.get('50_cent', 0), 1)
        
        # Mexican Peso example
        result = calculate_change(10.20, 20.00, MXN_DENOMINATIONS, random_divisor=None)
        # 980 cents change - should use appropriate denominations
        total = sum(count * MXN_DENOMINATIONS[coin] for coin, count in result.items())
        self.assertEqual(total, 980)

if __name__ == '__main__':
    unittest.main()