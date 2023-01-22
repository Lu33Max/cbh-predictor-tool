namespace CBHPredictorWebAPI.Models.OrderModels
{
    public class OrderPriceResponse
    {
        public string? id { get; set; }
        public string? group { get; set; }
        public int? price { get; set; }
        public int? volume { get; set; }
    }
}
