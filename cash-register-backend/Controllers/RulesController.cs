using cash_register_backend.DTOs;
using cash_register_backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace cash_register_backend.Controllers
{
    /// <summary>
    /// Handles the Rules endpoints. Rules are used to determine if change should be randomly generated for a given calculation request,
    /// based on the properties of the request and the rules that have been set up in the system.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class RulesController : ControllerBase
    {
        private readonly ILogger<RulesController> _logger;
        private readonly IRuleSerivce _ruleService;

        public RulesController(ILogger<RulesController> logger, IRuleSerivce ruleSerivce)
        {
            _logger = logger;
            _ruleService = ruleSerivce;
        }

        // GET: api/Rule/{ruleId}
        ///<summary>
        ///Gets a specific rule by ID.
        ///</summary>
        [HttpGet("{ruleId}")]
        public async Task<ActionResult<RuleDTO>> GetRule(int ruleId)
        {
            _logger.LogInformation("GET api/Rules/{RuleId}", ruleId);
            var rule = await _ruleService.GetRule(ruleId);

            if (rule == null)
            {
                _logger.LogInformation("Rule with ID {RuleId} not found.", ruleId);
                return NotFound($"Rule with ID {ruleId} not found.");
            }

            return Ok(rule);
        }

        // GET: api/Rule
        /// <summary>
        /// Gets all rules in the system.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<List<RuleDTO>>> GetAllRules()
        {
            _logger.LogInformation("GET api/Rules");
            var rules = await _ruleService.GetAllRules();

            // service now returns empty list when no rules exist; treat null as not found
            if (rules == null)
            {
                _logger.LogInformation("No rules found.");
                return NotFound("No rules were found.");
            }

            return Ok(rules);
        }

        // PUT: api/Rule/{ruleId}
        /// <summary>
        /// Updates an exisiting rule. Such as disabling a rule or changing the rules target
        /// </summary>
        [HttpPut("{ruleId}")]
        public async Task<ActionResult<RuleDTO>> UpdateRule(int ruleId, [FromBody] RuleDTO rule)
        {
            _logger.LogInformation("PUT api/Rules/{RuleId}", ruleId);

            if (rule is null)
            {
                _logger.LogInformation("Request body was null for rule update.");
                return BadRequest("Request body is required.");
            }

            if (!ModelState.IsValid)
            {
                _logger.LogInformation("Invalid model state for rule update: {@ModelState}", ModelState);
                return BadRequest(ModelState);
            }

            if (ruleId != rule.Id)
            {
                _logger.LogInformation("Route id {RouteId} does not match body id {BodyId}.", ruleId, rule.Id);
                return BadRequest("Route id does not match rule id in body.");
            }

            var updatedRule = await _ruleService.UpdateRule(rule);

            if (updatedRule == null)
            {
                _logger.LogInformation("Unable to update rule with ID {RuleId}.", ruleId);
                return BadRequest($"Unable to update rule with ID {ruleId}.");
            }

            return Ok(updatedRule);
        }
    }
}
