using cash_register_backend.DTOs;

namespace cash_register_backend.Services
{
    public interface ISettingsService
    {
        Task<SettingDTO?> UpdateSetting(SettingDTO updatedSetting);
        Task<SettingDTO?> GetSetting(int settingId);
        Task<List<CurrencyDTO>> GetAllCurrencies();
    }
}
