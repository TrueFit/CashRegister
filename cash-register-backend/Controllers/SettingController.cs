using cash_register_backend.DTOs;
using cash_register_backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace cash_register_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SettingsController : ControllerBase
    {
        private readonly ILogger<SettingsController> _logger;
        private readonly ISettingsService _settingsService;

        public SettingsController(ILogger<SettingsController> logger, ISettingsService settingsService)
        {
            _logger = logger;
            _settingsService = settingsService;
        }

        // GET: api/Settings/{settingId}
        /// <summary>
        /// Gets the systems setting by Id. Right now there is only one setting, but this allows for future expansion if needed.
        /// </summary>
        [HttpGet("{settingId}")]
        public async Task<ActionResult<SettingDTO>> GetSetting(int settingId)
        {
            _logger.LogInformation("GET api/Settings/{SettingId}", settingId);
            var setting = await _settingsService.GetSetting(settingId);

            if (setting == null)
            {
                _logger.LogInformation("Setting with ID {SettingId} not found.", settingId);
                return NotFound($"Setting with ID {settingId} not found.");
            }

            return Ok(setting);
        }

        // GET: api/Settings/{settingId}/Currencies
        /// <summary>
        /// Gets the systems setting selected currencies. I currently have USD and EURO supported but can be easily expanded to support more if needed. This is a separate endpoint from the main setting to allow for easier expansion in the future if needed.
        /// </summary>
        [HttpGet("{settingId}/Currencies")]
        public async Task<ActionResult<CurrencyDTO>> GetCurrencies(int settingId)
        {
            _logger.LogInformation("GET api/Settings/Currencies");
            var currencies = await _settingsService.GetAllCurrencies();

            if (currencies == null || currencies.Count == 0)
            {
                _logger.LogInformation("Currencies not found.");
                return NotFound($"Currencies not found.");
            }

            return Ok(currencies);
        }

        // PUT: api/Settings/{settingId}
        /// <summary>
        /// Updates the systems setting. Right now the only setting is the selected currency, but this allows for future expansion if needed.
        /// </summary>
        [HttpPut("{settingId}")]
        public async Task<ActionResult<SettingDTO>> UpdateSetting(int settingId, [FromBody] SettingDTO setting)
        {
            _logger.LogInformation("PUT api/Settings/{SettingId}", settingId);

            if (setting is null)
            {
                _logger.LogInformation("Request body was null for setting update.");
                return BadRequest("Request body is required.");
            }

            if (!ModelState.IsValid)
            {
                _logger.LogInformation("Invalid model state for setting update: {@ModelState}", ModelState);
                return BadRequest(ModelState);
            }

            if (settingId != setting.Id)
            {
                _logger.LogInformation("Route id {RouteId} does not match body id {BodyId}.", settingId, setting.Id);
                return BadRequest("Route id does not match setting id in body.");
            }

            var updatedSetting = await _settingsService.UpdateSetting(setting);

            if (updatedSetting == null)
            {
                _logger.LogInformation("Unable to update setting with ID {SettingId}.", settingId);
                return BadRequest($"Unable to update setting with ID {settingId}.");
            }

            return Ok(updatedSetting);
        }
    }
}
