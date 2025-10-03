"""
Main entry point for the Creative Cash Draw Solutions change calculator.
"""
import sys
import os
from change_calculator import process_file
from denominations import get_denominations

def main():
    """Main function to process command line arguments and run the change calculator"""
    if len(sys.argv) < 3:
        print("Usage: python main.py <input_file> <output_file> [currency_code] [random_divisor]")
        print("Example: python main.py input.txt output.txt USD 3")
        sys.exit(1)
        
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    
    # Default currency is USD
    currency_code = sys.argv[3] if len(sys.argv) > 3 else 'USD'
    
    # Default random divisor is 3 (as per requirements)
    random_divisor = int(sys.argv[4]) if len(sys.argv) > 4 else 3
    
    # Validate input file exists
    if not os.path.exists(input_file):
        print(f"Error: Input file '{input_file}' not found.")
        sys.exit(1)
        
    # Get denominations for specified currency
    denominations = get_denominations(currency_code)
    
    # Process the file
    try:
        process_file(input_file, output_file, denominations, random_divisor)
        print(f"Successfully processed '{input_file}' and wrote results to '{output_file}'")
    except Exception as e:
        print(f"Error processing file: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()