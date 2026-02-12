using cash_register_backend.DTOs;

namespace cash_register_backend.Services
{
    public interface IRuleSerivce
    {
        Task<RuleDTO?> UpdateRule(RuleDTO updatedRule);
        Task<RuleDTO?> GetRule(int ruleId);
        Task<List<RuleDTO>?> GetAllRules();
    }
}
