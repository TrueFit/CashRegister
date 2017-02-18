require 'cash_register/change_calculator'
require 'cash_register/change_formatter'
require 'cash_register/transaction_processor'
require 'cash_register/version'

module CashRegister

  def self.run(input, output)
    processor = make_processor
    line_count = 1

    begin
      input.each_line do |line|
        result = processor.process(line)
        output.puts(result)

        line_count += 1
      end
    rescue ArgumentError => e
      raise ArgumentError, "#{e.message} at input line #{line_count}"
    end
  end

  private

  def self.make_processor
    calculator = ChangeCalculator.new(denominations)
    formatter = ChangeFormatter.new(pluralizations)

    TransactionProcessor.new(calculator, formatter)
  end

  # in a real app put these in a config file
  def self.denominations
    {
      dollar: 100,
      quarter: 25,
      dime: 10,
      nickel: 5,
      penny: 1
    }
  end

  def self.pluralizations
    {
      penny: 'pennies'
    }
  end
end
