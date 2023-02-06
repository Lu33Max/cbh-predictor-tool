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

        // Converts input month string to number
        private string ConvertEnum(Month _month)
        {
            int temp = Array.IndexOf(Enum.GetValues(_month.GetType()), _month) + 1;
            string month = temp.ToString();

            if (temp <= 9)
            {
                month = "0" + temp.ToString();
            }

            return month;
        }

        // Reads all Data from the Input Table and writes it to the BingSearchTerms Table
        [HttpPost]
        [Route("/BingTable/{_month}/{_year}")]
        public async Task<string> BingSearchTermsImport(IFormFile file, Month _month, int _year)
        {
            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);

            // Opens a new stream
            using (var stream = new MemoryStream())
            {
                // Copies the file to the stream
                await file.CopyToAsync(stream);

                using (IExcelDataReader reader = ExcelReaderFactory.CreateReader(stream))
                {
                    // Converts the input file to a dataset
                    DataSet result = reader.AsDataSet(new ExcelDataSetConfiguration()
                    {
                        ConfigureDataTable = (_) => new ExcelDataTableConfiguration() { UseHeaderRow = true }
                    });

                    // Creates the date property of all new input values
                    string month = ConvertEnum(_month);
                    string _date = _year.ToString() + "-" + month;

                    // Deletes all old entries with that date to avoid duplicates
                    await _context.BingSearchTerms.Where(e => e.date == _date).ExecuteDeleteAsync();
                    await _context.SaveChangesAsync();

                    // Tests wether the input table is an original CBH table or a table created by the tool depending on the content of the first header cell
                    if (result.Tables[0].Columns[0].ToString().Equals("Search term"))
                    {
                        foreach (DataRow row in result.Tables[0].Rows)
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
                        }
                    }
                    // The same as above but for tool-created tables
                    else
                    {
                        foreach (DataRow row in result.Tables[0].Rows)
                        {
                            BingSearchTerm searchTerm = new BingSearchTerm()
                            {
                                id = Guid.NewGuid(),
                                terms = ConvertToString(row["terms"]),
                                impressions = ConvertToInt(row["impressions"]),
                                clicks = ConvertToInt(row["clicks"]),
                                date = ConvertToString(row["date"]) ?? _date
                            };

                            _context.Add(searchTerm);
                        }
                    }
                }
            }
            await _context.SaveChangesAsync();
            return "{\"success\":1}";
        }

        // Reads all Data from the Input Table and writes it to the GoogleSearchTerms Table
        [HttpPost]
        [Route("/GoogleTable/{_month}/{_year}")]
        public async Task<string> GoogleSearchTermsImport(IFormFile file, Month _month, int _year)
        {
            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);

            // Opens new stream
            using (var stream = new MemoryStream())
            {
                // Copies file to stream
                await file.CopyToAsync(stream);

                using (IExcelDataReader reader = ExcelReaderFactory.CreateReader(stream))
                {
                    // Converts the input file to a dataset
                    DataSet result = reader.AsDataSet(new ExcelDataSetConfiguration()
                    {
                        ConfigureDataTable = (_) => new ExcelDataTableConfiguration() { UseHeaderRow = true }
                    });

                    // Creates the date property of all new input values
                    string month = ConvertEnum(_month);
                    string _date = _year.ToString() + "-" + month;

                    // Deletes all old entries with that date to avoid duplicates
                    await _context.GoogleSearchTerms.Where(e => e.date== _date).ExecuteDeleteAsync();
                    await _context.SaveChangesAsync();

                    // Tests wether the input table is an original CBH table or a table created by the tool depending on the content of the first header cell
                    if (result.Tables[0].Columns[0].ToString().Equals("Terms"))
                    {
                        // Goes through the dataset row-by-row and creates a new entry in the database
                        foreach (DataRow row in result.Tables[0].Rows)
                        {
                            GoogleSearchTerm term = new GoogleSearchTerm()
                            {
                                id = Guid.NewGuid(),
                                terms = ConvertToString(row["Terms"]),
                                impressions = ConvertToInt(row["Impressions"]),
                                clicks = ConvertToInt(row["Clicks"]),
                                date = _date
                            };

                            _context.Add(term);
                        }
                    }
                    // The same as above but for tool-created tables
                    else
                    {
                        foreach (DataRow row in result.Tables[0].Rows)
                        {
                            GoogleSearchTerm order = new GoogleSearchTerm()
                            {
                                id = Guid.NewGuid(),
                                terms = ConvertToString(row["terms"]),
                                impressions = ConvertToInt(row["impressions"]),
                                clicks = ConvertToInt(row["clicks"]),
                                date = ConvertToString(row["date"]) ?? _date
                            };

                            _context.Add(order);
                        }
                    }
                }
            }
            await _context.SaveChangesAsync();
            return "{\"success\":1}";
        }

        // Reads all Data from the Input Table and writes it to the LeadEntries Table
        [HttpPost]
        [Route("/LeadTable")]
        public async Task<string> LeadImport(IFormFile file)
        {
            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);

            // Opens new stream
            using (var stream = new MemoryStream())
            {
                // Copies file to stream
                await file.CopyToAsync(stream);

                using (IExcelDataReader reader = ExcelReaderFactory.CreateReader(stream))
                {
                    // Converts the input file to a dataset
                    DataSet result = reader.AsDataSet(new ExcelDataSetConfiguration()
                    {
                        ConfigureDataTable = (_) => new ExcelDataTableConfiguration() { UseHeaderRow = true }
                    });

                    // Tests wether the input table is an original CBH table or a table created by the tool depending on the content of the first header cell
                    if (result.Tables[0].Columns[0].ToString().Equals("leadid"))
                    {
                        // Goes through the dataset row-by-row and creates a new entry in the database if no other entry with the same leadID already exists
                        foreach (DataRow row in result.Tables[0].Rows)
                        {
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
                    // The same as above but for tool-created tables
                    else
                    {
                        foreach (DataRow row in result.Tables[0].Rows)
                        {
                            if (!_context.LeadEntries.Any(e => e.leadID == ConvertToInt(row["leadID"])))
                            {
                                LeadEntry lead = new LeadEntry()
                                {
                                    id = Guid.NewGuid(),
                                    leadID = ConvertToInt(row["leadID"]),
                                    leadNo = ConvertToString(row["leadNo"]),
                                    leadStatus = ConvertToString(row["leadStatus"]),
                                    leadDate = ConvertToDate(row["leadDate"]),
                                    organisationID = ConvertToInt(row["organisationID"]),
                                    countryID = ConvertToInt(row["countryID"]),
                                    channel = ConvertToInt(row["channel"]),
                                    fieldOfInterest = ConvertToString(row["fieldOfInterest"]),
                                    specificOfInterest = ConvertToString(row["specificOfInterest"]),
                                    paramOfInterest = ConvertToString(row["paramOfInterest"]),
                                    diagnosisOfInterest = ConvertToString(row["diagnosisOfInterest"]),
                                    matrixOfInterest = ConvertToString(row["matrixOfInterest"]),
                                    quantityOfInterest = ConvertToString(row["quantityOfInterest"])
                                };

                                _context.Add(lead);
                            }
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
        public async Task<string> OrderImport(IFormFile file)
        {
            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);

            // Opens new stream
            using (var stream = new MemoryStream())
            {
                // Copies file to stream
                await file.CopyToAsync(stream);

                using (IExcelDataReader reader = ExcelReaderFactory.CreateReader(stream))
                {
                    // Converts the input file to a dataset
                    DataSet result = reader.AsDataSet(new ExcelDataSetConfiguration()
                    {
                        ConfigureDataTable = (_) => new ExcelDataTableConfiguration() { UseHeaderRow = true }
                    });

                    // Tests wether the input table is an original CBH table or a table created by the tool depending on the content of the first header cell
                    if (result.Tables[0].Columns[0].ToString().Equals("customerid"))
                    {
                        // Goes through the dataset row-by-row and creates a new entry in the database if no other entry with the same Sample ID already exists
                        foreach (DataRow row in result.Tables[0].Rows)
                        {
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
                    // The same as above but for tool-created tables
                    else
                    {
                        foreach (DataRow row in result.Tables[0].Rows)
                        {
                            if (!_context.OrderEntries.Any(e => e.cbhSampleID == ConvertToString(row["cbhSampleID"])))
                            {
                                OrderEntry order = new OrderEntry()
                                {
                                    id = Guid.NewGuid(),
                                    customerID = ConvertToInt(row["customerID"]),
                                    orderID = ConvertToInt(row["orderID"]),
                                    orderDate = ConvertToDate(row["orderDate"]),
                                    orderPrice = ConvertToInt(row["orderPrice"]),
                                    storageTemp = ConvertToString(row["storageTemp"]),
                                    donorID = ConvertToString(row["donorID"]),
                                    cbhSampleID = ConvertToString(row["cbhSampleID"]),
                                    matrix = ConvertToString(row["matrix"]),
                                    supplierID = ConvertToInt(row["supplierID"]),
                                    supplierSampleID = ConvertToString(row["supplierSampleID"]),
                                    productID = ConvertToInt(row["productID"]),
                                    countryID = ConvertToInt(row["countryID"]),
                                    quantity = ConvertToFloat(row["quantity"]),
                                    unit = ConvertToString(row["unit"]),
                                    age = ConvertToInt(row["age"]),
                                    gender = ConvertToString(row["gender"]),
                                    ethnicity = ConvertToString(row["ethnicity"]),
                                    labParameter = ConvertToString(row["labParameter"]),
                                    resultNumerical = ConvertToDecimal(row["resultNumerical"]),
                                    resultUnit = ConvertToString(row["resultUnit"]),
                                    resultInterpretation = ConvertToString(row["resultInterpretation"]),
                                    testMethod = ConvertToString(row["testMethod"]),
                                    testKitManufacturer = ConvertToString(row["testKitManufacturer"]),
                                    testSystemManufacturer = ConvertToString(row["testSystemManufacturer"]),
                                    diagnosis = ConvertToString(row["diagnosis"]),
                                    icd = ConvertToString(row["icd"]),
                                    histologicalDiagnosis = ConvertToString(row["histologicalDiagnosis"]),
                                    organ = ConvertToString(row["organ"]),
                                    collectionCountry = ConvertToString(row["collectionCountry"]),
                                    collectionDate = ConvertToDate(row["collectionDate"])
                                };

                                _context.Add(order);
                            }
                        }
                    }

                }
            }
            await _context.SaveChangesAsync();
            return "{\"success\":1}";
        }

        //-------------------------------------------------------------UTILITY---------------------------------------------------------------------//
        //// Converter Functions // Check for Null Values
        private static int? ConvertToInt(object obj)
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
        private static float? ConvertToFloat(object obj)
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
        private static decimal? ConvertToDecimal(object obj)
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
        private static string? ConvertToString(object obj)
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
        private static DateTime? ConvertToDate(object obj)
        {
            if (DateTime.TryParse(obj.ToString(), out DateTime temp))
            {
                return temp;
            }

            return null;
        }
    }
}