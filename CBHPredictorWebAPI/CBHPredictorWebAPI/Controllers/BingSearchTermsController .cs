using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CBHPredictorWebAPI.Data;
using CBHPredictorWebAPI.Models;
using static CBHPredictorWebAPI.Controllers.ExcelReadController;
using System.Text;

namespace CBHPredictorWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BingSearchTermsController : ControllerBase
    {
        private readonly CBHDBContext _context;

        public BingSearchTermsController(CBHDBContext context)
        {
            _context = context;
        }

        // GET: api/BingSearchTerms
        // Gets all Entries in the BingSearchTerms Table
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BingSearchTerm>>> GetSearchTerms()
        {
            return await _context.BingSearchTerms.ToListAsync();
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

        // Gets all Entries in BingSearchTerms that meet a specified criterium
        [HttpGet("GetAny/{col}/{value}/{exact}")]
        public async Task<ActionResult<IEnumerable<BingSearchTerm>>> GetByAny(string col, string value, bool exact)
        {
            string command;

            if (exact)
            {
                command = "SELECT * FROM BingSearchTerms WHERE [" + col + "] LIKE {0}";
            } 
            else
            {
                command = "SELECT * FROM BingSearchTerms WHERE [" + col + "] LIKE '%' + {0} + '%'";
            }
            
            return await _context.BingSearchTerms.FromSqlRaw(command, value).ToListAsync();
        }

        // Gets all Entries from the given month and year
        [HttpGet("GetMonth/{month}/{year}")]
        public async Task<ActionResult<IEnumerable<BingSearchTerm>>> GetByMonth(Month month, int year)
        {
            string command = "SELECT * from BingSearchTerms WHERE month = {0} AND year = {1}";

            return await _context.BingSearchTerms.FromSqlRaw(command, month.ToString(), year).ToListAsync();
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
            bingSearchTerm.id = new Guid();
            _context.BingSearchTerms.Add(bingSearchTerm);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetSearchTerm", new { id = bingSearchTerm.id }, bingSearchTerm);
        }

        // DELETE: api/BingSearchTerms/5
        // Deletes one specific Entry in the BingSearchTerms Table by ID
        [HttpDelete("{id}")]
        public async Task<String> DeleteSearchTerm(Guid id)
        {
            await _context.BingSearchTerms.Where(e => e.id == id).ExecuteDeleteAsync();
            await _context.SaveChangesAsync();
            return "{\"success\":1}";
        }

        // DELETE: api/LeadEntries
        // Deletes all Entries in the BingSearchTerms Table
        [HttpDelete]
        public async Task<String> DeleteSearchTerms()
        {
            await _context.BingSearchTerms.ExecuteDeleteAsync();
            await _context.SaveChangesAsync();
            return "{\"success\":1}";
        }

        //// FILTER ////
        // Apply Filter
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

        // Add Single Filter
        [HttpPost("AddSingleFilter/{col}/{value}/{exact}")]
        public string AddSingleFilter(string col, string value, bool exact)
        {
            string filter = createSingleFilterString(col, value, exact);
            HttpContext.Session.SetString("BingFilter", HttpContext.Session.GetString("BingFilter") + ";" + filter);
            return "{\"success\":1}";
        }

        // Add Range Filter
        [HttpPost("AddRangeFilter/{col}/{fromVal}/{toVal}")]
        public string AddRangeFilter(string col, string fromVal, string toVal) 
        {
            string filter = createRangeFilterString(col, fromVal, toVal);
            HttpContext.Session.SetString("BingFilter", HttpContext.Session.GetString("BingFilter") + ";" + filter);
            return "{\"success\":1}";
        }

        // Add Comparing Filter
        [HttpPost("AddCompareFilter/{col}/{value}/{before}")]
        public string AddCompareFilter(string col, string value, bool before)
        {
            string filter = createCompareFilterString(col, value, before);
            HttpContext.Session.SetString("BingFilter", HttpContext.Session.GetString("BingFilter") + ";" + filter);
            return "{\"success\":1}";
        }

        // Remove Single Filter
        [HttpDelete("RemoveSingleFilter/{col}/{value}/{exact}")]
        public string RemoveSingleFilter(string col, string value, bool exact)
        {
            string filter = ";" + createSingleFilterString(col, value, exact);
            string? allFilters = HttpContext.Session.GetString("BingFilter");

            allFilters = allFilters.Replace(filter, "");

            HttpContext.Session.SetString("BingFilter", allFilters);

            return "{\"success\":1}";
        }

        // Remove Range Filter
        [HttpDelete("RemoveRangeFilter/{col}/{fromVal}/{toVal}")]
        public string RemoveRangeFilter(string col, string fromVal, string toVal)
        {
            string filter = ";" + createRangeFilterString(col, fromVal, toVal);
            string? allFilters = HttpContext.Session.GetString("BingFilter");

            allFilters = allFilters.Replace(filter, "");

            HttpContext.Session.SetString("BingFilter", allFilters);

            return "{\"success\":1}";
        }

        // Remove Comparing Filter
        [HttpDelete("RemoveCompareFilter/{col}/{fromVal}/{toVal}")]
        public string RemoveCompareFilter(string col, string value, bool before)
        {
            string filter = ";" + createCompareFilterString(col, value, before);
            string? allFilters = HttpContext.Session.GetString("BingFilter");

            allFilters = allFilters.Replace(filter, "");

            HttpContext.Session.SetString("BingFilter", allFilters);

            return "{\"success\":1}";
        }

        // Filter String Creation
        private string createSingleFilterString(string col, string value, bool exact)
        {
            if (exact)
            {
                return "[" + col + "] LIKE " + value;
            }
            else
            {
                return "[" + col + "] LIKE '%" + value + "%'";
            }
        }
        private string createRangeFilterString(string col, string fromVal, string toVal)
        {
            return "[" + col + "] BETWEEN '" + fromVal + "' AND '" + toVal + "'";
        }
        private string createCompareFilterString(string col, string value, bool before)
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

        private bool SearchTermExists(Guid id)
        {
            return _context.BingSearchTerms.Any(e => e.id == id);
        }
    }
}
