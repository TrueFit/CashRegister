using System.Collections.Generic;
using System.Linq;
using cash_register_backend.DTOs;
using Microsoft.EntityFrameworkCore;

namespace cash_register_backend.Services
{
    public class SettingsService : ISettingsService
    {
        private readonly ILogger<SettingsService> _logger;
        private readonly IAppDbContext _context;

        public SettingsService(ILogger<SettingsService> logger, IAppDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        public async Task<SettingDTO?> UpdateSetting(SettingDTO updatedSetting)
        {
            var currentSetting = await _context.Settings.FirstOrDefaultAsync(s => s.Id == updatedSetting.Id);
            if (currentSetting != null)
            {
                currentSetting.Currency = updatedSetting.Currency;
                await _context.SaveChangesAsync();
                return new SettingDTO
                {
                    Id = currentSetting.Id,
                    Currency = currentSetting.Currency
                };
            }
            else
            {
                return null;
            }
            
        }

        public async Task<SettingDTO?> GetSetting(int settingId)
        {
            var setting = await _context.Settings.Include(s => s.Currency).FirstOrDefaultAsync(s => s.Id == settingId);
            //usually would use an automapper here
            if(setting != null)
                {
                return new SettingDTO
                {
                    Id = setting.Id,
                    Currency = setting.Currency
                };
            }
            else
            {
                return null;
            }

        }

        public async Task<List<CurrencyDTO>> GetAllCurrencies()
        {
            var currencies = await _context.Currencies
                .Include(c => c.Denominations)
                .ToListAsync();

            if (currencies == null || currencies.Count == 0)
            {
                return new List<CurrencyDTO>();
            }

            var result = currencies
                .Select(c => new CurrencyDTO
                {
                    Id = c.Id,
                    Name = c.Name,
                    Denominations = c.Denominations
                        .Select(d => new DenominationDTO
                        {
                            Id = d.Id,
                            Name = d.Name,
                            Value = d.Value
                        })
                        .OrderByDescending(d => d.Value)
                        .ToList()
                })
                .ToList();

            return result;
        }
    }
}
