// Tests básicos para Cash Register
const { CashRegister, CashRegisterBuilder } = require('../src/index');
const Validator = require('../src/core/validator');

console.log('🧪 EJECUTANDO TESTS BÁSICOS\n');

let testsPassed = 0;
let testsFailed = 0;

function test(name, testFunction) {
  try {
    testFunction();
    console.log(`✅ ${name}`);
    testsPassed++;
  } catch (error) {
    console.log(`❌ ${name}: ${error.message}`);
    testsFailed++;
  }
}

// Test 1: Validación de montos
test('Validación de montos válidos', function() {
  Validator.validateAmount(10.50, 'test');
  Validator.validateAmount(0, 'test');
  Validator.validateAmount(100, 'test');
});

test('Validación de montos inválidos', function() {
  try {
    Validator.validateAmount(-5, 'test');
    throw new Error('Should have failed with negative amount');
  } catch (error) {
    if (!error.message.includes('cannot be negative')) {
      throw error;
    }
  }
});

test('Validación de transacciones válidas', function() {
  Validator.validateTransaction(10.50, 15.00);
  Validator.validateTransaction(0, 0);
});

test('Validación de transacciones inválidas', function() {
  try {
    Validator.validateTransaction(15.00, 10.50);
    throw new Error('Should have failed with payment less than owed');
  } catch (error) {
    if (!error.message.includes('cannot be less than')) {
      throw error;
    }
  }
});

// Test 2: Cash Register básico
test('Cash Register - Cambio normal', function() {
  const cashRegister = new CashRegister();
  const change = cashRegister.calculateChange(2.12, 3.00);
  if (!change || change === '') {
    throw new Error('Cambio no calculado');
  }
});

test('Cash Register - Sin cambio', function() {
  const cashRegister = new CashRegister();
  const change = cashRegister.calculateChange(3.00, 3.00);
  if (change !== 'No change needed') {
    throw new Error('Debería indicar que no hay cambio');
  }
});

test('Cash Register - Cambio aleatorio', function() {
  const cashRegister = new CashRegister();
  const change = cashRegister.calculateChange(3.33, 5.00);
  if (!change || change === '') {
    throw new Error('Cambio aleatorio no calculado');
  }
});

// Test 3: Cash Register por país
test('Cash Register Colombia', function() {
  const cashRegister = new CashRegisterBuilder()
    .setCountry('COLOMBIA')
    .build();
  
  if (cashRegister.currency !== 'COP') {
    throw new Error('Moneda incorrecta para Colombia');
  }
  
  if (cashRegister.countryCode !== 'COLOMBIA') {
    throw new Error('Código de país incorrecto');
  }
});

test('Cash Register Estados Unidos', function() {
  const cashRegister = new CashRegisterBuilder()
    .setCountry('US')
    .build();
  
  if (cashRegister.currency !== 'USD') {
    throw new Error('Moneda incorrecta para Estados Unidos');
  }
});

// Test 4: Builder Pattern
test('Builder Pattern - Configuración personalizada', function() {
  const cashRegister = new CashRegisterBuilder()
    .addDenomination('test', 1000, 'tests')
    .removeDenomination('penny')
    .build();
  
  const hasTestDenomination = cashRegister.denominations.some(d => d.name === 'test');
  const hasPenny = cashRegister.denominations.some(d => d.name === 'penny');
  
  if (!hasTestDenomination) {
    throw new Error('Denominación personalizada no agregada');
  }
  
  if (hasPenny) {
    throw new Error('Penny no fue removido');
  }
});

// Test 5: Validación de países
test('Validación de países soportados', function() {
  Validator.validateCountry('US');
  Validator.validateCountry('COLOMBIA');
  Validator.validateCountry('MEXICO');
  Validator.validateCountry('SPAIN');
});

test('Validación de país no soportado', function() {
  try {
    Validator.validateCountry('INVALID');
    throw new Error('Should have failed with invalid country');
  } catch (error) {
    if (!error.message.includes('not supported')) {
      throw error;
    }
  }
});

// Resumen de tests
console.log('\n📊 RESUMEN DE TESTS:');
console.log(`✅ Tests pasados: ${testsPassed}`);
console.log(`❌ Tests fallidos: ${testsFailed}`);
console.log(`📈 Total: ${testsPassed + testsFailed}`);

if (testsFailed === 0) {
  console.log('\n🎉 ¡Todos los tests pasaron!');
} else {
  console.log('\n⚠️  Algunos tests fallaron');
}
