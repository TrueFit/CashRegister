require "rspec"
require_relative "../lib/change.rb"

describe Change do
  describe "#cents" do
    it "calculates the amount to return to the customer in cents" do
      change = Change.new(amount_owed: 2.12, amount_paid: 3.00)
      expect(change.cents).to eql 88
    end
  end

  describe "#denominations" do
    it "calculates dollars" do
      change = Change.new(amount_owed: 9.00, amount_paid: 10.00)
      expect(change.denominations).to eql(dollar: 1)
    end

    it "calculates quarters" do
      change = Change.new(amount_owed: 1.75, amount_paid: 2.00)
      expect(change.denominations).to eql(quarter: 1)
    end

    it "calculates dimes" do
      change = Change.new(amount_owed: 1.90, amount_paid: 2.00)
      expect(change.denominations).to eql(dime: 1)
    end

    it "calculates nickels" do
      change = Change.new(amount_owed: 1.95, amount_paid: 2.00)
      expect(change.denominations).to eql(nickel: 1)
    end

    it "calculates pennies" do
      change = Change.new(amount_owed: 1.97, amount_paid: 2.00)
      expect(change.denominations).to eql(penny: 3)
    end

    it "calculates nickels and pennies" do
      change = Change.new(amount_owed: 1.93, amount_paid: 2.00)
      expect(change.denominations).to eql(
        nickel: 1,
        penny: 2
      )
    end
  end

  describe "#to_s" do
    it "displays change in a human-readable format" do
      change = Change.new(amount_owed: 2.12, amount_paid: 3.00)
      expect(change.to_s).to eql "3 quarters,1 dime,3 pennies"
    end
  end
end
