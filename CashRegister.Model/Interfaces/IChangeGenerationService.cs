using System;
using System.Collections.Generic;
using System.Text;

namespace CashRegister.Model.Interfaces
{
    public interface IChangeGenerationService
    {
        string GenerateChange(ISettings settings);
    }
}
