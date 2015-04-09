using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Dollar.Web.Common;

namespace Dollar.Web.Controllers
{
    public class FileController : Controller
    {
        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> ProcessFile(HttpPostedFileBase file)
        {
            if (file == null || file.ContentLength == 0)
            {
                ModelState.AddModelError(string.Empty, "Invalid file");

                return View("Index");
            }

            try
            {
                byte[] bytes;
                string result = null;

                await (Task.Run(() =>
                {
                    using (var binaryReader = new BinaryReader(file.InputStream))
                    {
                        bytes = binaryReader.ReadBytes(file.ContentLength);
                    }

                    var content = Encoding.Default.GetString(bytes);

                    result = new MonetaryInputParser()
                        .ProcessFileContent(content)
                        .ToString();
                }));

                var resultBytes = Encoding.ASCII.GetBytes(result);

                return File(resultBytes, "application/unknown", "Output.txt");
            }
            catch (Exception)
            {
                ModelState.AddModelError(string.Empty, "Error processing file");

                return View("Index");
            }
        }
    }
}