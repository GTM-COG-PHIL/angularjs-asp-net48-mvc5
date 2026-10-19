using System.Collections.Generic;

namespace asp_net_angularjs.AdminTools
{
  /// <summary>
  /// Static, clearly-labelled training fixtures for the security review queue.
  /// These describe hypothetical findings for rehearsal only; the application
  /// contains no code implementing the described weaknesses.
  /// </summary>
  public class ReviewQueueService
  {
    public IEnumerable<ReviewQueueItem> GetQueue()
    {
      return new List<ReviewQueueItem>
      {
        Item("SIM-001", "Search query built by string concatenation", "Injection", "High", "Customer search", "Training scenario: parameterised queries should be used instead of concatenating user input into SQL."),
        Item("SIM-002", "Export path assembled from request input", "Path handling", "High", "Report export", "Training scenario: resolve report names through an allow-list and never combine request values into file paths."),
        Item("SIM-003", "Diagnostics action shells out with a user-supplied host", "Command handling", "Critical", "Diagnostics", "Training scenario: avoid Process.Start with request data; call a typed network API with validated input."),
        Item("SIM-004", "Webhook target URL accepted without validation", "Outbound requests", "High", "Webhooks", "Training scenario: restrict outbound callbacks to an allow-list of registered hosts."),
        Item("SIM-005", "Session state deserialised with BinaryFormatter", "Deserialisation", "Critical", "State import", "Training scenario: use a data-contract serialiser with a fixed schema."),
        Item("SIM-006", "Weak hash used for token derivation", "Cryptography", "Medium", "Token utility", "Training scenario: use SHA-256 or a dedicated KDF; never MD5/DES."),
        Item("SIM-007", "Credential literal committed in source", "Secrets", "High", "Configuration", "Training scenario: load secrets from a vault or environment; rotate anything that leaked."),
        Item("SIM-008", "Certificate validation callback returns true", "Transport security", "High", "HTTP client", "Training scenario: keep default certificate validation; pin only with a documented process."),
        Item("SIM-009", "System.Random used for a security token", "Randomness", "Medium", "Token utility", "Training scenario: use RandomNumberGenerator for anything security relevant."),
        Item("SIM-010", "Request body including password written to logs", "Logging", "Medium", "Auth logging", "Training scenario: redact credentials and PII before logging.")
      };
    }

    private static ReviewQueueItem Item(string id, string title, string category, string severity, string component, string summary)
    {
      return new ReviewQueueItem
      {
        Id = id,
        Title = title,
        Category = category,
        Severity = severity,
        Component = component,
        Status = "Simulated",
        Summary = summary
      };
    }
  }
}
