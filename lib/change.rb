class Change
  attr_reader :amount_owed, :amount_paid

  def initialize(amount_owed:, amount_paid:)
    @amount_owed = amount_owed
    @amount_paid = amount_paid
  end

  def cents
    convert_to_cents(amount_paid) - convert_to_cents(amount_owed)
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
    random = (convert_to_cents(amount_owed) % 3 == 0)
    cents_remaining = cents
    available_denominations.inject({}) do |denom, v|
      max_count = cents_remaining / v[:value]
      count = random ? rand(max_count + 1) : max_count
      if count > 0
        denom[v[:name]] = count
        cents_remaining = cents_remaining - (v[:value] * count)
      end
      if v[:name] == :penny && cents_remaining > 0
        denom[:penny] = denom.fetch(:penny, 0) + cents_remaining
      end
      denom
    end
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
end
