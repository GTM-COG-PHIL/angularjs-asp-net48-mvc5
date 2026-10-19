using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace asp_net_angularjs
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "AdminToolsApi",
                url: "admin/api/{action}/{id}",
                defaults: new { controller = "AdminTools", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "AdminToolsSpa",
                url: "admin-tools/{*path}",
                defaults: new { controller = "Landing", action = "Index" }
            );

            routes.MapRoute(
                name: "Landing",
                url: "",
                defaults: new { controller = "Landing", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
