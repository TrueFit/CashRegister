package cashregister

import org.scalatest._
import util.{Random}

class CashRegisterTest extends FunSuite {

  test("calculating change gives the correct amount of money back") {
    val r = new Random
    val amtDue = r.nextDouble * 100
    val amtPaid = amtDue + (new Random().nextDouble * 100)
    val input = List(List(amtDue, amtPaid))
    val expectedOutput = CashRegister.Currency.round(amtPaid - amtDue)
    assert(CashRegister.calculateChange(
      input, CashRegister.Currency.USA).map(x => CashRegister.Currency.round(x.sum)) == List(expectedOutput))
  }

  test("calculating change when the exact amount is given") {
    val amtDue = 3.42
    val amtPaid = 3.42
    val input = List(List(amtDue, amtPaid))
    assert(CashRegister.calculateChange(input, CashRegister.Currency.USA) == List(List()))
  }
}
