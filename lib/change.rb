class Change
  attr_reader :amount_owed, :amount_paid

  def initialize(amount_owed:, amount_paid:)
    @amount_owed = amount_owed
    @amount_paid = amount_paid
  end

  ##
  # Generates a hash of denominations and the number of each
  # to add up to the total owed to the customer.
  #
  # = Example:
  #
  #    {
  #      dollar: 1,
  #      quarter: 1,
  #      dime: 2,
  #      nickel: 4,
  #      penny: 2
  #    }

  def denominations
    @denominations ||= calculate_denominations(cents)
  end

  def cents
    convert_to_cents(amount_paid) - convert_to_cents(amount_owed)
  end

  def sum_denominations
    total_cents = denominations.reduce(0) do |sum, denom_count|
      name = denom_count[0]
      count = denom_count[1]
      denom = available_denominations.find { |ad| ad[:name] == name }
      sum + count * denom[:value]
    end
    total_cents / 100.0
  end

  def to_s
    denominations.map { |d|
      pluralize(d[1], d[0].to_s)
    }.join(",")
  end

  def to_f
    cents / 100.0
  end

  private

  def calculate_denominations(cents_remaining)
    available_denominations.each_with_object({}) do |denom, change_amounts|
      count = cents_remaining / denom[:value]
      count = rand(count + 1) if random_change? && denom[:name] != :penny
      change_amounts[denom[:name]] = count if count > 0
      cents_remaining -= denom[:value] * count
    end
  end

  def convert_to_cents(amount)
    (amount * 100).to_i
  end

  def pluralize(number, item)
    if number == 1
      "1 #{item}"
    else
      "#{number} #{irregular_plurals.fetch(item.to_sym, item + 's')}"
    end
  end

  def irregular_plurals
    {
      penny: "pennies"
    }
  end

  def random_change?
    convert_to_cents(amount_owed) % 3 == 0
  end

  # rubocop:disable Metrics/MethodLength
  def available_denominations
    [
      {
        name: :dollar,
        value: 100
      },
      {
        name: :quarter,
        value: 25
      },
      {
        name: :dime,
        value: 10
      },
      {
        name: :nickel,
        value: 5
      },
      {
        name: :penny,
        value: 1
      }
    ]
  end

  def random_amount?
    (convert_to_cents(amount_owed) % 3 == 0)
  end
end
