using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
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

        public LeadEntriesController(CBHDBContext context)
        {
            _context = context;
        }

        // GET: api/LeadEntries
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LeadEntry>>> GetLeadEntries()
        {
            return await _context.LeadEntries.ToListAsync();
        }

        // GET: api/LeadEntries/5
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

        // PUT: api/LeadEntries/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
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
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<LeadEntry>> PostLeadEntry(LeadEntry leadEntry)
        {
            _context.LeadEntries.Add(leadEntry);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetLeadEntry", new { id = leadEntry.id }, leadEntry);
        }

        // DELETE: api/LeadEntries/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLeadEntry(Guid id)
        {
            var leadEntry = await _context.LeadEntries.FindAsync(id);
            if (leadEntry == null)
            {
                return NotFound();
            }

            _context.LeadEntries.Remove(leadEntry);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool LeadEntryExists(Guid id)
        {
            return _context.LeadEntries.Any(e => e.id == id);
        }
    }
}
