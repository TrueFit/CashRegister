module CashRegister
  class ChangeCalculator

    attr_reader :denominations

    def initialize(denominations)
      @denominations = denominations
    end

    def make_exact_change(owed, paid)
      make_change(owed, paid) do |change_due, amount|
        change_due / amount
      end
    end

    def make_random_change(owed, paid)
      make_change(owed, paid) do |change_due, amount|
        if amount > 1
          rand((change_due / amount) + 1)
        else
          change_due
        end
      end
    end

    private

    def make_change(owed, paid)
      change_due = paid - owed

      denominations.each_with_object({}) do |(name, amount), change|
        if change_due >= amount
          denom_num = yield change_due, amount

          change_due -= denom_num * amount
          change[name] = denom_num
        else
          change[name] = 0
        end
      end
    end
  end
end
