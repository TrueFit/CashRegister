module CashRegister
  class ChangeFormatter

    attr_reader :pluralizations

    def initialize(pluralizations)
      @pluralizations = pluralizations
    end

    def format(change)
      used_amounts = drop_unused(change)
      format_amounts(used_amounts).join(',')
    end

    private

    def drop_unused(change)
      change.reject { |_, amount| amount == 0 }
    end

    def format_amounts(change)
      change.map do |name, amount|
        name = pluralize(name) if amount > 1
        "%d %s" % [amount, name]
      end
    end

    def pluralize(name)
      pluralizations.fetch(name, "#{name}s")
    end
  end
end
