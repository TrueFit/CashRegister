using CashRegister.WebApi.Common;
using CashRegister.WebApi.Helpers;
using System.IO;
using System.Net;
using System.Text;
using System.Web;
using System.Web.Http;

namespace CashRegister.WebApi.Controllers
{
    [AllowCrossSiteJson]
    public class UploadFileController : ApiController
    {
        public string Post(HttpPostedFileBase file)
        {
            var output = new StringBuilder();

            using(var sr = new StreamReader(file.InputStream))
            {
                var amountOwed = double.Parse(sr.ReadLine().Split(',')[0]);
                var amountPaid = double.Parse(sr.ReadLine().Split(',')[1]);

                output.AppendLine(DollarsToChangeConverter.Convert(amountOwed, amountPaid));
            }

            return output.ToString();
        }
    }
}
