#! /usr/bin/env ruby
require_relative "lib/transaction"

File.open("change.csv", "w") do |f|
  File.foreach("transactions.csv") do |line|
    amount_owed, amount_paid = line.split(",")
    transaction = Transaction.new(amount_owed: amount_owed.to_f, amount_paid: amount_paid.to_f)
    f.puts transaction.change
  end
end
