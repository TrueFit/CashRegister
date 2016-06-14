# A class for calculating change denominations.
#
# All methods will use the most efficient composition of denominations, except
# when the change owed is divisible by 3.  In which case, a randomized
# composition is computed.
class CashRegister
  @@denomination_order = [:dollar, :quarter, :dime, :nickel, :penny]

  @@denomination_value = {
    :dollar  => 100, 
    :quarter => 25, 
    :dime    => 10, 
    :nickel  => 5, 
    :penny   => 1
  }

  # Returns an array of labels representing the standard denomination
  # calculation order.
  def self.get_denomination_order_array
    return @@denomination_order
  end

  # Returns a hash of label/value pairs representing the value in cents of each
  # denomination.
  def self.get_denomination_value_hash 
    return @@denomination_value 
  end

  # Calculates change denominations in batch from csv file.
  # Generates an output file of the same name with the extension '.out'.
  #
  # ==== Attributes
  #
  # * +filename+ - The file to be processed.
  #
  # ==== Example input/output files
  #
  #   example.csv
  #   -------------
  #   1.50,2
  #   1.24,2    
  #   0.73,3.00
  #   -------------
  #
  #   example.out
  #   -------------
  #   2 quarters
  #   3 quarters,1 penny
  #   2 qollars,1 quarter,2 pennies
  #   -------------
  def calculate_change_from_file(filename)
    raise "Must supply a filename" if (filename.nil? || filename.empty?)
    raise "File #{filename} does not exist" unless File.exist?(filename)

    outfile = File.open("#{filename.sub(/\.\w+$/, '.out')}", 'w')

    File.open(filename).readlines.each { |line|
      begin
        (owed, paid) = line.split(/,/)
        # Cast to floats to weed out extra spacing and identify any invalid strings
        owed = Float(owed)
        paid = Float(paid)
      rescue
        warn "Malformed line found in #{filename}: #{line}"
        next
      end

      outfile.puts(calculate_change_string(owed, paid))
    }
    outfile.close
  end

  # Calculates change denominations for given owed and paid amounts.  Returns a
  # human-readable string describing the change denomination.
  #
  # ==== Attributes
  #
  # * +owed+ - The amount owed in dollars and cents
  # * +paid+ - The amount paid by the customer in dollars and cents
  def calculate_change_string(owed, paid)
    change_hash = calculate_change_hash(owed, paid)

    messages = []
    @@denomination_order.each { |denom|
      quantity = change_hash[denom]
      next if (quantity.nil? || quantity <= 0)

      message = "#{quantity} #{denom}"
      if quantity > 1
        # Pluralize nouns
        message = (denom == :penny) ? message.sub(/y$/, 'ies') : message + 's'
      end

      messages.push(message)
    }

    return messages.join(",")
  end

  # Calculates change denominations for given owed and paid amounts.  Returns a
  # hash map containing the denomination breakdown, more suitable for
  # consumption by other code.
  #
  # ==== Attributes
  #
  # * +owed+ - The amount owed in dollars and cents
  # * +paid+ - The amount paid by the customer in dollars and cents
  def calculate_change_hash(owed, paid)
    raise "Owed amount must be a positive number" unless (owed.is_a?(Numeric) && owed >= 0)
    raise "Paid amount must be a positive number" unless (paid.is_a?(Numeric) && paid >= 0)
    raise "Owed amount must not exceed paid amount" if owed > paid

    # Convert all values to pennies so that we're always dealing with whole number values
    change = Integer(paid * 100) - Integer(owed * 100)
    change_hash = {}
    randomize = (change % 3 == 0)

    # The algorithm:
    #   If 'change' is divisible by 3: 
    #     * Randomize the order in which denominations are processed 
    #     * For each denomination, choose a quantity from 0..N, where N is the
    #       maximum possible for the remaining change
    #   Else
    #     * Process denominations in the most efficient order and quantity
    #
    #   * Backfill any remaining change as pennies

    denom_order = randomize ? @@denomination_order.shuffle : @@denomination_order

    denom_order.each { |denom|
      denom_quantity = Integer(change / @@denomination_value[denom])
      change_hash[denom] = randomize ? Integer(rand(denom_quantity)) : denom_quantity
      change -= change_hash[denom] * @@denomination_value[denom]
    }

    change_hash[:penny] += change if (change > 0)

    return change_hash
  end
end
