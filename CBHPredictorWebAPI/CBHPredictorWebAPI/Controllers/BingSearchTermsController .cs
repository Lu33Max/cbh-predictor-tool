using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CBHPredictorWebAPI.Data;
using CBHPredictorWebAPI.Models;

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
        public async Task<IActionResult> DeleteSearchTerm(Guid id)
        {
            var BingSearchTerm = await _context.BingSearchTerms.FindAsync(id);
            if (BingSearchTerm == null)
            {
                return NotFound();
            }

            _context.BingSearchTerms.Remove(BingSearchTerm);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/LeadEntries
        // Deletes all Entries in the BingSearchTerms Table
        [HttpDelete]
        public async Task<ActionResult<IEnumerable<BingSearchTerm>>> DeleteSearchTerm()
        {
            var list = new List<BingSearchTerm>();
            list = await _context.BingSearchTerms.ToListAsync();

            var BingSearchTerm = list[0];
            while (BingSearchTerm != null)
            {
                _context.BingSearchTerms.Remove(BingSearchTerm);
                await _context.SaveChangesAsync();
                list = await _context.BingSearchTerms.ToListAsync();

                if (list.Count == 0)
                {
                    break;
                }
                else
                {
                    BingSearchTerm = list[0];
                }
            }

            return NoContent();
        }

        private bool SearchTermExists(Guid id)
        {
            return _context.BingSearchTerms.Any(e => e.id == id);
        }
    }
}
