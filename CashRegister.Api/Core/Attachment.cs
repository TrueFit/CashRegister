namespace CashRegister.Api.Core
{
    public class Attachment
    {
        public byte[] Data { get; set; }
        public string FileName { get; set; }
        public string ContentType { get; set; }
    }
}
