package cashregister

import com.github.tototoshi.csv._
import java.io.{File}
import util.{Random}

object CashRegister {

  object Currency {
    // Map the denomination to the output format including
    // pluralized version
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
    def format(input: List[Double], currency: Map[Double, String]): List[String] = input match {
      case List() => List("No change")
      case _ => {
        val grouped = input.groupBy(identity).values
        grouped.toList.sortBy(- _.head).map(x =>
            if (x.length > 1) { "%d %s".format(x.length, currency(x.head).split("/").last) }
            else { "%d %s".format(x.length, currency(x.head).split("/").head) }
            )
      }
    }
  }

  class CSVFile(fName: String) {
    def read(): List[List[Double]] = {
      val reader = CSVReader.open(new File(fName))
      val content = reader.all.map(x => x.map(_.toDouble))
      reader.close
      content
    }

    def writeOut(outData: List[List[String]]) {
      val writer = CSVWriter.open(new File(fName))
      writer.writeAll(outData)
      writer.close
    }
  }

  def main(args: Array[String]) {
    val inData = new CSVFile("input.csv").read
    val outData = calculateChange(inData, Currency.USA)
    new CSVFile("output.csv").writeOut(outData.map(x => Presenter.format(x, Currency.USA)))
  }

  def calculateChange(values: List[List[Double]], currency: Map[Double, String]): List[List[Double]] = {
    // Recursively search for the largest denomination that fits into the amount due.  If the head of the
    // List of denominations is too large, we pop it off of the List and move on
    def recurs(amtLeft: Double, curr: List[Double], res: List[Double]): List[Double] = {
      if (amtLeft <= 0.0) { return res }
      else if (Currency.round(amtLeft - curr.head) >= 0.0) {
        recurs(Currency.round(amtLeft - curr.head), curr, res ::: List(curr.head))
      }
      else { recurs(amtLeft, curr.drop(1), res) }
    }

    // Similar to the approach above except that we never pop any elements from the List, instead
    // we shuffle the List elements again and go for another iteration
    def recursRandom(amtLeft: Double, curr: List[Double], res: List[Double]): List[Double] = {
      if (amtLeft <= 0.0) { return res }
      else if (Currency.round(amtLeft - curr.head) >= 0.0) {
        recursRandom(Currency.round(amtLeft - curr.head), Random.shuffle(curr), res ::: List(curr.head))
      }
      else { recursRandom(amtLeft, Random.shuffle(curr), res) }
    }

    values.map(x =>
      if ((x.head * 100) % 3 == 0 && x.head > 0.0) {
        recursRandom(Currency.round(x.last - x.head), Random.shuffle(currency.keys.toList), List())
      } else {
        recurs(Currency.round(x.last - x.head), currency.keys.toList.sortBy(- _), List())
      }
    )
  }
}
