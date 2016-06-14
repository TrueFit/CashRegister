# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)

Gem::Specification.new do |spec|
  spec.name          = "CashRegister"
  spec.version       = '1.0'
  spec.authors       = ["Andrew Yochum"]
  spec.email         = ["andrewyochum@gmail.com"]
  spec.summary       = %q{Ruby implementation of the CashRegister problem by TrueFit}
  spec.description   = %q{
    Creative Cash Draw Solutions is a client who wants to provide something
    different for the cashiers who use their system. The function of the
    application is to tell the cashier how much change is owed, and what
    denominations should be used. In most cases the app should return the minimum
    amount of physical change, but the client would like to add a twist. If the
    "owed" amount is divisible by 3, the app should randomly generate the change
    denominations (but the math still needs to be right :))
  }
  spec.homepage      = "https://github.com/timecatalyst/CashRegister"
  spec.license       = "MIT"
  
  spec.files         = ['lib/CashRegister.rb']
  spec.executables   = ['bin/CashRegister']
  spec.test_files    = ['tests/test_CashRegister.rb']
  spec.require_paths = ["lib"]
end
