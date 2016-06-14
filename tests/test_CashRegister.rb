require "./lib/CashRegister.rb"
require "test-unit"

# Test class for CashRegister.rb
class TestCashRegister < Test::Unit::TestCase
    @@cr = CashRegister.new

    # Test invalid transaction filenames
    def test_calculate_change_from_file_nil_and_empty
      assert_raise(RuntimeError) { @@cr.calculate_change_from_file(nil) }
      assert_raise(RuntimeError) { @@cr.calculate_change_from_file('') }
      assert_raise(RuntimeError) { @@cr.calculate_change_from_file('./tests/12345nonexistent67890.csv') }
    end
      
    # Test processing a valid transaction file
    def test_calculate_change_from_file
      @@cr.calculate_change_from_file("./tests/datafile1.csv")

      begin
        lines = File.open("./tests/datafile1.out").readlines
        assert_equal(3, lines.size)
        assert_equal("2 quarters\n", lines[0])
        assert_equal("3 quarters,1 penny\n", lines[1])
        assert_equal("2 dollars,1 quarter,2 pennies\n", lines[2])
      rescue Exception => e
        raise e
      ensure
        File.unlink("./tests/datafile1.out")
      end
    end

    # Test processing a single transaction that returns a human-readable string
    def test_calculate_change_string
      assert_equal("2 quarters", @@cr.calculate_change_string(1.50, 2))
      assert_equal("3 quarters,1 penny", @@cr.calculate_change_string(1.24, 2))
      assert_equal("2 dollars,1 quarter,2 pennies", @@cr.calculate_change_string(0.73, 3.00))
    end

    # Test processing a single transaction with invalid parameters
    def test_calculate_change_hash_invalid_parameters
      assert_raise(RuntimeError) { @@cr.calculate_change_hash(nil, 2) }
      assert_raise(RuntimeError) { @@cr.calculate_change_hash(2, nil) }
      assert_raise(RuntimeError) { @@cr.calculate_change_hash('foo', 2.00) }
      assert_raise(RuntimeError) { @@cr.calculate_change_hash(1.50, 'foo') }
      assert_raise(RuntimeError) { @@cr.calculate_change_hash(1.50, 1.00) }
      assert_raise(RuntimeError) { @@cr.calculate_change_hash(-1, 2) }
      assert_raise(RuntimeError) { @@cr.calculate_change_hash(1, -2) }
    end

    # Test cases for processing a single transaction that returns a hash map
    def test_calculate_change_hash
      change_hash = @@cr.calculate_change_hash(1.50, 2)
      assert(change_hash.is_a?(Hash))
      assert_equal(0, change_hash[:dollar])
      assert_equal(2, change_hash[:quarter])
      assert_equal(0, change_hash[:dime])
      assert_equal(0, change_hash[:nickel])
      assert_equal(0, change_hash[:penny])

      change_hash = @@cr.calculate_change_hash(1.24, 2)
      assert(change_hash.is_a?(Hash))
      assert_equal(0, change_hash[:dollar])
      assert_equal(3, change_hash[:quarter])
      assert_equal(0, change_hash[:dime])
      assert_equal(0, change_hash[:nickel])
      assert_equal(1, change_hash[:penny])

      change_hash = @@cr.calculate_change_hash(3.40, 5)
      assert(change_hash.is_a?(Hash))
      assert_equal(1, change_hash[:dollar])
      assert_equal(2, change_hash[:quarter])
      assert_equal(1, change_hash[:dime])
      assert_equal(0, change_hash[:nickel])
      assert_equal(0, change_hash[:penny])
    end

    # Test cases for randomized change composition
    def test_calculate_change_hash_random
      assert_equal(66, get_total( @@cr.calculate_change_hash(0.34, 1.00) ))
      assert_equal(99, get_total( @@cr.calculate_change_hash(0.01, 1.00) ))
      assert_equal(966, get_total( @@cr.calculate_change_hash(0.34, 10.00) ))
    end

    private_class_method

    def get_total(change_hash)
      value_hash = CashRegister.get_denomination_value_hash
      total = 0
      change_hash.keys.each { |denom| total += change_hash[denom] * value_hash[denom] }
      return total
    end
end

