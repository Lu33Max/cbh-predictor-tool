using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CBHPredictorWebAPI.Data;
using CBHPredictorWebAPI.Models;
using static CBHPredictorWebAPI.Controllers.ExcelReadController;

namespace CBHPredictorWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GoogleSearchTermsController : ControllerBase
    {
        private readonly CBHDBContext _context;
        public enum GSearchTerms { terms, impressions, clicks, month, year }

        public GoogleSearchTermsController(CBHDBContext context)
        {
            _context = context;
        }

        // GET: api/GoogleSearchTerms
        // Gets all Entries in the GoogleSearchTerms Table
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GoogleSearchTerm>>> GetSearchTerms()
        {
            return await _context.GoogleSearchTerms.ToListAsync();
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

        // Gets all Entries in BingSearchTerms that meet a specified criterium
        [HttpGet("GetAny/{col}/{value}/{exact}")]
        public async Task<ActionResult<IEnumerable<GoogleSearchTerm>>> GetByAny(GSearchTerms col, string value, bool exact)
        {
            string command;

            if (exact)
            {
                command = "SELECT * FROM GoogleSearchTerms WHERE [" + col + "] LIKE {0}";
            }
            else
            {
                command = "SELECT * FROM GoogleSearchTerms WHERE [" + col + "] LIKE '%' + {0} + '%'";
            }

            return await _context.GoogleSearchTerms.FromSqlRaw(command, value).ToListAsync();
        }

        //Gets all Entries from the given month and year
        [HttpGet("GetMonth/{month}/{year}")]
        public async Task<ActionResult<IEnumerable<BingSearchTerm>>> GetByMonth(Month month, int year)
        {
            string command = "SELECT * from GoogleSearchTerms WHERE month = {0} AND year = {1}";

            return await _context.BingSearchTerms.FromSqlRaw(command, month.ToString(), year).ToListAsync();
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

            return NoContent();
        }

        // POST: api/GoogleSearchTerms
        // Adds one Entry to the GoogleSearchTerms Table
        [HttpPost]
        public async Task<ActionResult<GoogleSearchTerm>> PostSearchTerm(GoogleSearchTerm googleSearchTerm)
        {
            await _context.GoogleSearchTerms.AddAsync(googleSearchTerm);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetSearchTerm", new { id = googleSearchTerm.id }, googleSearchTerm);
        }

        // DELETE: api/GoogleSearchTerms/5
        // Deletes one specific Entry in the GoogleSearchTerms Table by ID
        [HttpDelete("{id}")]
        public async Task<String> DeleteSearchTerm(Guid id)
        {
            await _context.GoogleSearchTerms.Where(e => e.id == id).ExecuteDeleteAsync();
            await _context.SaveChangesAsync();
            return "Success";
        }

        // DELETE: api/LeadEntries
        // Deletes all Entries in the GoogleSearchTerms Table
        [HttpDelete]
        public async Task<String> DeleteSearchTerms()
        {
            await _context.GoogleSearchTerms.ExecuteDeleteAsync();
            await _context.SaveChangesAsync();
            return "Success";
        }

        private bool SearchTermExists(Guid id)
        {
            return _context.GoogleSearchTerms.Any(e => e.id == id);
        }
    }
}
