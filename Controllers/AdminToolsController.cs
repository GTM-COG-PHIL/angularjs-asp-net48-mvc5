using System;
using System.Linq;
using System.Web.Mvc;
using asp_net_angularjs.AdminTools;

namespace asp_net_angularjs.Controllers
{
  public class AdminToolsController : Controller
  {
    private const int DefaultPageSize = 25;
    private readonly CustomerDirectory _directory = new CustomerDirectory();
    private readonly ReviewQueueService _reviewQueue = new ReviewQueueService();

    [HttpGet]
    public ActionResult Customers(string q, string segment, int? page)
    {
      var pageNumber = page.HasValue && page.Value > 0 ? page.Value : 1;
      var results = _directory.Search(q, segment, pageNumber, DefaultPageSize);
      return Json(new
      {
        page = pageNumber,
        pageSize = DefaultPageSize,
        items = results.Select(c => new
        {
          id = c.Id,
          name = c.FullName,
          email = c.Email,
          segment = c.Segment,
          branch = c.Branch,
          balance = c.Balance,
          daysSinceLastLogin = c.DaysSinceLastLogin,
          kycVerified = c.KycVerified,
          riskTier = c.RiskTier
        })
      }, JsonRequestBehavior.AllowGet);
    }

    [HttpGet]
    public ActionResult Customer(int id)
    {
      var record = _directory.FindById(id);
      return Json(new
      {
        id = record.Id,
        name = record.FullName,
        email = record.Email,
        segment = record.Segment,
        branch = record.Branch,
        balance = record.Balance,
        riskTier = record.RiskTier
      }, JsonRequestBehavior.AllowGet);
    }

    [HttpGet]
    public ActionResult Export(string id, string asOf)
    {
      var exporter = new ReportExportService(_directory);
      if (!exporter.IsSupported(id))
      {
        return new HttpStatusCodeResult(400, "Unknown report type");
      }
      var reportType = id.ToLowerInvariant();
      var bytes = exporter.Build(reportType, asOf);
      var fileName = "metro-" + reportType + "-" + DateTime.UtcNow.ToString("yyyyMMdd") + ".csv";
      return File(bytes, "text/csv", fileName);
    }

    [HttpGet]
    public ActionResult ReviewQueue()
    {
      return Json(_reviewQueue.GetQueue().ToList(), JsonRequestBehavior.AllowGet);
    }
  }
}
