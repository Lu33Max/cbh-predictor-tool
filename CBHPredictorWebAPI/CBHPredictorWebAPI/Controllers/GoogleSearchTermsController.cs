using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CBHPredictorWebAPI.Data;
using CBHPredictorWebAPI.Models;
using System.Text;
using static CBHPredictorWebAPI.Controllers.BingSearchTermsController;
using Microsoft.AspNetCore.Authorization;
using System.Linq;

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

        [HttpGet("count")]
        public async Task<int> CountRows()
        {
            return await _context.GoogleSearchTerms.CountAsync();
        }

        [HttpGet("impressions")]
        public async Task<ActionResult<IEnumerable<MonthValueResponse>>> CountImpressions()
        {
            List<GoogleSearchTerm> termlist = await _context.GoogleSearchTerms.OrderByDescending(e => e.date).ToListAsync();

            var date = "0";
            var index = -1;
            List<MonthValueResponse> response = new List<MonthValueResponse>();

            foreach (GoogleSearchTerm term in termlist)
            {
                if (term.date == date)
                {
                    response[index].value += term.impressions;
                }
                else
                {
                    response.Add(new MonthValueResponse() { month = term.date, value = term.impressions });
                    date = term.date;
                    index++;
                }
            }

            return response;
        }

        [HttpGet("clicks")]
        public async Task<ActionResult<IEnumerable<MonthValueResponse>>> CountClicks()
        {
            List<GoogleSearchTerm> termlist = await _context.GoogleSearchTerms.OrderByDescending(e => e.date).ToListAsync();

            var date = "0";
            var index = -1;
            List<MonthValueResponse> response = new List<MonthValueResponse>();

            foreach (GoogleSearchTerm term in termlist)
            {
                if (term.date == date)
                {
                    response[index].value += term.clicks;
                }
                else
                {
                    response.Add(new MonthValueResponse() { month = term.date, value = term.clicks });
                    date = term.date;
                    index++;
                }
            }

            return response;
        }

        [HttpGet("GetCurrentMonth")]
        public async Task<string> SelectCurrentMonth()
        {
            return await _context.GoogleSearchTerms.MaxAsync(e => e.date);
        }

        [HttpGet("dates")]
        public async Task<List<string>> GetAllDates()
        {
            List<GoogleSearchTerm> temp = await _context.GoogleSearchTerms.GroupBy(e => e.date).Select(e => e.First()).ToListAsync();
            List<string> dates = new List<string>();

            foreach (GoogleSearchTerm term in temp)
            {
                dates.Add(term.date);
            }

            dates.Reverse();

            return dates;
        }

        [HttpGet("ExportToExcel")]
        public async Task<IActionResult> ExportGTermsToExcel()
        {
            try
            {
                List<GoogleSearchTerm> sheet = await _context.GoogleSearchTerms.OrderBy(e => e.date).ThenBy(e => e.terms).ToListAsync();
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
        [HttpPost("filter/{relation}/{sort}/{cols}")]
        public async Task<ActionResult<IEnumerable<GoogleSearchTerm>>> FilterEntries([FromBody] string[][] filters, [FromRoute] bool relation, string sort, string cols)
        {
            var command = new StringBuilder("");

            if (!String.IsNullOrEmpty(cols) && cols != "null")
            {
                command.Append("SELECT " + cols + " FROM GoogleSearchTerms");
            }
            else
            {
                command.Append("SELECT * FROM GoogleSearchTerms");
            }

            if (filters.Length > 0)
            {
                string[] newFilters = new string[filters.Length];

                for (int i = 0; i < filters.Length; i++)
                {
                    newFilters[i] = filters[i][0];
                }

                command.Append(" WHERE ");

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

                if (!sort.Contains("terms"))
                {
                    command.Append(", terms ASC");
                }
            }
            
            return await _context.GoogleSearchTerms.FromSqlRaw(command.ToString()).ToListAsync();
        }

        //-------------------------------------------------------------UTILITY---------------------------------------------------------------------//
        private bool SearchTermExists(Guid id)
        {
            return _context.GoogleSearchTerms.Any(e => e.id == id);
        }
    }
}
