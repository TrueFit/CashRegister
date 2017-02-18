require 'spec_helper'

describe CashRegister do

  describe 'processing an input stream' do
    context 'when the input data is valid' do
      let(:input) do
        StringIO.new(<<-DATA)
2.12,3.00
1.97,2.00
        DATA
      end
      let(:output) { double() }

      it 'should output the correct denominations' do
        expect(output).to receive(:puts).with('3 quarters,1 dime,3 pennies')
        expect(output).to receive(:puts).with('3 pennies')

        CashRegister.run(input, output)
      end
    end

    context 'when the input data is missing a value' do
      let(:input) do
        StringIO.new(<<-DATA)
3.33,
1.97,2.00
        DATA
      end
      let(:output) { double() }

      before(:each) do
        allow(output).to receive(:puts)
      end

      it 'should raise an error' do
        expect { CashRegister.run(input, output) }.to raise_error(ArgumentError)
      end
    end

    context 'when the input data has a bad value' do
      let(:input) do
        StringIO.new(<<-DATA)
foo,bar
1.97,2.00
        DATA
      end
      let(:output) { double() }

      before(:each) do
        allow(output).to receive(:puts)
      end

      it 'should raise an error' do
        expect { CashRegister.run(input, output) }.to raise_error(ArgumentError)
      end
    end
  end
end
