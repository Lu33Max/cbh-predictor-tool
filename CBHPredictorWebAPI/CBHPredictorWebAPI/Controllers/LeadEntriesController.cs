using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CBHPredictorWebAPI.Data;
using CBHPredictorWebAPI.Models;

namespace CBHPredictorWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LeadEntriesController : ControllerBase
    {
        private readonly CBHDBContext _context;
        public enum LeadColumns { leadID, leadNo, leadStatus, leadDate, organisationID, countryID, channel, fieldOfInterest, specificOfInterest, paramOfInterest, diagnosisOfInterest, matrixOfInterest, quantityOfInterest }

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

        [HttpGet("GetAny/{col}/{value}/{exact}")]
        public async Task<ActionResult<IEnumerable<LeadEntry>>> GetByAny(LeadColumns col, string value, bool exact)
        {
            string command;

            if (exact)
            {
                command = "SELECT * FROM LeadEntries WHERE [" + col + "] LIKE {0}";
            }
            else
            {
                command = "SELECT * FROM LeadEntries WHERE [" + col + "] LIKE '%' + {0} + '%'";
            }

            return await _context.LeadEntries.FromSqlRaw(command, value).ToListAsync();
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

            return NoContent();
        }

        // POST: api/LeadEntries
        // Adds one Entry to the LeadEntries Table
        [HttpPost]
        public async Task<ActionResult<LeadEntry>> PostLeadEntry(LeadEntry leadEntry)
        {
            await _context.LeadEntries.AddAsync(leadEntry);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetLeadEntry", new { id = leadEntry.id }, leadEntry);
        }

        // DELETE: api/LeadEntries/5
        // Deletes one specific Entry in the LeadEntries Table by ID
        [HttpDelete("{id}")]
        public async Task<String> DeleteLeadEntry(Guid id)
        {
            await _context.LeadEntries.Where(e => e.id == id).ExecuteDeleteAsync();
            await _context.SaveChangesAsync();
            return "Success";
        }

        // DELETE: api/LeadEntries
        // Deletes all Entries in the LeadEntries Table
        [HttpDelete]
        public async Task<String> DeleteLeadEntries()
        {
            await _context.LeadEntries.ExecuteDeleteAsync();
            await _context.SaveChangesAsync();
            return "Success";
        }

        private bool LeadEntryExists(Guid id)
        {
            return _context.LeadEntries.Any(e => e.id == id);
        }
    }
}
