using System;

namespace asp_net_angularjs.AdminTools
{
  public class CustomerRecord
  {
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Segment { get; set; }
    public string Branch { get; set; }
    public decimal Balance { get; set; }
    public int DaysSinceLastLogin { get; set; }
    public bool KycVerified { get; set; }
    public string RiskTier { get; set; }

    public string FullName
    {
      get { return FirstName + " " + LastName; }
    }
  }

  public class ReviewQueueItem
  {
    public string Id { get; set; }
    public string Title { get; set; }
    public string Category { get; set; }
    public string Severity { get; set; }
    public string Component { get; set; }
    public string Status { get; set; }
    public string Summary { get; set; }
  }
}
