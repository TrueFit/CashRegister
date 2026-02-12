using cash_register_backend.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace cash_register_backend.Services
{
    public interface ICalculateService
    {
        Task<List<string>?> CalculateChange(CalculateDTO calculateDTO);
    }
}
