using System.Web.Mvc;
using System.Web.Routing;

namespace Dollar.Web
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute("Default", "{controller}/{action}/{id}", new { controller = "File", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
