import com.github.tototoshi.csv._
import java.io.{File}

object CashRegister {
  def main(args: Array[String]) {
    println(valuesFor("foo.csv"))
    writeOut("bar.csv", List(List("a", "b"), List("baz", "c")))
  }

  def valuesFor(fileName: String): List[List[Double]] = {
    val reader = CSVReader.open(new File(fileName))
    val content = reader.all.map(x => x.map(_.toDouble))
    reader.close
    content
  }

  def writeOut(fileName: String, output: List[List[String]]) {
    val writer = CSVWriter.open(new File(fileName))
    writer.writeAll(output)
    writer.close
  }
}
