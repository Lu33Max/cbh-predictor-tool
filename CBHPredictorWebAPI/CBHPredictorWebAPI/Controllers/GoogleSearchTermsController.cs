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
    public class GoogleSearchTermsController : ControllerBase
    {
        private readonly CBHDBContext _context;

        public GoogleSearchTermsController(CBHDBContext context)
        {
            _context = context;
        }

        //------------------------------------------------------------BASIC-CRUD---------------------------------------------------------------------//
        // Returns all entries in the BingSearchTerms table
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GoogleSearchTerm>>> GetSearchTerms()
        {
            return await _context.GoogleSearchTerms.OrderBy(e => e.date).ThenBy(e => e.terms).ToListAsync();
        }

        // Returns one specific entry in the BingSearchTerms table by ID
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

        // Edits one specific entry in the GoogleSearchTerms table by ID
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

        // Adds one entry to the GoogleSearchTerms table
        [HttpPost]
        public async Task<ActionResult<GoogleSearchTerm>> PostSearchTerm(GoogleSearchTerm googleSearchTerm)
        {
            googleSearchTerm.id = Guid.NewGuid();
            await _context.GoogleSearchTerms.AddAsync(googleSearchTerm);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetSearchTerm", new { googleSearchTerm.id }, googleSearchTerm);
        }

        // Deletes one specific entry in the GoogleSearchTerms table by ID
        [HttpDelete("{id}")]
        public async Task<string> DeleteSearchTerm(Guid id)
        {
            await _context.GoogleSearchTerms.Where(e => e.id == id).ExecuteDeleteAsync();
            await _context.SaveChangesAsync();
            return "{\"success\":1}";
        }

        // Deletes all entries in the GoogleSearchTerms table
        [HttpDelete]
        public async Task<string> DeleteSearchTerms()
        {
            await _context.GoogleSearchTerms.ExecuteDeleteAsync();
            await _context.SaveChangesAsync();
            return "{\"success\":1}";
        }

        //---------------------------------------------------------SPECIFIC-OPERATIONS------------------------------------------------------------------//
        // Returns the number of all entries in the GoogleSearchTerms table
        [HttpGet("count")]
        public async Task<int> CountRows()
        {
            return await _context.GoogleSearchTerms.CountAsync();
        }

        // Returns a custom response consisting of all months and the number of impressions in each one
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

        // Returns a custom response consisting of all months and the number of clicks in each one
        // TODO: Combine with method above
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

        // Returns the two most searched terms of the latest month
        // TODO: Switch between impressions and clicks
        [HttpGet("topterms")]
        public async Task<ActionResult<IEnumerable<string?>>> GetTopTerms()
        {
            List<string?> top = await _context.GoogleSearchTerms.OrderBy(e => e.date).ThenByDescending(e => e.impressions).Take(2).Select(e => e.terms).ToListAsync();
            return top;
        }

        // Returns a list of all months stored in the database
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

        // Exports the GoogleSearchTerms table as an Excel file
        // TODO: Add functionality to export with active filters
        [HttpGet("export")]
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

        //-------------------------------------------------------------FILTER----------------------------------------------------------------------//
        // Creates and executes custom SQL query based on inputted filters and sorting
        // TODO: Add Possibility to return only specified columns
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
