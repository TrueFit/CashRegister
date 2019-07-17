namespace CashRegister.UI
{
    /// <summary>
    /// ID class for Layout enumerations
    /// </summary>
    public class LayoutId
    {
        public LayoutId(int id, string name)
        {
            Id = id;
            Name = name;
        }

        public int Id { get; set; }
        public string Name { get; set; }
    }
}
