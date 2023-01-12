using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CBHPredictorWebAPI.Data;
using CBHPredictorWebAPI.Models;
using System.Text;

namespace CBHPredictorWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BingSearchTermsController : ControllerBase
    {
        private readonly CBHDBContext _context;
        public enum BSearchTerms { terms, impressions, clicks, date }
        public enum Order { ascending, descending }

        public BingSearchTermsController(CBHDBContext context)
        {
            _context = context;
        }

        // GET: api/BingSearchTerms
        // Gets all Entries in the BingSearchTerms Table
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BingSearchTerm>>> GetSearchTerms()
        {
            return await _context.BingSearchTerms.OrderBy(e => e.date).ThenBy(e => e.terms).ToListAsync();
        }

        // GET: api/BingSearchTerms/5
        // Gets one specific Entry in the BingSearchTerms Table by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<BingSearchTerm>> GetSearchTerm([FromRoute]Guid id)
        {
            var searchTerm = await _context.BingSearchTerms.FindAsync(id);

            if (searchTerm == null)
            {
                return NotFound();
            }

            return searchTerm;
        }

        [HttpGet("SortByColumn/{col}/{order}")]
        public async Task<ActionResult<IEnumerable<BingSearchTerm>>> SortByColumn(BSearchTerms col, Order order)
        {
            if (order == Order.ascending)
            {
                return await _context.BingSearchTerms.FromSqlRaw("SELECT * FROM BingSearchTerms ORDER BY [" + col + "] ASC").ToListAsync();
            }
            else
            {
                return await _context.BingSearchTerms.FromSqlRaw("SELECT * FROM BingSearchTerms ORDER BY [" + col + "] DESC").ToListAsync();
            }
        }

        [HttpGet("CountRows")]
        public async Task<int> CountRows()
        {
            var command = new StringBuilder("SELECT * FROM BingSearchTerms WHERE ");
            string? filter = HttpContext.Session.GetString("BingFilter");

            if (string.IsNullOrEmpty(filter))
            {
                List<BingSearchTerm> unfilteredRows = await _context.BingSearchTerms.ToListAsync();
                return unfilteredRows.Count();
            }
            else
            {
                filter = filter.Remove(0, 1);
                string[] filters = filter.Split(";");

                filter = string.Join(" AND ", filters);

                command.Append(filter);
                List<BingSearchTerm> fitleredRows = await _context.BingSearchTerms.FromSqlRaw(command.ToString()).ToListAsync();

                return fitleredRows.Count();
            }
        }

        [HttpGet("GetCurrentMonth")]
        public string selectCurrentMonth()
        {
            int _latestMonth = DateTime.Now.Month;
            string latestMonth = _latestMonth.ToString();
            int latestYear = DateTime.Now.Year;

            if (_latestMonth <= 9)
            {
                latestMonth = "0" + _latestMonth;
            }

            string latestDate = latestYear + "-" + latestMonth;

            while (!_context.BingSearchTerms.Any(e => e.date == latestDate))
            {
                if (_latestMonth != 0)
                {
                    _latestMonth--;
                    latestMonth = _latestMonth.ToString();

                    if (_latestMonth <= 9)
                    {
                        latestMonth = "0" + _latestMonth;
                    }

                    latestDate = latestYear + "-" + latestMonth.ToString();
                }
                else
                {
                    latestYear--;
                    _latestMonth = 12;
                    latestMonth = _latestMonth.ToString();
                    latestDate = latestYear + "-" + latestMonth.ToString();
                }
            }

            return latestDate;
        }

        [HttpGet("ExportToExcel")]
        public async Task<IActionResult> ExportBTermsToExcel()
        {
            try
            {
                List<BingSearchTerm> sheet = await _context.BingSearchTerms.OrderBy(e => e.terms).ToListAsync();
                FileStreamResult fr = ExportToExcel.CreateExcelFile.StreamExcelDocument(sheet, "BingSearchTerms.xlsx");
                return fr;
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(ex);
            }
        }

        // PUT: api/BingSearchTerms/5
        // Edits one specific Entry in the BingSearchTerms Table by ID
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSearchTerm([FromRoute]Guid id, BingSearchTerm bingSearchTerm)
        {
            if (id != bingSearchTerm.id)
            {
                return BadRequest();
            }

            _context.Entry(bingSearchTerm).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SearchTermExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(bingSearchTerm);
        }

        // POST: api/BingSearchTerms
        // Adds one Entry to the BingSearchTerms Table
        [HttpPost]
        public async Task<ActionResult<BingSearchTerm>> PostSearchTerm(BingSearchTerm bingSearchTerm)
        {
            bingSearchTerm.id = Guid.NewGuid();
            await _context.BingSearchTerms.AddAsync(bingSearchTerm);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetSearchTerm", new { id = bingSearchTerm.id }, bingSearchTerm);
        }

        // DELETE: api/BingSearchTerms/5
        // Deletes one specific Entry in the BingSearchTerms Table by ID
        [HttpDelete("{id}")]
        public async Task<string> DeleteSearchTerm(Guid id)
        {
            await _context.BingSearchTerms.Where(e => e.id == id).ExecuteDeleteAsync();
            await _context.SaveChangesAsync();
            return "{\"success\":1}";
        }

        // DELETE: api/LeadEntries
        // Deletes all Entries in the BingSearchTerms Table
        [HttpDelete]
        public async Task<string> DeleteSearchTerms()
        {
            await _context.BingSearchTerms.ExecuteDeleteAsync();
            await _context.SaveChangesAsync();
            return "{\"success\":1}";
        }

        //-------------------------------------------------------------FILTER----------------------------------------------------------------------//
        //---- Apply Filter ----//
        [HttpGet("ApplyFilter/{relation}")]
        public async Task<ActionResult<IEnumerable<BingSearchTerm>>> ApplyFilter(string relation)
        {
            var command = new StringBuilder("SELECT * FROM BingSearchTerms WHERE ");
            string? filter = HttpContext.Session.GetString("BingFilter");

            if (!string.IsNullOrEmpty(filter))
            {
                filter = filter.Remove(0,1);
                string[] filters = filter.Split(";");

                if (relation.Equals("AND"))
                {
                    filter = string.Join(" AND ", filters);
                }
                else
                {
                    filter = string.Join(" OR ", filters);    
                }

                command.Append(filter);
                return await _context.BingSearchTerms.FromSqlRaw(command.ToString()).ToListAsync();
            }

            return BadRequest();
        }

        //---- Add new Filter ----//
        // Add Single Filter
        [HttpPost("AddSingleFilter/{col}/{value}/{exact}")]
        public string AddSingleFilter(string col, string value, bool exact)
        {
            string filter = CreateSingleFilterString(col, value, exact);
            HttpContext.Session.SetString("BingFilter", HttpContext.Session.GetString("BingFilter") + ";" + filter);
            return "{\"success\":1}";
        }

        // Add Range Filter
        [HttpPost("AddRangeFilter/{col}/{fromVal}/{toVal}")]
        public string AddRangeFilter(string col, string fromVal, string toVal) 
        {
            string filter = CreateRangeFilterString(col, fromVal, toVal);
            HttpContext.Session.SetString("BingFilter", HttpContext.Session.GetString("BingFilter") + ";" + filter);
            return "{\"success\":1}";
        }

        // Add Comparing Filter
        [HttpPost("AddCompareFilter/{col}/{value}/{before}")]
        public string AddCompareFilter(string col, string value, bool before)
        {
            string filter = CreateCompareFilterString(col, value, before);
            HttpContext.Session.SetString("BingFilter", HttpContext.Session.GetString("BingFilter") + ";" + filter);
            return "{\"success\":1}";
        }

        //---- Remove existing Filter ----//
        // Remove Single Filter
        [HttpDelete("RemoveSingleFilter/{col}/{value}/{exact}")]
        public string RemoveSingleFilter(string col, string value, bool exact)
        {
            string filter = ";" + CreateSingleFilterString(col, value, exact);
            string? allFilters = HttpContext.Session.GetString("BingFilter");

            allFilters = allFilters.Replace(filter, "");

            HttpContext.Session.SetString("BingFilter", allFilters);

            return "{\"success\":1}";
        }

        // Remove Range Filter
        [HttpDelete("RemoveRangeFilter/{col}/{fromVal}/{toVal}")]
        public string RemoveRangeFilter(string col, string fromVal, string toVal)
        {
            string filter = ";" + CreateRangeFilterString(col, fromVal, toVal);
            string? allFilters = HttpContext.Session.GetString("BingFilter");

            allFilters = allFilters.Replace(filter, "");

            HttpContext.Session.SetString("BingFilter", allFilters);

            return "{\"success\":1}";
        }

        // Remove Comparing Filter
        [HttpDelete("RemoveCompareFilter/{col}/{value}/{before}")]
        public string RemoveCompareFilter(string col, string value, bool before)
        {
            string filter = ";" + CreateCompareFilterString(col, value, before);
            string? allFilters = HttpContext.Session.GetString("BingFilter");

            allFilters = allFilters.Replace(filter, "");

            HttpContext.Session.SetString("BingFilter", allFilters);

            return "{\"success\":1}";
        }

        // Remove all Filter
        [HttpDelete("RemoveAllFilter")]
        public string RemoveAllFilter()
        {
            HttpContext.Session.SetString("BingFilter", string.Empty);
            return "{\"success\":1}";
        }

        //---- Create Filter Strings ----//
        private string CreateSingleFilterString(string col, string value, bool exact)
        {
            if (exact)
            {
                return "[" + col + "] LIKE '" + value + "'";
            }
            else
            {
                return "[" + col + "] LIKE '%" + value + "%'";
            }
        }
        private string CreateRangeFilterString(string col, string fromVal, string toVal)
        {
            return "[" + col + "] BETWEEN '" + fromVal + "' AND '" + toVal + "'";
        }
        private string CreateCompareFilterString(string col, string value, bool before)
        {
            if(before)
            {
                return "[" + col + "] < '" + value + "'";
            }
            else
            {
                return "[" + col + "] > '" + value + "'";
            }
        }

        //-------------------------------------------------------------UTILITY---------------------------------------------------------------------//
        private bool SearchTermExists(Guid id)
        {
            return _context.BingSearchTerms.Any(e => e.id == id);
        }
    }
}
