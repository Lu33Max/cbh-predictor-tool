using CBHPredictorWebAPI.Data;
using CBHPredictorWebAPI.Models;
using ExcelDataReader;
using Microsoft.AspNetCore.Mvc;
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

        // Reads all Data from the Input Table and writes it to the LeadEntries Table
        [HttpPost]
        [Route("/LeadTable")]
        public async Task<String> LeadImport(IFormFile file)
        {
            var list = new List<LeadEntry>();

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
                            quantityOfInterest = ConvertToString(row["Quantity_of_interest"]),
                            lastEdited = DateTime.Now
                        };

                        list.Add(lead);
                        _context.Add(lead);
                    }
                }
            }
            await _context.SaveChangesAsync();
            return "Done";
        }

        // Reads all Data from the Input Table and writes it to the OrderEntries Table
        [HttpPost]
        [Route("/OrderTable")]
        public async Task<String> OrderImport(IFormFile file)
        {
            var list = new List<OrderEntry>();

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
                            collectionDate = ConvertToDate(row["Date_of_Collection"]),
                            lastEdited = DateTime.Now
                        };

                        list.Add(order);
                        _context.Add(order);
                    }
                }
            }
            await _context.SaveChangesAsync();
            return "Done";
        }

        [HttpPost]
        [Route("/GoogleTable")]
        public async Task<String> GoogleSearchTermsImport(IFormFile file, Month _month, int _year)
        {
            var list = new List<GoogleSearchTerm>();

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
                        GoogleSearchTerm order = new GoogleSearchTerm()
                        {
                            id = Guid.NewGuid(),
                            terms = ConvertToString(row["Terms"]),
                            impressions = ConvertToInt(row["Impressions"]),
                            clicks = ConvertToInt(row["Clicks"]),
                            month = _month.ToString(),
                            year = _year
                        };

                        list.Add(order);
                        _context.Add(order);
                    }
                }
            }
            await _context.SaveChangesAsync();
            return "Done";
        }

        [HttpPost]
        [Route("/BingTable")]
        public async Task<String> BingSearchTermsImport(IFormFile file, Month _month, int _year)
        {
            var list = new List<BingSearchTerm>();

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
                        BingSearchTerm order = new BingSearchTerm()
                        {
                            id = Guid.NewGuid(),
                            terms = ConvertToString(row["Search term"]),
                            impressions = ConvertToInt(row["Impr."]),
                            clicks = ConvertToInt(row["Clicks"]),
                            month = _month.ToString(),
                            year = _year
                        };

                        list.Add(order);
                        _context.Add(order);
                    }
                }
            }
            await _context.SaveChangesAsync();
            return "Done";
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
