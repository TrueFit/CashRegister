require 'spec_helper'

describe CashRegister::ChangeCalculator do
  let(:denominations) do
    {
      dollar: 100,
      quarter: 25,
      dime: 10,
      nickel: 5,
      penny: 1
    }
  end
  let(:calculator) do
    described_class.new(denominations)
  end

  describe 'making exact change' do
    it 'should return the correct denominations' do
      result = calculator.make_exact_change(248, 500)

      expect(result).to eq({
        dollar: 2,
        quarter: 2,
        dime: 0,
        nickel: 0,
        penny: 2
      })
    end
  end

  describe 'making random change' do
    it 'should add up to the correct total' do
      result = calculator.make_random_change(248, 500)
      total = result.reduce(0) { |acc, (k, v)| acc + denominations[k] * v }

      expect(total).to eq(252)
    end
  end
end
