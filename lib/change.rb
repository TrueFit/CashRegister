require "pry"

class Change
  attr_reader :amount_owed, :amount_paid

  def initialize(amount_owed:, amount_paid:)
    @amount_owed = amount_owed
    @amount_paid = amount_paid
  end

  def cents
    convert_to_cents(amount_paid) - convert_to_cents(amount_owed)
  end

  def denominations
    minimum_change = {}
    cents_remaining = cents
    available_denominations.each do |d|
      count = cents_remaining / d[:value]
      next if count == 0
      minimum_change[d[:name]] = count
      cents_remaining = cents_remaining % (d[:value] * count)
    end
    minimum_change
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
