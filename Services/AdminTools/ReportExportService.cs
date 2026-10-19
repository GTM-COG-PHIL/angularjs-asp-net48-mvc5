using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;

namespace asp_net_angularjs.AdminTools
{
  /// <summary>
  /// Builds CSV exports for a fixed set of report types. Report names are resolved
  /// through an allow-list; callers never influence file paths or storage.
  /// </summary>
  public class ReportExportService
  {
    public static readonly string[] SupportedReports = { "balances", "dormant", "kyc" };

    private readonly CustomerDirectory _directory;

    public ReportExportService(CustomerDirectory directory)
    {
      _directory = directory;
    }

    public bool IsSupported(string reportType)
    {
      return reportType != null && SupportedReports.Contains(reportType.ToLowerInvariant());
    }

    public byte[] Build(string reportType, string asOf)
    {
      DateTime asOfDate;
      if (!DateTime.TryParseExact(asOf, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out asOfDate))
      {
        asOfDate = DateTime.UtcNow;
      }

      switch (reportType.ToLowerInvariant())
      {
        case "balances":
          return BuildBalancesReport(asOfDate);
        case "dormant":
          return BuildDormantReport(asOfDate);
        case "kyc":
          return BuildKycReport(asOfDate);
        default:
          throw new ArgumentException("Unsupported report type", "reportType");
      }
    }

    private byte[] BuildBalancesReport(DateTime asOf)
    {
      using (var writer = new StringWriter())
      {
        writer.WriteLine("# Metro National Bank - Balances report");
        writer.WriteLine("# Generated " + asOf.ToString("yyyy-MM-dd") + " (synthetic data)");
        writer.WriteLine("Id,Name,Email,Segment,Branch,Balance,RiskTier");
        var rows = _directory.All().OrderByDescending(c => c.Balance).ToList();
        var total = 0m;
        var count = 0;
        foreach (var c in rows)
        {
          writer.Write(c.Id);
          writer.Write(",");
          writer.Write(Escape(c.FullName));
          writer.Write(",");
          writer.Write(Escape(c.Email));
          writer.Write(",");
          writer.Write(Escape(c.Segment));
          writer.Write(",");
          writer.Write(Escape(c.Branch));
          writer.Write(",");
          writer.Write(c.Balance.ToString("F2", CultureInfo.InvariantCulture));
          writer.Write(",");
          writer.WriteLine(Escape(c.RiskTier));
          total += c.Balance;
          count++;
        }
        writer.WriteLine("# Rows: " + count + ", total balance: " + total.ToString("F2", CultureInfo.InvariantCulture));
        return Encoding.UTF8.GetBytes(writer.ToString());
      }
    }

    private byte[] BuildDormantReport(DateTime asOf)
    {
      using (var writer = new StringWriter())
      {
        writer.WriteLine("# Metro National Bank - Dormant accounts report");
        writer.WriteLine("# Generated " + asOf.ToString("yyyy-MM-dd") + " (synthetic data)");
        writer.WriteLine("Id,Name,Email,Segment,Branch,Balance,RiskTier");
        var rows = _directory.All().Where(c => c.DaysSinceLastLogin > 365).OrderByDescending(c => c.DaysSinceLastLogin).ToList();
        var total = 0m;
        var count = 0;
        foreach (var c in rows)
        {
          writer.Write(c.Id);
          writer.Write(",");
          writer.Write(Escape(c.FullName));
          writer.Write(",");
          writer.Write(Escape(c.Email));
          writer.Write(",");
          writer.Write(Escape(c.Segment));
          writer.Write(",");
          writer.Write(Escape(c.Branch));
          writer.Write(",");
          writer.Write(c.Balance.ToString("F2", CultureInfo.InvariantCulture));
          writer.Write(",");
          writer.WriteLine(Escape(c.RiskTier));
          total += c.Balance;
          count++;
        }
        writer.WriteLine("# Rows: " + count + ", total balance: " + total.ToString("F2", CultureInfo.InvariantCulture));
        return Encoding.UTF8.GetBytes(writer.ToString());
      }
    }

    private byte[] BuildKycReport(DateTime asOf)
    {
      using (var writer = new StringWriter())
      {
        writer.WriteLine("# Metro National Bank - KYC outstanding report");
        writer.WriteLine("# Generated " + asOf.ToString("yyyy-MM-dd") + " (synthetic data)");
        writer.WriteLine("Id,Name,Email,Segment,Branch,Balance,RiskTier");
        var rows = _directory.All().Where(c => !c.KycVerified).OrderBy(c => c.Id).ToList();
        var total = 0m;
        var count = 0;
        foreach (var c in rows)
        {
          writer.Write(c.Id);
          writer.Write(",");
          writer.Write(Escape(c.FullName));
          writer.Write(",");
          writer.Write(Escape(c.Email));
          writer.Write(",");
          writer.Write(Escape(c.Segment));
          writer.Write(",");
          writer.Write(Escape(c.Branch));
          writer.Write(",");
          writer.Write(c.Balance.ToString("F2", CultureInfo.InvariantCulture));
          writer.Write(",");
          writer.WriteLine(Escape(c.RiskTier));
          total += c.Balance;
          count++;
        }
        writer.WriteLine("# Rows: " + count + ", total balance: " + total.ToString("F2", CultureInfo.InvariantCulture));
        return Encoding.UTF8.GetBytes(writer.ToString());
      }
    }

    // Older export path kept for reference while the new writer settles.
    // private byte[] BuildLegacyReport(string type)
    // {
    //   var sb = new StringBuilder();
    //   foreach (var c in _directory.All()) sb.AppendLine(c.Id + "," + c.FullName);
    //   return Encoding.UTF8.GetBytes(sb.ToString());
    // }

    private static string Escape(string value)
    {
      if (value == null)
      {
        return string.Empty;
      }
      var safe = value;
      if (safe.Length > 0 && (safe[0] == '=' || safe[0] == '+' || safe[0] == '-' || safe[0] == '@'))
      {
        safe = "'" + safe;
      }
      if (safe.IndexOfAny(new[] { ',', '"', '\n', '\r' }) >= 0)
      {
        safe = "\"" + safe.Replace("\"", "\"\"") + "\"";
      }
      return safe;
    }
  }
}
