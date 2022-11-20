using CBHPredictorWebAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;

namespace CBHPredictorWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExcelReadController : ControllerBase
    {
        [HttpPost]
        public async Task<List<LeadEntry>> Import(IFormFile file)
        {
            var list = new List<LeadEntry>();
            using (var stream = new MemoryStream())
            {
                await file.CopyToAsync(stream);

                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                using (var package = new ExcelPackage(stream))
                {
                    ExcelWorksheet worksheet = package.Workbook.Worksheets[0];
                    var rowCount = worksheet.Dimension.Rows;
                    for(int row = 2; row < rowCount; row++)
                    {
                        list.Add(new LeadEntry() { 
                            leadID= Convert.ToInt32(worksheet.Cells[row,1].Value),
                            leadNo= worksheet.Cells[row,2].Value.ToString(),
                            leadStatus= worksheet.Cells[row,3].Value.ToString(),
                            leadDate = (DateTime)worksheet.Cells[row,4].Value,
                            organisationID = Convert.ToInt32(worksheet.Cells[row,5].Value),
                            countryID = Convert.ToInt32(worksheet.Cells[row,6].Value),
                            channel= Convert.ToInt32(worksheet.Cells[row,7].Value),
                            fieldOfInterest= worksheet.Cells[row,8].Value.ToString(),
                            specificOfInterest= worksheet.Cells[row,9].Value.ToString(),
                            paramOfInterest= worksheet.Cells[row,10].Value.ToString(),
                            diagnosisOfInterest= worksheet.Cells[row,11].Value.ToString(),
                            matrixOfInterest= worksheet.Cells[row,12].Value.ToString(),
                            quantityOfInterest = worksheet.Cells[row,13].Value.ToString()
                        });
                    }
                }    
            }
            return list;
        }
    }
}
