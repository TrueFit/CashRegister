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
      change = Change.new(amount_owed: 8.00, amount_paid: 10.00)
      expect(change.denominations).to eql(dollar: 2)
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
      change = Change.new(amount_owed: 2.95, amount_paid: 3.00)
      expect(change.denominations).to eql(nickel: 1)
    end

    it "calculates pennies" do
      change = Change.new(amount_owed: 1.99, amount_paid: 2.00)
      expect(change.denominations).to eql(penny: 1)
    end

    it "calculates nickels and pennies" do
      change = Change.new(amount_owed: 1.93, amount_paid: 2.00)
      expect(change.denominations).to eql(
        nickel: 1,
        penny: 2
      )
    end

    it "calculates dollars, quarters and nickels" do
      change = Change.new(amount_owed: 1.70, amount_paid: 3.00)
      expect(change.denominations).to eql(
        dollar: 1,
        quarter: 1,
        nickel: 1
      )
    end

    context "when owed amount is divisible by 3" do
      before(:each) do
        srand(82636)
      end

      it "returns a random amount of denominations for 3.33 paid with 5.00" do
        change = Change.new(amount_owed: 3.33, amount_paid: 5.00)
        expect(change.sum_denominations).to eq 1.67
        expect(change.denominations).to eql(
          dollar: 1,
          quarter: 1,
          dime: 2,
          nickel: 4,
          penny: 2
        )
      end

      it "returns a random amount of denominations for 6.36 paid with 10.00" do
        change = Change.new(amount_owed: 6.36, amount_paid: 10.00)
        expect(change.sum_denominations).to eq 3.64
        expect(change.denominations).to eql(
          dollar: 3,
          quarter: 1,
          dime: 2,
          nickel: 1,
          penny: 14
        )
      end

      it "returns a random amount of denominations for 0.03 paid with 5.00" do
        change = Change.new(amount_owed: 0.03, amount_paid: 5.00)
        expect(change.sum_denominations).to eq 4.97
        expect(change.denominations).to eql(
          dollar: 2,
          quarter: 5,
          dime: 10,
          nickel: 5,
          penny: 47
        )
      end
    end
  end

  describe "#to_s" do
    it "displays change in a human-readable format" do
      change = Change.new(amount_owed: 2.12, amount_paid: 3.00)
      expect(change.to_s).to eql "3 quarters,1 dime,3 pennies"
    end
  end
end
