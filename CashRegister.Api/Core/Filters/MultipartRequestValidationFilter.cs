using CashRegister.Api.Core.Utilities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;

namespace CashRegister.Api.Core.Filters
{
    public class MultipartRequestValidationFilter : Attribute, IActionFilter
    {
        public void OnActionExecuting(ActionExecutingContext context)
        {
            if (!MultipartRequestHelper.IsMultipartContentType(context.HttpContext.Request.ContentType))
            {
                context.Result = new BadRequestObjectResult($"Expected a multipart request, but got { context.HttpContext.Request.ContentType }");
            }
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
        }
    }
}
