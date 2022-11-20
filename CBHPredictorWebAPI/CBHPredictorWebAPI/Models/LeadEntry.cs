using MessagePack;

namespace CBHPredictorWebAPI.Models
{
    public class LeadEntry
    {
        public Guid id { get; set; }
        public int? leadID { get; set; }
        public string? leadNo { get; set; }
        public string? leadStatus { get; set; }
        public DateTime? leadDate { get; set; }
        public int? organisationID { get; set; }
        public int? countryID { get; set; }
        public int? channel { get; set; }
        public string? fieldOfInterest { get; set; }
        public string? specificOfInterest { get; set; }
        public string? paramOfInterest { get; set; }
        public string? diagnosisOfInterest { get; set; }
        public string? matrixOfInterest { get; set; }
        public string? quantityOfInterest { get; set; }
    }
}
