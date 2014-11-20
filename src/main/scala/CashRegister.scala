import com.github.tototoshi.csv._
import java.io.{File}

object CashRegister {

  val USCurrency = Map(100.0 -> "100 dollars",
                       50.0  -> "50 dollars",
                       20.0  -> "20 dollars",
                       10.0  -> "10 dollars",
                        5.0  -> "5 dollars",
                        1.0  -> "1 dollar",
                       0.25  -> "1 quarter",
                       0.10  -> "1 dime",
                       0.05  -> "1 nickel",
                       0.01  -> "1 penny")

  def main(args: Array[String]) {
    println(valuesFor("foo.csv"))
    writeOut("bar.csv", List(List("a", "b"), List("baz", "c")))
    cChange(1.13, USCurrency)
  }

  def valuesFor(fileName: String): List[List[Double]] = {
    val reader = CSVReader.open(new File(fileName))
    val content = reader.all.map(x => x.map(_.toDouble))
    reader.close
    content
  }

  def cChange(value: Double, currency: Map[Double, String]): List[String] = {
    def recurs(amtLeft: Double, curr: List[Double], cnt: List[Double]): List[Double] = {
      if (amtLeft <= 0.0) {
        println("Terminating condition")
        return cnt.drop(1)
      }
      else if (moneyPrecision(amtLeft - curr.head) >= 0.0) {
        println("Remaining amount fits into this denomination")
        recurs(moneyPrecision(amtLeft - curr.head), curr, cnt ::: List(curr.head))
      }
      else {
        println("Currency too large, next")
        recurs(amtLeft, curr.drop(1), cnt)
      }
    }

    val f = recurs(value, currency.keys.toList.sortBy(- _.toDouble), List(0.0))
    println(f)
    List("a", "b")
  }

  //def calculateChange(values: List[List[Double]], currency: List[Map[Double, String]]): List[List[String]] = {
    //def recurs(amt: Double, curr: List[Double], cnt: Double): List[Double] = {

    //}

  //}

  def writeOut(fileName: String, output: List[List[String]]) {
    val writer = CSVWriter.open(new File(fileName))
    writer.writeAll(output)
    writer.close
  }

  def moneyPrecision(m: Double): Double = {
    val t = math pow (10, 2)
    (math ceil m * t) / t
  }
}
