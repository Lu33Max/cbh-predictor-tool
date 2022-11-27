using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CBHPredictorWebAPI.Data;
using CBHPredictorWebAPI.Models;
using Microsoft.Data.SqlClient;

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
        [HttpGet("GetByID/{id}")]
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
            char[] arr = value.ToCharArray();
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

        // PUT: api/BingSearchTerms/5
        // Edits one specific Entry in the BingSearchTerms Table by ID
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSearchTerm([FromRoute]Guid id, BingSearchTerm BingSearchTerm)
        {
            if (id != BingSearchTerm.id)
            {
                return BadRequest();
            }

            _context.Entry(BingSearchTerm).State = EntityState.Modified;

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

        // POST: api/BingSearchTerms
        // Adds one Entry to the BingSearchTerms Table
        [HttpPost]
        public async Task<ActionResult<BingSearchTerm>> PostSearchTerm(BingSearchTerm BingSearchTerm)
        {
            _context.BingSearchTerms.Add(BingSearchTerm);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetSearchTerm", new { id = BingSearchTerm.id }, BingSearchTerm);
        }

        // DELETE: api/BingSearchTerms/5
        // Deletes one specific Entry in the BingSearchTerms Table by ID
        [HttpDelete("{id}")]
        public async Task<String> DeleteSearchTerm(Guid id)
        {
            await _context.BingSearchTerms.Where(e => e.id == id).ExecuteDeleteAsync();
            await _context.SaveChangesAsync();
            return "Success";
        }

        // DELETE: api/LeadEntries
        // Deletes all Entries in the BingSearchTerms Table
        [HttpDelete]
        public async Task<String> DeleteSearchTerms()
        {
            await _context.GoogleSearchTerms.ExecuteDeleteAsync();
            await _context.SaveChangesAsync();
            return "Success";
        }

        private bool SearchTermExists(Guid id)
        {
            return _context.BingSearchTerms.Any(e => e.id == id);
        }
    }
}
