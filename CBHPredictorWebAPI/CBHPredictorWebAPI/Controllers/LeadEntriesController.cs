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
            return await _context.LeadEntries.OrderBy(e => e.leadDate).ToListAsync();
        }

        // GET: api/LeadEntries/5
        // Gets one specific Entry in the LeadEntries Table by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<LeadEntry>> GetLeadEntry([FromRoute]Guid id)
        {
            var leadEntry = await _context.LeadEntries.FindAsync(id);

            if (leadEntry == null)
            {
                return NotFound();
            }

            return leadEntry;
        }

        [HttpGet("count")]
        public async Task<int> CountRows()
        {
            return await _context.LeadEntries.CountAsync();
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
        [HttpPost("filter/{relation}/{sort}/{cols}")]
        public async Task<ActionResult<IEnumerable<LeadEntry>>> FilterEntries([FromBody] string[][] filters, [FromRoute] bool relation, string sort, string cols)
        {
            var command = new StringBuilder("");

            if (!String.IsNullOrEmpty(cols) && cols != "null")
            {
                command.Append("SELECT " + cols + " FROM LeadEntries");
            }
            else
            {
                command.Append("SELECT * FROM LeadEntries");
            }

            if (filters.Length > 0)
            {
                string[] newFilters = new string[filters.Length];

                for (int i = 0; i < filters.Length; i++)
                {
                    newFilters[i] = filters[i][0];
                }

                command.Append( "WHERE ");

                if (relation)
                {
                    command.Append(string.Join(" AND ", newFilters));
                }
                else
                {
                    command.Append(string.Join(" OR ", newFilters));
                }
            }

            if (!String.IsNullOrEmpty(sort) && sort != "null")
            {
                command.Append(" " + sort);

                if (!sort.Contains("leadID"))
                {
                    command.Append(", leadID ASC");
                }
            }

            return await _context.LeadEntries.FromSqlRaw(command.ToString()).ToListAsync();
        }

        //-------------------------------------------------------------UTILITY---------------------------------------------------------------------//
        private bool LeadEntryExists(Guid id)
        {
            return _context.LeadEntries.Any(e => e.id == id);
        }
    }
}
