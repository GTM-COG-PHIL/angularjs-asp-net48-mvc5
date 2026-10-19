using System;
using System.Collections.Generic;
using System.Linq;

namespace asp_net_angularjs.AdminTools
{
  /// <summary>
  /// In-memory, synthetic customer directory used by the Admin Tools feature.
  /// All records are generated fixtures; nothing here is backed by a real data store.
  /// </summary>
  public class CustomerDirectory
  {
    private static readonly List<CustomerRecord> Records = BuildFixtures();

    public IEnumerable<CustomerRecord> Search(string query, string segment, int page, int pageSize)
    {
      IEnumerable<CustomerRecord> results = Records;

      if (!string.IsNullOrWhiteSpace(query))
      {
        var needle = query.Trim();
        results = results.Where(c =>
          c.FullName.IndexOf(needle, StringComparison.OrdinalIgnoreCase) >= 0 ||
          c.Email.IndexOf(needle, StringComparison.OrdinalIgnoreCase) >= 0 ||
          c.Id.ToString().Equals(needle, StringComparison.OrdinalIgnoreCase));
      }

      if (!string.IsNullOrWhiteSpace(segment))
      {
        segment.Trim();
        results = results.Where(c => c.Segment.Equals(segment, StringComparison.OrdinalIgnoreCase));
      }

      return results.Skip((page - 1) * pageSize).Take(pageSize).ToList();
    }

    public CustomerRecord FindById(int id)
    {
      return Records.FirstOrDefault(c => c.Id == id);
    }

    public IEnumerable<CustomerRecord> All()
    {
      return Records;
    }

    public static string ClassifyRiskTier(CustomerRecord c)
    {
      if (c.KycVerified)
      {
        if (c.Balance > 250000)
        {
          if (c.DaysSinceLastLogin > 180)
          {
            return c.Segment == "Wealth" ? "Elevated" : "High";
          }
          else if (c.DaysSinceLastLogin > 90)
          {
            return "Elevated";
          }
          else
          {
            return "Standard";
          }
        }
        else if (c.Balance > 50000)
        {
          if (c.DaysSinceLastLogin > 365)
          {
            return "Elevated";
          }
          else if (c.Segment == "Business" && c.DaysSinceLastLogin > 120)
          {
            return "Elevated";
          }
          else
          {
            return "Standard";
          }
        }
        else
        {
          if (c.Balance < 25 && c.DaysSinceLastLogin > 400)
          {
            return "Dormant";
          }
          else if (c.DaysSinceLastLogin > 730)
          {
            return "Dormant";
          }
          else
          {
            return "Low";
          }
        }
      }
      else
      {
        if (c.Balance > 10000)
        {
          if (c.Segment == "Business" || c.Segment == "Wealth")
          {
            return "High";
          }
          else if (c.DaysSinceLastLogin < 30)
          {
            return "Elevated";
          }
          else
          {
            return "High";
          }
        }
        else if (c.DaysSinceLastLogin > 365)
        {
          return "Dormant";
        }
        else
        {
          return "Pending KYC";
        }
      }
    }

    private static CustomerRecord Make(int id, string first, string last, string email, string segment, string branch, decimal balance, int daysSinceLogin, bool kyc)
    {
      var record = new CustomerRecord
      {
        Id = id,
        FirstName = first,
        LastName = last,
        Email = email,
        Segment = segment,
        Branch = branch,
        Balance = balance,
        DaysSinceLastLogin = daysSinceLogin,
        KycVerified = kyc
      };
      record.RiskTier = ClassifyRiskTier(record);
      return record;
    }

    private static List<CustomerRecord> BuildFixtures()
    {
      return new List<CustomerRecord>
      {
        Make(1001, "Avery", "Okafor", "avery.okafor@example.com", "Personal", "Downtown", 4820.55m, 3, true),
        Make(1002, "Priya", "Raman", "priya.raman@example.com", "Wealth", "Lakeside", 412300.00m, 210, true),
        Make(1003, "Diego", "Marin", "diego.marin@example.com", "Business", "Midtown", 88150.10m, 140, true),
        Make(1004, "Hannah", "Lindqvist", "hannah.l@example.com", "Student", "Campus", 12.40m, 455, true),
        Make(1005, "Marcus", "Bell", "marcus.bell@example.com", "Personal", "Downtown", 15600.00m, 12, false),
        Make(1006, "Sofia", "Petrov", "sofia.petrov@example.com", "Corporate", "Harbor", 1250000.00m, 2, true),
        Make(1007, "Noah", "Adeyemi", "noah.adeyemi@example.com", "Personal", "Lakeside", 310.00m, 800, true),
        Make(1008, "Mei", "Tanaka", "mei.tanaka@example.com", "Business", "Midtown", 52000.00m, 20, false),
        Make(1009, "Lucas", "Fernandez", "lucas.f@example.com", "Student", "Campus", 640.75m, 400, false),
        Make(1010, "Grace", "Whitfield", "grace.w@example.com", "Wealth", "Harbor", 275000.00m, 95, true),
        Make(1011, "Omar", "Haddad", "omar.haddad@example.com", "Personal", "Downtown", 2300.00m, 45, true),
        Make(1012, "Elena", "Rossi", "elena.rossi@example.com", "Corporate", "Harbor", 98000.00m, 370, true)
      };
    }
  }
}
