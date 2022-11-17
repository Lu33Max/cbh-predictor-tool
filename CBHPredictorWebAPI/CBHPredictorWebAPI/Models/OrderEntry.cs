namespace CBHPredictorWebAPI.Models
{
    public class OrderEntry
    {
        public Guid id { get; set; }
        public int orderID { get; set; }
        public int productID { get; set; }
        public float quantity { get; set; }
        public string supplierSampleID { get; set; }
        public string cbhSampleID { get; set; }
        public int supplierID { get; set; }
        public string matrix { get; set; }
        public int supplierCountryID { get; set; }
        public string unit { get; set; }
        public string storageTemp { get; set; }
        public int customerID { get; set; }
    }
}
