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

        // Reads all Data from the Input Table and writes it to the LeadEntries Table
        [HttpPost]
        [Route("/LeadTable")]
        public async Task<string> LeadImport(IFormFile file)
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

                    if (result.Tables[0].Columns[0].ToString().Equals("leadid"))
                    {
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
            using (var stream = new MemoryStream())
            {
                await file.CopyToAsync(stream);

                using (IExcelDataReader reader = ExcelReaderFactory.CreateReader(stream))
                {
                    DataSet result = reader.AsDataSet(new ExcelDataSetConfiguration()
                    {
                        ConfigureDataTable = (_) => new ExcelDataTableConfiguration() { UseHeaderRow = true }
                    });

                    if (result.Tables[0].Columns[0].ToString().Equals("customerid"))
                    {
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

        [HttpPost]
        [Route("/GoogleTable/{_month}/{_year}")]
        public async Task<string> GoogleSearchTermsImport(IFormFile file, Month _month, int _year)
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

                    string month = ConvertEnum(_month);
                    string _date = _year.ToString() + "-" + month;

                    string delcmd = "SELECT * FROM GoogleSearchTerms WHERE date = {0}";
                    await _context.GoogleSearchTerms.FromSqlRaw(delcmd, _date).ExecuteDeleteAsync();

                    await _context.SaveChangesAsync();

                    if (result.Tables[0].Columns[0].ToString().Equals("Terms"))
                    {
                        foreach (DataRow row in result.Tables[0].Rows)
                        {
                            if (_context.GoogleSearchTerms.Where(e => (e.terms == ConvertToString(row["Terms"])) && (e.date == _date)).Any())
                            {
                                string command = "SELECT * FROM GoogleSearchTerms WHERE terms = {0} AND date = {1}";
                                GoogleSearchTerm? tempTerm = await _context.GoogleSearchTerms.FromSqlRaw(command, ConvertToString(row["Terms"]), _date).FirstOrDefaultAsync();
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
                    else
                    {
                        foreach (DataRow row in result.Tables[0].Rows)
                        {
                            if (_context.GoogleSearchTerms.Where(e => (e.terms == ConvertToString(row["terms"])) && (e.date == _date)).Any())
                            {
                                string command = "SELECT * FROM GoogleSearchTerms WHERE terms = {0} AND date = {1}";
                                GoogleSearchTerm? tempTerm = await _context.GoogleSearchTerms.FromSqlRaw(command, ConvertToString(row["terms"]), _date).FirstOrDefaultAsync();
                                _context.GoogleSearchTerms.FromSqlRaw(command, ConvertToString(row["terms"]), _date).ExecuteDelete();

                                tempTerm.impressions += ConvertToInt(row["impressions"]);
                                tempTerm.clicks += ConvertToInt(row["clicks"]);

                                _context.Add(tempTerm);
                                await _context.SaveChangesAsync();
                            }
                            else
                            {
                                GoogleSearchTerm order = new GoogleSearchTerm()
                                {
                                    id = Guid.NewGuid(),
                                    terms = ConvertToString(row["terms"]),
                                    impressions = ConvertToInt(row["impressions"]),
                                    clicks = ConvertToInt(row["clicks"]),
                                    date = _date
                                };

                                _context.Add(order);
                                await _context.SaveChangesAsync();
                            }
                        }
                    }
                }
            }
            return "{\"success\":1}";
        }

        [HttpPost]
        [Route("/BingTable/{_month}/{_year}")]
        public async Task<string> BingSearchTermsImport(IFormFile file, Month _month, int _year)
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

                    string month = ConvertEnum(_month);
                    string _date = _year.ToString() + "-" + month;

                    string delcmd = "SELECT * FROM BingSearchTerms WHERE date = {0}";
                    await _context.BingSearchTerms.FromSqlRaw(delcmd, _date).ExecuteDeleteAsync();

                    await _context.SaveChangesAsync();

                    if (result.Tables[0].Columns[0].ToString().Equals("Search term"))
                    {
                        foreach (DataRow row in result.Tables[0].Rows)
                        {
                            if (_context.BingSearchTerms.Where(e => (e.terms == ConvertToString(row["Search term"])) && (e.date == _date)).Any())
                            {
                                string command = "SELECT * FROM BingSearchTerms WHERE terms = {0} AND date = {1}";
                                BingSearchTerm? tempTerm = await _context.BingSearchTerms.FromSqlRaw(command, ConvertToString(row["Search term"]), _date).FirstOrDefaultAsync();
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
                    else
                    {
                        foreach (DataRow row in result.Tables[0].Rows)
                        {
                            if (_context.BingSearchTerms.Where(e => (e.terms == ConvertToString(row["terms"])) && (e.date == _date)).Any())
                            {
                                string command = "SELECT * FROM BingSearchTerms WHERE terms = {0} AND date = {1}";
                                BingSearchTerm? tempTerm = await _context.BingSearchTerms.FromSqlRaw(command, ConvertToString(row["terms"]), _date).FirstOrDefaultAsync();
                                _context.BingSearchTerms.FromSqlRaw(command, ConvertToString(row["terms"]), _date).ExecuteDelete();

                                tempTerm.impressions += ConvertToInt(row["impressions"]);
                                tempTerm.clicks += ConvertToInt(row["clicks"]);

                                _context.Add(tempTerm);
                                await _context.SaveChangesAsync();
                            }
                            else
                            {
                                BingSearchTerm searchTerm = new BingSearchTerm()
                                {
                                    id = Guid.NewGuid(),
                                    terms = ConvertToString(row["terms"]),
                                    impressions = ConvertToInt(row["impressions"]),
                                    clicks = ConvertToInt(row["clicks"]),
                                    date = _date
                                };

                                _context.Add(searchTerm);
                                await _context.SaveChangesAsync();
                            }
                        }
                    }
                }
            }
            await _context.SaveChangesAsync();
            return "{\"success\":1}";
        }

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