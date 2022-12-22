using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CBHPredictorWebAPI.Data;
using CBHPredictorWebAPI.Models;
using System.Text;
using static CBHPredictorWebAPI.Controllers.BingSearchTermsController;

namespace CBHPredictorWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LeadEntriesController : ControllerBase
    {
        private readonly CBHDBContext _context;
        public enum LeadColumns { leadID, leadNo, leadStatus, leadDate, organisationID, countryID, channel, fieldOfInterest, specificOfInterest, paramOfInterest, diagnosisOfInterest, matrixOfInterest, quantityOfInterest }
        public enum order { ascending, descending }

        public LeadEntriesController(CBHDBContext context)
        {
            _context = context;
        }

        // GET: api/LeadEntries
        // Gets all Entries in the LeadEntries Table
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LeadEntry>>> GetLeadEntries()
        {
            return await _context.LeadEntries.ToListAsync();
        }

        // GET: api/LeadEntries/5
        // Gets one specific Entry in the LeadEntries Table by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<LeadEntry>> GetLeadEntry(Guid id)
        {
            var leadEntry = await _context.LeadEntries.FindAsync(id);

            if (leadEntry == null)
            {
                return NotFound();
            }

            return leadEntry;
        }

        [HttpGet("SortByColumn")]
        public async Task<ActionResult<IEnumerable<LeadEntry>>> SortByColumn(LeadColumns col, Order order)
        {
            if (order == Order.ascending)
            {
                return await _context.LeadEntries.FromSqlRaw("SELECT * FROM LeadEntries ORDER BY [" + col + "] ASC").ToListAsync();
            }
            else
            {
                return await _context.LeadEntries.FromSqlRaw("SELECT * FROM LeadEntries ORDER BY [" + col + "] DESC").ToListAsync();
            }
        }

        [HttpGet("ExportToExcel")]
        public async Task<IActionResult> ExportLeadEntriesToExcel()
        {
            try
            {
                List<LeadEntry> sheet = await _context.LeadEntries.OrderBy(e => e.leadID).ToListAsync();
                FileStreamResult fr = ExportToExcel.CreateExcelFile.StreamExcelDocument(sheet, "LeadEntries.xlsx");
                return fr;
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(ex);
            }
        }

        // PUT: api/LeadEntries/5
        // Edits one specific Entry in the LeadEntries Table by ID
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLeadEntry(Guid id, LeadEntry leadEntry)
        {
            if (id != leadEntry.id)
            {
                return BadRequest();
            }

            leadEntry.lastEdited = DateTime.Now;
            _context.Entry(leadEntry).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LeadEntryExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(leadEntry);
        }

        // POST: api/LeadEntries
        // Adds one Entry to the LeadEntries Table
        [HttpPost]
        public async Task<ActionResult<LeadEntry>> PostLeadEntry(LeadEntry leadEntry)
        {
            if (!_context.LeadEntries.Any(e => e.leadID == leadEntry.leadID))
            {
                leadEntry.id = Guid.NewGuid();
                leadEntry.lastEdited = DateTime.Now;
                await _context.LeadEntries.AddAsync(leadEntry);
                await _context.SaveChangesAsync();
                return CreatedAtAction("GetLeadEntry", new { id = leadEntry.id }, leadEntry);
            }
            else
            {
                return BadRequest();
            }
        }

        // DELETE: api/LeadEntries/5
        // Deletes one specific Entry in the LeadEntries Table by ID
        [HttpDelete("{id}")]
        public async Task<string> DeleteLeadEntry(Guid id)
        {
            await _context.LeadEntries.Where(e => e.id == id).ExecuteDeleteAsync();
            await _context.SaveChangesAsync();
            return "{\"success\":1}";
        }

        // DELETE: api/LeadEntries
        // Deletes all Entries in the LeadEntries Table
        [HttpDelete]
        public async Task<string> DeleteLeadEntries()
        {
            await _context.LeadEntries.ExecuteDeleteAsync();
            await _context.SaveChangesAsync();
            return "{\"success\":1}";
        }

        //-------------------------------------------------------------FILTER----------------------------------------------------------------------//
        //---- Apply Filter ----//
        [HttpGet("ApplyFilter/{relation}")]
        public async Task<ActionResult<IEnumerable<LeadEntry>>> ApplyFilter(string relation)
        {
            var command = new StringBuilder("SELECT * FROM LeadEntries WHERE ");
            string? filter = HttpContext.Session.GetString("LeadFilter");

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
                return await _context.LeadEntries.FromSqlRaw(command.ToString()).ToListAsync();
            }

            return BadRequest();
        }

        //---- Add new Filter ----//
        // Add Single Filter
        [HttpPost("AddSingleFilter/{col}/{value}/{exact}")]
        public string AddSingleFilter(string col, string value, bool exact)
        {
            string filter = CreateSingleFilterString(col, value, exact);
            HttpContext.Session.SetString("LeadFilter", HttpContext.Session.GetString("LeadFilter") + ";" + filter);
            return "{\"success\":1}";
        }

        // Add Range Filter
        [HttpPost("AddRangeFilter/{col}/{fromVal}/{toVal}")]
        public string AddRangeFilter(string col, string fromVal, string toVal)
        {
            string filter = CreateRangeFilterString(col, fromVal, toVal);
            HttpContext.Session.SetString("LeadFilter", HttpContext.Session.GetString("LeadFilter") + ";" + filter);
            return "{\"success\":1}";
        }

        // Add Comparing Filter
        [HttpPost("AddCompareFilter/{col}/{value}/{before}")]
        public string AddCompareFilter(string col, string value, bool before)
        {
            string filter = CreateCompareFilterString(col, value, before);
            HttpContext.Session.SetString("LeadFilter", HttpContext.Session.GetString("LeadFilter") + ";" + filter);
            return "{\"success\":1}";
        }

        //---- Remove existing Filter ----//
        // Remove Single Filter
        [HttpDelete("RemoveSingleFilter/{col}/{value}/{exact}")]
        public string RemoveSingleFilter(string col, string value, bool exact)
        {
            string filter = ";" + CreateSingleFilterString(col, value, exact);
            string? allFilters = HttpContext.Session.GetString("LeadFilter");

            allFilters = allFilters.Replace(filter, "");

            HttpContext.Session.SetString("LeadFilter", allFilters);

            return "{\"success\":1}";
        }

        // Remove Range Filter
        [HttpDelete("RemoveRangeFilter/{col}/{fromVal}/{toVal}")]
        public string RemoveRangeFilter(string col, string fromVal, string toVal)
        {
            string filter = ";" + CreateRangeFilterString(col, fromVal, toVal);
            string? allFilters = HttpContext.Session.GetString("LeadFilter");

            allFilters = allFilters.Replace(filter, "");

            HttpContext.Session.SetString("LeadFilter", allFilters);

            return "{\"success\":1}";
        }

        // Remove Comparing Filter
        [HttpDelete("RemoveCompareFilter/{col}/{value}/{before}")]
        public string RemoveCompareFilter(string col, string value, bool before)
        {
            string filter = ";" + CreateCompareFilterString(col, value, before);
            string? allFilters = HttpContext.Session.GetString("LeadFilter");

            allFilters = allFilters.Replace(filter, "");

            HttpContext.Session.SetString("LeadFilter", allFilters);

            return "{\"success\":1}";
        }

        // Remove all Filter
        [HttpDelete("RemoveAllFilter")]
        public string RemoveAllFilter()
        {
            HttpContext.Session.SetString("LeadFilter", string.Empty);
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
        private bool LeadEntryExists(Guid id)
        {
            return _context.LeadEntries.Any(e => e.id == id);
        }
    }
}
