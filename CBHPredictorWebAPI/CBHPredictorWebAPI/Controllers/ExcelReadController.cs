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

                using(IExcelDataReader reader = ExcelReaderFactory.CreateReader(stream))
                {
                    DataSet result = reader.AsDataSet(new ExcelDataSetConfiguration()
                    {
                        ConfigureDataTable = (_) => new ExcelDataTableConfiguration() { UseHeaderRow = true }
                    });

                    foreach(DataRow row in result.Tables[0].Rows) {
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
                            orderID = ConvertToInt(row["orderid"]),
                            productID = ConvertToInt(row["productid"]),
                            quantity = ConvertToFloat(row["qty"]),
                            supplierSampleID = ConvertToString(row["Supplier_Sample_ID"]),
                            cbhSampleID = ConvertToString(row["CBH_sample_id"]),
                            supplierID = ConvertToInt(row["supplierid"]),
                            matrix = ConvertToString(row["matrix"]),
                            supplierCountryID = ConvertToInt(row["Supplier_Countryid"]),
                            unit = ConvertToString(row["unit"]),
                            storageTemp = ConvertToString(row["Storage_Temperature"]),
                            customerID = ConvertToInt(row["Customer Id"])
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
            if (obj == null || obj == DBNull.Value)
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
            if (obj == null || obj == DBNull.Value)
            {
                return null;
            }
            else
            {
                return (DateTime)obj;
            }
        }
    }
}
