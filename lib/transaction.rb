require "change"

class Transaction
  attr_reader :change

  def initialize(amount_owed:, amount_paid:)
    @change = Change.new(amount_owed: amount_owed, amount_paid: amount_paid)
  end
end
