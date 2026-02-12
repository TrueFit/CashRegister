using cash_register_backend.DTOs;
using cash_register_backend.Enums;
using Microsoft.EntityFrameworkCore;

namespace cash_register_backend.Services
{
    public class RuleService : IRuleSerivce
    {
        private readonly ILogger<RuleService> _logger;
        private readonly IAppDbContext _context;

        public RuleService(ILogger<RuleService> logger, IAppDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        public async Task<RuleDTO?> UpdateRule(RuleDTO updatedRule)
        {
            var currentRule = await _context.Rules.FirstOrDefaultAsync(s => s.Id == updatedRule.Id);
            if (currentRule == null)
            {
                return null;
            }

            // Apply updated values to the tracked entity
            currentRule.Name = updatedRule.Name;
            currentRule.Enabled = updatedRule.Enabled;
            currentRule.RuleTarget = (RuleTarget)Enum.Parse(typeof(RuleTarget), updatedRule.RuleTarget);
            currentRule.RuleType = (RuleType)Enum.Parse(typeof(RuleType), updatedRule.RuleType);
            currentRule.ModValue = updatedRule.ModValue;

            await _context.SaveChangesAsync();

            return new RuleDTO
            {
                Id = currentRule.Id,
                Name = currentRule.Name,
                Enabled = currentRule.Enabled,
                RuleTarget = currentRule.RuleTarget.ToString(),
                RuleType = currentRule.RuleType.ToString(),
                ModValue = currentRule.ModValue,
            };
        }

        public async Task<RuleDTO?> GetRule(int ruleId)
        {
            var rule = await _context.Rules.FirstOrDefaultAsync(s => s.Id == ruleId);
            if (rule == null)
            {
                return null;
            }

            return new RuleDTO
            {
                Id = rule.Id,
                Name = rule.Name,
                Enabled = rule.Enabled,
                RuleTarget = rule.RuleTarget.ToString(),
                RuleType = rule.RuleType.ToString(),
                ModValue = rule.ModValue
            };
        }

        public async Task<List<RuleDTO>?> GetAllRules()
        {
            var rules = await _context.Rules.ToListAsync();

            if (rules == null || rules.Count == 0)
            {
                return new List<RuleDTO>();
            }

            var result = rules
                .Select(r => new RuleDTO
                {
                    Id = r.Id,
                    Name = r.Name,
                    Enabled = r.Enabled,
                    RuleTarget = r.RuleTarget.ToString(),
                    RuleType = r.RuleType.ToString(),
                    ModValue = r.ModValue
                })
                .ToList();

            return result;
        }
    }
}
