using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CBHPredictorWebAPI.Data;
using CBHPredictorWebAPI.Models;

namespace CBHPredictorWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GoogleSearchTermsController : ControllerBase
    {
        private readonly CBHDBContext _context;

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
            _context.GoogleSearchTerms.Add(googleSearchTerm);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSearchTerm", new { id = googleSearchTerm.id }, googleSearchTerm);
        }

        // DELETE: api/GoogleSearchTerms/5
        // Deletes one specific Entry in the GoogleSearchTerms Table by ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSearchTerm(Guid id)
        {
            var googleSearchTerm = await _context.GoogleSearchTerms.FindAsync(id);
            if (googleSearchTerm == null)
            {
                return NotFound();
            }

            _context.GoogleSearchTerms.Remove(googleSearchTerm);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/LeadEntries
        // Deletes all Entries in the GoogleSearchTerms Table
        [HttpDelete]
        public async Task<ActionResult<IEnumerable<GoogleSearchTerm>>> DeleteSearchTerm()
        {
            var list = new List<GoogleSearchTerm>();
            list = await _context.GoogleSearchTerms.ToListAsync();

            var googleSearchTerm = list[0];
            while (googleSearchTerm != null)
            {
                _context.GoogleSearchTerms.Remove(googleSearchTerm);
                await _context.SaveChangesAsync();
                list = await _context.GoogleSearchTerms.ToListAsync();

                if (list.Count == 0)
                {
                    break;
                }
                else
                {
                    googleSearchTerm = list[0];
                }
            }

            return NoContent();
        }

        private bool SearchTermExists(Guid id)
        {
            return _context.GoogleSearchTerms.Any(e => e.id == id);
        }
    }
}
