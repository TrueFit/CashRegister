import com.github.tototoshi.csv._
import java.io.{File}
import util.{Random}

object CashRegister {

  object Currency {
    val USA = Map(
      100.0 -> "100 dollar bill/100 dollar bills",
      50.0  -> "50 dollar bill/50 dollar bills",
      20.0  -> "20 dollar bill/20 dollar bills",
      10.0  -> "10 dollar bill/10 dollar bills",
      5.0  -> "5 dollar bill/5 dollar bills",
      1.0  -> "1 dollar bill/1 dollar bills",
      0.25  -> "quarter/quarters",
      0.10  -> "dime/dimes",
      0.05  -> "nickel/nickels",
      0.01  -> "penny/pennies")

    def round(m: Double): Double = {
      val t = math.pow(10, 2)
      (math.round(m * t)) / t
    }
  }

  object Presenter {
    def format(input: List[Double], currency: Map[Double, String]): List[String] = {
      val grouped = input.groupBy(identity).values
      grouped.toList.sortBy(- _.head).map(x =>
          if (x.length > 1) { "%d %s".format(x.length, currency(x.head).split("/").last) }
          else { "%d %s".format(x.length, currency(x.head).split("/").head) }
          )
    }
  }

  def main(args: Array[String]) {
    writeOut("bar.csv", calculateChange(valuesFor("foo.csv"), Currency.USA))
  }

  def valuesFor(fileName: String): List[List[Double]] = {
    val reader = CSVReader.open(new File(fileName))
    val content = reader.all.map(x => x.map(_.toDouble))
    reader.close
    content
  }

  def calculateChange(values: List[List[Double]], currency: Map[Double, String]): List[List[String]] = {
    def recurs(amtLeft: Double, curr: List[Double], res: List[Double]): List[Double] = {
      if (amtLeft <= 0.0) { return res }
      else if (Currency.round(amtLeft - curr.head) >= 0.0) {
        recurs(Currency.round(amtLeft - curr.head), curr, res ::: List(curr.head))
      }
      else { recurs(amtLeft, curr.drop(1), res) }
    }

    def recursRandom(amtLeft: Double, curr: List[Double], res: List[Double]): List[Double] = {
      if (amtLeft <= 0.0) { return res }
      else if (Currency.round(amtLeft - curr.head) >= 0.0) {
        recursRandom(Currency.round(amtLeft - curr.head), Random.shuffle(curr), res ::: List(curr.head))
      }
      else { recursRandom(amtLeft, Random.shuffle(curr), res) }
    }

    values.map(x =>
      if ((x.head * 100) % 3 == 0 && x.head > 0.0) {
        Presenter.format(recursRandom(Currency.round(x.last - x.head), Random.shuffle(currency.keys.toList), List()), currency)
      } else {
        Presenter.format(recurs(Currency.round(x.last - x.head), currency.keys.toList.sortBy(- _), List()), currency)
      }
    )
  }

  def writeOut(fileName: String, output: List[List[String]]) {
    val writer = CSVWriter.open(new File(fileName))
    writer.writeAll(output)
    writer.close
  }
}
