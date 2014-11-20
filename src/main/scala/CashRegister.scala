import com.github.tototoshi.csv._
import java.io.{File}

object CashRegister {
  def main(args: Array[String]) {
    println(valuesFor("foo.csv"))
  }

  def valuesFor(fileName: String): List[List[Double]] = {
    val reader = CSVReader.open(new File(fileName))
    val content = reader.all().map(x => x.map(_.toDouble))
    reader.close()
    content
  }
}
