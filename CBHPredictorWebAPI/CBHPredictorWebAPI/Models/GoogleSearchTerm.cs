﻿namespace CBHPredictorWebAPI.Models
{
    public class GoogleSearchTerm
    {
        public Guid id { get; set; }
        public string? terms { get; set; }
        public int? impressions { get; set; }
        public int? clicks { get; set; }
        public string? month { get; set; }
        public int? year { get; set; }
    }
}
