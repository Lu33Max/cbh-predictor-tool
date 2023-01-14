using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CBHPredictorWebAPI.Data;
using CBHPredictorWebAPI.Models;
using System.Text;
using static CBHPredictorWebAPI.Controllers.BingSearchTermsController;
using Microsoft.AspNetCore.Authorization;

namespace CBHPredictorWebAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class GoogleSearchTermsController : ControllerBase
    {
        private readonly CBHDBContext _context;
        public enum GSearchTerms { terms, impressions, clicks, date }
        public enum order { ascending , descending }

        public GoogleSearchTermsController(CBHDBContext context)
        {
            _context = context;
        }

        // GET: api/GoogleSearchTerms
        // Gets all Entries in the GoogleSearchTerms Table
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GoogleSearchTerm>>> GetSearchTerms()
        {
            return await _context.GoogleSearchTerms.OrderBy(e => e.date).ThenBy(e => e.terms).ToListAsync();
        }

        // GET: api/GoogleSearchTerms/5
        // Gets one specific Entry in the GoogleSearchTerms Table by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<GoogleSearchTerm>> GetSearchTerm([FromRoute]Guid id)
        {
            var searchTerm = await _context.GoogleSearchTerms.FindAsync(id);

            if (searchTerm == null)
            {
                return NotFound();
            }

            return searchTerm;
        }

        [HttpGet("SortByColumn/{col}/{order}")]
        public async Task<ActionResult<IEnumerable<GoogleSearchTerm>>> SortByColumn(GSearchTerms col, Order order)
        {
            if (order == Order.ascending)
            {
                return await _context.GoogleSearchTerms.FromSqlRaw("SELECT * FROM GoogleSearchTerms ORDER BY [" + col + "] ASC").ToListAsync();
            }
            else
            {
                return await _context.GoogleSearchTerms.FromSqlRaw("SELECT * FROM GoogleSearchTerms ORDER BY [" + col + "] DESC").ToListAsync();
            }
        }


        [HttpGet("CountRows")]
        public async Task<int> CountRows()
        {
            var command = new StringBuilder("SELECT * FROM GoogleSearchTerms WHERE ");
            string? filter = HttpContext.Session.GetString("GoogleFilter");

            if (string.IsNullOrEmpty(filter))
            {
                List<GoogleSearchTerm> unfilteredRows = await _context.GoogleSearchTerms.ToListAsync();
                return unfilteredRows.Count();
            }
            else
            {
                filter = filter.Remove(0, 1);
                string[] filters = filter.Split(";");

                filter = string.Join(" AND ", filters);

                command.Append(filter);
                List<GoogleSearchTerm> fitleredRows = await _context.GoogleSearchTerms.FromSqlRaw(command.ToString()).ToListAsync();

                return fitleredRows.Count();
            }
        }

        [HttpGet("GetCurrentMonth")]
        public string selectCurrentMonth()
        {
            int _latestMonth = DateTime.Now.Month;
            string latestMonth = _latestMonth.ToString();
            int latestYear = DateTime.Now.Year;

            if(_latestMonth <= 9)
            {
                latestMonth = "0" + _latestMonth;
            }

            string latestDate = latestYear + "-" + latestMonth;

            while (!_context.GoogleSearchTerms.Any(e => e.date == latestDate))
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
        public async Task<IActionResult> ExportGTermsToExcel()
        {
            try
            {
                List<GoogleSearchTerm> sheet = await _context.GoogleSearchTerms.OrderBy(e => e.terms).ToListAsync();
                FileStreamResult fr = ExportToExcel.CreateExcelFile.StreamExcelDocument(sheet, "GoogleSearchTerms.xlsx");
                return fr;
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(ex);
            }
        }

        // PUT: api/GoogleSearchTerms/5
        // Edits one specific Entry in the GoogleSearchTerms Table by ID
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSearchTerm([FromRoute]Guid id, GoogleSearchTerm googleSearchTerm)
        {
            if (id != googleSearchTerm.id)
            {
                return BadRequest();
            }

            _context.Entry(googleSearchTerm).State = EntityState.Modified;

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

            return Ok(googleSearchTerm);
        }

        // POST: api/GoogleSearchTerms
        // Adds one Entry to the GoogleSearchTerms Table
        [HttpPost]
        public async Task<ActionResult<GoogleSearchTerm>> PostSearchTerm(GoogleSearchTerm googleSearchTerm)
        {
            googleSearchTerm.id = Guid.NewGuid();
            await _context.GoogleSearchTerms.AddAsync(googleSearchTerm);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetSearchTerm", new { id = googleSearchTerm.id }, googleSearchTerm);
        }

        // DELETE: api/GoogleSearchTerms/5
        // Deletes one specific Entry in the GoogleSearchTerms Table by ID
        [HttpDelete("{id}")]
        public async Task<string> DeleteSearchTerm(Guid id)
        {
            await _context.GoogleSearchTerms.Where(e => e.id == id).ExecuteDeleteAsync();
            await _context.SaveChangesAsync();
            return "{\"success\":1}";
        }

        // DELETE: api/LeadEntries
        // Deletes all Entries in the GoogleSearchTerms Table
        [HttpDelete]
        public async Task<string> DeleteSearchTerms()
        {
            await _context.GoogleSearchTerms.ExecuteDeleteAsync();
            await _context.SaveChangesAsync();
            return "{\"success\":1}";
        }

        //-------------------------------------------------------------FILTER----------------------------------------------------------------------//
        //---- Apply Filter ----//
        [HttpGet("ApplyFilter/{relation}")]
        public async Task<ActionResult<IEnumerable<GoogleSearchTerm>>> ApplyFilter(string relation)
        {
            var command = new StringBuilder("SELECT * FROM GoogleSearchTerms WHERE ");
            string? filter = HttpContext.Session.GetString("GoogleFilter");

            if (!string.IsNullOrEmpty(filter))
            {
                filter = filter.Remove(0, 1);
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
                return await _context.GoogleSearchTerms.FromSqlRaw(command.ToString()).ToListAsync();
            }

            return BadRequest();
        }

        //---- Add new Filter ----//
        // Add Single Filter
        [HttpPost("AddSingleFilter/{col}/{value}/{exact}")]
        public string AddSingleFilter(string col, string value, bool exact)
        {
            string filter = CreateSingleFilterString(col, value, exact);
            HttpContext.Session.SetString("GoogleFilter", HttpContext.Session.GetString("GoogleFilter") + ";" + filter);
            return "{\"success\":1}";
        }

        // Add Range Filter
        [HttpPost("AddRangeFilter/{col}/{fromVal}/{toVal}")]
        public string AddRangeFilter(string col, string fromVal, string toVal)
        {
            string filter = CreateRangeFilterString(col, fromVal, toVal);
            HttpContext.Session.SetString("GoogleFilter", HttpContext.Session.GetString("GoogleFilter") + ";" + filter);
            return "{\"success\":1}";
        }

        // Add Comparing Filter
        [HttpPost("AddCompareFilter/{col}/{value}/{before}")]
        public string AddCompareFilter(string col, string value, bool before)
        {
            string filter = CreateCompareFilterString(col, value, before);
            HttpContext.Session.SetString("GoogleFilter", HttpContext.Session.GetString("GoogleFilter") + ";" + filter);
            return "{\"success\":1}";
        }

        //---- Remove existing Filter ----//
        // Remove Single Filter
        [HttpDelete("RemoveSingleFilter/{col}/{value}/{exact}")]
        public string RemoveSingleFilter(string col, string value, bool exact)
        {
            string filter = ";" + CreateSingleFilterString(col, value, exact);
            string? allFilters = HttpContext.Session.GetString("GoogleFilter");

            allFilters = allFilters.Replace(filter, "");

            HttpContext.Session.SetString("GoogleFilter", allFilters);

            return "{\"success\":1}";
        }

        // Remove Range Filter
        [HttpDelete("RemoveRangeFilter/{col}/{fromVal}/{toVal}")]
        public string RemoveRangeFilter(string col, string fromVal, string toVal)
        {
            string filter = ";" + CreateRangeFilterString(col, fromVal, toVal);
            string? allFilters = HttpContext.Session.GetString("GoogleFilter");

            allFilters = allFilters.Replace(filter, "");

            HttpContext.Session.SetString("GoogleFilter", allFilters);

            return "{\"success\":1}";
        }

        // Remove Comparing Filter
        [HttpDelete("RemoveCompareFilter/{col}/{value}/{before}")]
        public string RemoveCompareFilter(string col, string value, bool before)
        {
            string filter = ";" + CreateCompareFilterString(col, value, before);
            string? allFilters = HttpContext.Session.GetString("GoogleFilter");

            allFilters = allFilters.Replace(filter, "");

            HttpContext.Session.SetString("GoogleFilter", allFilters);

            return "{\"success\":1}";
        }

        // Remove all Filter
        [HttpDelete("RemoveAllFilter")]
        public string RemoveAllFilter()
        {
            HttpContext.Session.SetString("GoogleFilter", string.Empty);
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
            if (before)
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
            return _context.GoogleSearchTerms.Any(e => e.id == id);
        }
    }
}
