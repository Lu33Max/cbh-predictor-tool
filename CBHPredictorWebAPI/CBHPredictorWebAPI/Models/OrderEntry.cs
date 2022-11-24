using Microsoft.EntityFrameworkCore;

namespace CBHPredictorWebAPI.Models
{
    public class OrderEntry
    {
        public Guid id { get; set; }
        public int? customerID { get; set; }
        public int? orderID { get; set; }
        public DateTime? orderDate { get; set; }
        public int? orderPrice { get; set; }
        public string? storageTemp { get; set; }
        public string? donorID { get; set; }
        public string? cbhSampleID { get; set; }
        public string? matrix { get; set; }
        public int? supplierID { get; set; }
        public string? supplierSampleID { get; set; }
        public int? productID { get; set; }
        public int? countryID { get; set; }
        public float? quantity { get; set; }
        public string? unit { get; set; }
        public int? age { get; set; }
        public string? gender { get; set; }
        public string? ethnicity { get; set; }
        public string? labParameter { get; set; }
        [Precision(18, 2)]
        public decimal? resultNumerical { get; set; }
        public string? resultUnit { get; set; }
        public string? resultInterpretation { get; set; }
        public string? testMethod { get; set; }
        public string? testKitManufacturer { get; set; }
        public string? testSystemManufacturer { get; set; }
        public string? diagnosis { get; set; }
        public string? icd { get; set; }
        public string? histologicalDiagnosis { get; set; }
        public string? organ { get; set; }
        public string? collectionCountry { get; set; }
        public DateTime? collectionDate { get; set; }
    }
}
