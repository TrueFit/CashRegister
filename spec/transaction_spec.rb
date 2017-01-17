require "rspec"
require_relative "../lib/transaction.rb"
require_relative "../lib/change.rb"

describe Transaction do
  describe "#determine_change" do
    it "calculates change based on amount owed and amount paid" do
      transaction = Transaction.new(amount_owed: 2.12, amount_paid: 3.00)
      expect(transaction.change.to_f).to eq 0.88
    end
  end
end
