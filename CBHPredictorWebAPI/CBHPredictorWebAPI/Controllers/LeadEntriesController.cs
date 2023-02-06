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
    public class LeadEntriesController : ControllerBase
    {
        private readonly CBHDBContext _context;

        public LeadEntriesController(CBHDBContext context)
        {
            _context = context;
        }

        //------------------------------------------------------------BASIC-CRUD---------------------------------------------------------------------//
        // Returns all Entries in the LeadEntries table
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LeadEntry>>> GetLeadEntries()
        {
            return await _context.LeadEntries.OrderBy(e => e.leadDate).ToListAsync();
        }

        // Returns one specific Entry in the LeadEntries table by ID
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

        // Edits one specific Entry in the LeadEntries table by ID
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

        // Adds one Entry to the LeadEntries table
        [HttpPost]
        public async Task<ActionResult<LeadEntry>> PostLeadEntry(LeadEntry leadEntry)
        {
            if (!_context.LeadEntries.Any(e => e.leadID == leadEntry.leadID))
            {
                leadEntry.id = Guid.NewGuid();
                leadEntry.lastEdited = DateTime.Now;
                await _context.LeadEntries.AddAsync(leadEntry);
                await _context.SaveChangesAsync();
                return CreatedAtAction("GetLeadEntry", new { leadEntry.id }, leadEntry);
            }
            else
            {
                return BadRequest();
            }
        }

        // Deletes one specific Entry in the LeadEntries table by ID
        [HttpDelete("{id}")]
        public async Task<string> DeleteLeadEntry(Guid id)
        {
            await _context.LeadEntries.Where(e => e.id == id).ExecuteDeleteAsync();
            await _context.SaveChangesAsync();
            return "{\"success\":1}";
        }

        // Deletes all Entries in the LeadEntries table
        [HttpDelete]
        public async Task<string> DeleteLeadEntries()
        {
            await _context.LeadEntries.ExecuteDeleteAsync();
            await _context.SaveChangesAsync();
            return "{\"success\":1}";
        }

        //---------------------------------------------------------SPECIFIC-OPERATIONS------------------------------------------------------------------//
        // Returns the number of all entries in the LeadEntries table
        [HttpGet("count")]
        public async Task<int> CountRows()
        {
            return await _context.LeadEntries.CountAsync();
        }

        // Returns a list of all months stored in the database
        // TODO: Add possibility to return other periods (days, years)
        [HttpGet("dates")]
        public async Task<ActionResult<IEnumerable<string>>> GetAllDates()
        {
            List<DateTime?> leadlist = await _context.LeadEntries.OrderByDescending(e => e.leadDate).Select(e => e.leadDate).ToListAsync();

            var date = "0";

            List<string> response = new List<string>();

            foreach (DateTime entry in leadlist)
            {
                if (Convert.ToDateTime(entry).ToString("yyyy-MM") != date)
                {
                    response.Add(Convert.ToDateTime(entry).ToString("yyyy-MM"));
                    date = Convert.ToDateTime(entry).ToString("yyyy-MM");
                }
            }

            return response;
        }

        // Exports the LeadEntries table as an Excel file
        // TODO: Add functionality to export with active filters
        [HttpGet("export")]
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

        //-------------------------------------------------------------FILTER----------------------------------------------------------------------//
        // Creates and executes custom SQL query based on inputted filters and sorting
        // TODO: Add Possibility to return only specified columns
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

                command.Append( " WHERE ");

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
