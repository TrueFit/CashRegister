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
    writeOut("bar.csv", calculateChange(valuesFor("foo.csv"), USCurrency))
  }

  def valuesFor(fileName: String): List[List[Double]] = {
    val reader = CSVReader.open(new File(fileName))
    val content = reader.all.map(x => x.map(_.toDouble))
    reader.close
    content
  }

  def calculateChange(values: List[List[Double]], currency: Map[Double, String]): List[List[String]] = {
    def recurs(amtLeft: Double, curr: List[Double], res: List[Double]): List[Double] = {
      if (amtLeft <= 0.0) { return res.drop(1) }
      else if (currencyRound(amtLeft - curr.head) >= 0.0) {
        recurs(currencyRound(amtLeft - curr.head), curr, res ::: List(curr.head))
      }
      else { recurs(amtLeft, curr.drop(1), res) }
    }

    values.map(x =>
      recurs(currencyRound(x.last - x.head), currency.keys.toList.sortBy(- _.toDouble), List(0.0)).map( x => currency(x) )
    )
  }

  def writeOut(fileName: String, output: List[List[String]]) {
    val writer = CSVWriter.open(new File(fileName))
    writer.writeAll(output)
    writer.close
  }

  def currencyRound(m: Double): Double = {
    val t = math pow (10, 2)
    (math ceil m * t) / t
  }
}
