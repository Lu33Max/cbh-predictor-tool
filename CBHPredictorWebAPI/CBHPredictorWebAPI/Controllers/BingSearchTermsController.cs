using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CBHPredictorWebAPI.Data;
using CBHPredictorWebAPI.Models;
using System.Text;
using Microsoft.AspNetCore.Authorization;

namespace CBHPredictorWebAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class BingSearchTermsController : ControllerBase
    {
        private readonly CBHDBContext _context;
        public enum BSearchTerms { terms, impressions, clicks, date }
        public enum Order { ascending, descending }

        public BingSearchTermsController(CBHDBContext context)
        {
            _context = context;
        }

        // GET: api/BingSearchTerms
        // Gets all Entries in the BingSearchTerms Table
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BingSearchTerm>>> GetSearchTerms()
        {
            return await _context.BingSearchTerms.OrderBy(e => e.date).ThenBy(e => e.terms).ToListAsync();
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

        [HttpGet("count")]
        public async Task<int> CountRows()
        {
            return await _context.BingSearchTerms.CountAsync();
        }

        [HttpGet("impressions")]
        public async Task<ActionResult<IEnumerable<MonthValueResponse>>> CountImpressions()
        {
            List<BingSearchTerm> termlist = await _context.BingSearchTerms.OrderByDescending(e => e.date).ToListAsync();

            var date = "0";
            var index = -1;
            List<MonthValueResponse> response = new List<MonthValueResponse>();

            foreach (BingSearchTerm term in termlist)
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
            List<BingSearchTerm> termlist = await _context.BingSearchTerms.OrderByDescending(e => e.date).ToListAsync();

            var date = "0";
            var index = -1;
            List<MonthValueResponse> response = new List<MonthValueResponse>();

            foreach (BingSearchTerm term in termlist)
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
            return await _context.BingSearchTerms.MaxAsync(e => e.date);
        }

        [HttpGet("dates")]
        public async Task<List<string>> GetAllDates()
        {
            List<BingSearchTerm> temp = await _context.BingSearchTerms.GroupBy(e => e.date).Select(e => e.First()).ToListAsync();
            List<string> dates = new List<string>();

            foreach (BingSearchTerm term in temp)
            {
                dates.Add(term.date);
            }

            dates.Reverse();

            return dates;
        }

        [HttpGet("ExportToExcel")]
        public async Task<IActionResult> ExportBTermsToExcel()
        {
            try
            {
                List<BingSearchTerm> sheet = await _context.BingSearchTerms.OrderBy(e => e.date).ThenBy(e => e.terms).ToListAsync();
                FileStreamResult fr = ExportToExcel.CreateExcelFile.StreamExcelDocument(sheet, "BingSearchTerms.xlsx");
                return fr;
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(ex);
            }
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
            bingSearchTerm.id = Guid.NewGuid();
            await _context.BingSearchTerms.AddAsync(bingSearchTerm);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetSearchTerm", new { id = bingSearchTerm.id }, bingSearchTerm);
        }

        // DELETE: api/BingSearchTerms/5
        // Deletes one specific Entry in the BingSearchTerms Table by ID
        [HttpDelete("{id}")]
        public async Task<string> DeleteSearchTerm(Guid id)
        {
            await _context.BingSearchTerms.Where(e => e.id == id).ExecuteDeleteAsync();
            await _context.SaveChangesAsync();
            return "{\"success\":1}";
        }

        // DELETE: api/LeadEntries
        // Deletes all Entries in the BingSearchTerms Table
        [HttpDelete]
        public async Task<string> DeleteSearchTerms()
        {
            await _context.BingSearchTerms.ExecuteDeleteAsync();
            await _context.SaveChangesAsync();
            return "{\"success\":1}";
        }

        //-------------------------------------------------------------FILTER----------------------------------------------------------------------//
        [HttpPost("filter/{relation}/{sort}/{cols}")]
        public async Task<ActionResult<IEnumerable<BingSearchTerm>>> FilterEntries([FromBody] string[][] filters, [FromRoute] bool relation, string sort, string cols)
        {
            var command = new StringBuilder("");
 
            if (!String.IsNullOrEmpty(cols) && cols != "null")
            {
                command.Append("SELECT " + cols + " FROM BingSearchTerms");
            }
            else
            {
                command.Append("SELECT * FROM BingSearchTerms");
            }

            if(filters.Length > 0)
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

            System.Diagnostics.Debug.WriteLine("########################################################################################");
            System.Diagnostics.Debug.WriteLine(command.ToString());
            System.Diagnostics.Debug.WriteLine("########################################################################################");
            return await _context.BingSearchTerms.FromSqlRaw(command.ToString()).ToListAsync();
        }

        //-------------------------------------------------------------UTILITY---------------------------------------------------------------------//
        private bool SearchTermExists(Guid id)
        {
            return _context.BingSearchTerms.Any(e => e.id == id);
        }
    }
}
