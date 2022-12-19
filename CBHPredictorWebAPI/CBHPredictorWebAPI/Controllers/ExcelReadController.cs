using CBHPredictorWebAPI.Data;
using CBHPredictorWebAPI.Models;
using ExcelDataReader;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace CBHPredictorWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExcelReadController : ControllerBase
    {
        private readonly CBHDBContext _context;
        public enum Month { Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec }

        public ExcelReadController(CBHDBContext context)
        {
            _context = context;
        }

        private int ConvertEnum(Month _month)
        {
            int month = Array.IndexOf(Enum.GetValues(_month.GetType()), _month) + 1;
            return month;
        }

        // Reads all Data from the Input Table and writes it to the LeadEntries Table
        [HttpPost]
        [Route("/LeadTable")]
        public async Task<String> LeadImport(IFormFile file)
        {
            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);
            using (var stream = new MemoryStream())
            {
                await file.CopyToAsync(stream);

                using (IExcelDataReader reader = ExcelReaderFactory.CreateReader(stream))
                {
                    DataSet result = reader.AsDataSet(new ExcelDataSetConfiguration()
                    {
                        ConfigureDataTable = (_) => new ExcelDataTableConfiguration() { UseHeaderRow = true }
                    });

                    foreach (DataRow row in result.Tables[0].Rows) {
                        if (!_context.LeadEntries.Any(e => e.leadID == ConvertToInt(row["leadid"])))
                        {
                            LeadEntry lead = new LeadEntry()
                            {
                                id = Guid.NewGuid(),
                                leadID = ConvertToInt(row["leadid"]),
                                leadNo = ConvertToString(row["Lead_No"]),
                                leadStatus = ConvertToString(row["Lead_Status"]),
                                leadDate = ConvertToDate(row["Lead_Date"]),
                                organisationID = ConvertToInt(row["Organisation Id"]),
                                countryID = ConvertToInt(row["Countryid"]),
                                channel = ConvertToInt(row["Channel"]),
                                fieldOfInterest = ConvertToString(row["Field_of_interest"]),
                                specificOfInterest = ConvertToString(row["Specifications_of_interest"]),
                                paramOfInterest = ConvertToString(row["Parameter_of_interest"]),
                                diagnosisOfInterest = ConvertToString(row["Diagnosis_of_interest"]),
                                matrixOfInterest = ConvertToString(row["Matrix_of_interest"]),
                                quantityOfInterest = ConvertToString(row["Quantity_of_interest"])
                            };

                            _context.Add(lead);
                        }
                    }
                }
            }
            await _context.SaveChangesAsync();
            return "{\"success\":1}";
        }

        // Reads all Data from the Input Table and writes it to the OrderEntries Table
        [HttpPost]
        [Route("/OrderTable")]
        public async Task<String> OrderImport(IFormFile file)
        {
            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);
            using (var stream = new MemoryStream())
            {
                await file.CopyToAsync(stream);

                using (IExcelDataReader reader = ExcelReaderFactory.CreateReader(stream))
                {
                    DataSet result = reader.AsDataSet(new ExcelDataSetConfiguration()
                    {
                        ConfigureDataTable = (_) => new ExcelDataTableConfiguration() { UseHeaderRow = true }
                    });

                    foreach (DataRow row in result.Tables[0].Rows) {

                        if (!_context.OrderEntries.Any(e => e.cbhSampleID == ConvertToString(row["CBH_sample_id"])))
                        {
                            OrderEntry order = new OrderEntry()
                            {
                                id = Guid.NewGuid(),
                                customerID = ConvertToInt(row["customerid"]),
                                orderID = ConvertToInt(row["Orderid"]),
                                orderDate = ConvertToDate(row["OrderDate"]),
                                orderPrice = ConvertToInt(row["price_CBH"]),
                                storageTemp = ConvertToString(row["Storage_Temperature"]),
                                donorID = ConvertToString(row["CBH_Donor_ID"]),
                                cbhSampleID = ConvertToString(row["CBH_sample_id"]),
                                matrix = ConvertToString(row["Matrix"]),
                                supplierID = ConvertToInt(row["Supplierid"]),
                                supplierSampleID = ConvertToString(row["Supplier_Sample_ID"]),
                                productID = ConvertToInt(row["pid"]),
                                countryID = ConvertToInt(row["country"]),
                                quantity = ConvertToFloat(row["Quantity"]),
                                unit = ConvertToString(row["Unit"]),
                                age = ConvertToInt(row["Age"]),
                                gender = ConvertToString(row["Gender"]),
                                ethnicity = ConvertToString(row["Ethnicity"]),
                                labParameter = ConvertToString(row["Lab_Parameter"]),
                                resultNumerical = ConvertToDecimal(row["Result_Numerical"]),
                                resultUnit = ConvertToString(row["Result_Unit"]),
                                resultInterpretation = ConvertToString(row["Result_Interpretation"]),
                                testMethod = ConvertToString(row["Test_Method"]),
                                testKitManufacturer = ConvertToString(row["Test_Kit_Manufacturer"]),
                                testSystemManufacturer = ConvertToString(row["Test_System_Manufacturer"]),
                                diagnosis = ConvertToString(row["Diagnosis"]),
                                icd = ConvertToString(row["ICD_Code"]),
                                histologicalDiagnosis = ConvertToString(row["Histological_Diagnosis"]),
                                organ = ConvertToString(row["Organ"]),
                                collectionCountry = ConvertToString(row["Country_of_Collection"]),
                                collectionDate = ConvertToDate(row["Date_of_Collection"])
                            };

                            _context.Add(order);
                        }
                    }
                }
            }
            await _context.SaveChangesAsync();
            return "{\"success\":1}";
        }

        [HttpPost]
        [Route("/GoogleTable/{_month}/{_year}")]
        public async Task<String> GoogleSearchTermsImport(IFormFile file, Month _month, int _year)
        {
            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);
            using (var stream = new MemoryStream())
            {
                await file.CopyToAsync(stream);

                using (IExcelDataReader reader = ExcelReaderFactory.CreateReader(stream))
                {
                    DataSet result = reader.AsDataSet(new ExcelDataSetConfiguration()
                    {
                        ConfigureDataTable = (_) => new ExcelDataTableConfiguration() { UseHeaderRow = true }
                    });

                    foreach (DataRow row in result.Tables[0].Rows)
                    {
                        int month = ConvertEnum(_month);
                        string _date = _year.ToString() + "-" + month;

                        if (_context.GoogleSearchTerms.Where(e => (e.terms == ConvertToString(row["Terms"])) && (e.date == _date)).Any())
                        {
                            string command = "SELECT * FROM GoogleSearchTerms WHERE terms = {0} AND date = {1}";
                            GoogleSearchTerm tempTerm = _context.GoogleSearchTerms.FromSqlRaw(command, ConvertToString(row["Terms"]), _date).FirstOrDefault();
                            _context.GoogleSearchTerms.FromSqlRaw(command, ConvertToString(row["Terms"]), _date).ExecuteDelete();

                            tempTerm.impressions += ConvertToInt(row["Impressions"]);
                            tempTerm.clicks += ConvertToInt(row["Clicks"]);

                            _context.Add(tempTerm);
                            await _context.SaveChangesAsync();
                        }
                        else
                        {
                            GoogleSearchTerm order = new GoogleSearchTerm()
                            {
                                id = Guid.NewGuid(),
                                terms = ConvertToString(row["Terms"]),
                                impressions = ConvertToInt(row["Impressions"]),
                                clicks = ConvertToInt(row["Clicks"]),
                                date = _date
                            };

                            _context.Add(order);
                            await _context.SaveChangesAsync();
                        }
                    }
                }
            }
            return "{\"success\":1}";
        }

        [HttpPost]
        [Route("/BingTable/{_month}/{_year}")]
        public async Task<String> BingSearchTermsImport(IFormFile file, Month _month, int _year)
        {
            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);
            using (var stream = new MemoryStream())
            {
                await file.CopyToAsync(stream);

                using (IExcelDataReader reader = ExcelReaderFactory.CreateReader(stream))
                {
                    DataSet result = reader.AsDataSet(new ExcelDataSetConfiguration()
                    {
                        ConfigureDataTable = (_) => new ExcelDataTableConfiguration() { UseHeaderRow = true }
                    });

                    foreach (DataRow row in result.Tables[0].Rows)
                    {
                        int month = ConvertEnum(_month);
                        string _date = _year.ToString() + "-" + month;

                        if (_context.BingSearchTerms.Where(e => (e.terms == ConvertToString(row["Search term"])) && (e.date == _date)).Any())
                        {
                            string command = "SELECT * FROM BingSearchTerms WHERE terms = {0} AND date = {1}";
                            BingSearchTerm tempTerm = _context.BingSearchTerms.FromSqlRaw(command, ConvertToString(row["Search term"]), _date).FirstOrDefault();
                            _context.BingSearchTerms.FromSqlRaw(command, ConvertToString(row["Search term"]), _date).ExecuteDelete();

                            tempTerm.impressions += ConvertToInt(row["Impr."]);
                            tempTerm.clicks += ConvertToInt(row["Clicks"]);

                            _context.Add(tempTerm);
                            await _context.SaveChangesAsync();
                        }
                        else
                        {
                            BingSearchTerm searchTerm = new BingSearchTerm()
                            {
                                id = Guid.NewGuid(),
                                terms = ConvertToString(row["Search term"]),
                                impressions = ConvertToInt(row["Impr."]),
                                clicks = ConvertToInt(row["Clicks"]),
                                date = _date
                            };

                            _context.Add(searchTerm);
                            await _context.SaveChangesAsync();
                        }
                    }
                }
            }
            await _context.SaveChangesAsync();
            return "{\"success\":1}";
        }

        //// Converter Functions // Check for Null Values
        public static int? ConvertToInt(object obj)
        {
            if (obj == null || obj == DBNull.Value || obj is string)
            {
                return null;
            }
            else
            {
                return Convert.ToInt32(obj);
            }
        }
        public static float? ConvertToFloat(object obj)
        {
            if (obj == null || obj == DBNull.Value)
            {
                return null;
            }
            else
            {
                return Convert.ToSingle(obj);
            }
        }
        public static decimal? ConvertToDecimal (object obj)
        {
            if (obj == null || obj == DBNull.Value || obj is string)
            {
                return null;
            }
            else
            {
                return Convert.ToDecimal(obj);
            }
        }
        public static string? ConvertToString(object obj)
        {
            if (obj == null || obj == DBNull.Value)
            {
                return null;
            }
            else
            {
                if (obj.ToString().Equals("NULL"))
                {
                    return null;
                }
                else
                {
                    return obj.ToString();
                }
            }
        }
        public static DateTime? ConvertToDate(object obj)
        {
            if (DateTime.TryParse(obj.ToString(), out DateTime temp))
            {
                return temp;
            }

            return null;
        }
    }
}
