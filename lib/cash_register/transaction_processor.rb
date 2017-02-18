module CashRegister
  class TransactionProcessor

    # the predicate that selects random change generation seems arbitrary
    # let the caller pass a new predicate here to alter behavior
    def initialize(calculator, formatter, &predicate)
      @calculator = calculator
      @formatter = formatter
      @predicate = predicate || default_predicate
    end

    def process(line)
      owed, paid = parse(line)
      change = calculate_change(owed, paid)

      formatter.format(change)
    end

    private

    attr_reader :calculator, :formatter, :predicate

    def default_predicate
      lambda { |owed, _| owed % 3 != 0 }
    end

    # don't use floats for moneys
    def parse(line)
      line.split(',').map { |v| (v.to_f * 100).to_i }
    end

    def calculate_change(owed, paid)
      validate_values(owed, paid)

      if predicate.call(owed, paid)
        calculator.make_exact_change(owed, paid)
      else
        calculator.make_random_change(owed, paid)
      end
    end

    def validate_values(owed, paid)
      if owed.nil? || paid.nil?
        raise ArgumentError, "missing value(s): #{owed},#{paid}"
      elsif owed == 0 || paid == 0
        raise ArgumentError, "bad value(s): #{owed},#{paid}"
      end
    end
  end
end
