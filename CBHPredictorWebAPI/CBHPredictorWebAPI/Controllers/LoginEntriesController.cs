using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CBHPredictorWebAPI.Data;
using CBHPredictorWebAPI.Models;
using Microsoft.IdentityModel.Tokens;

namespace CBHPredictorWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginEntriesController : ControllerBase
    {
        private readonly CBHDBContext _context;

        public LoginEntriesController(CBHDBContext context)
        {
            _context = context;
        }

        // GET: api/LoginEntries
        // Gets all Entries in the LoginEntries Table
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LoginEntry>>> GetLoginEntries()
        {
            return await _context.LoginEntries.ToListAsync();
        }

        // GET: api/LeadEntries/5
        // Gets one specific Entry in the LeadEntries Table by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<LoginEntry>> GetLoginEntry(Guid id)
        {
            var loginEntry = await _context.LoginEntries.FindAsync(id);

            if (loginEntry == null)
            {
                return NotFound();
            }

            return loginEntry;
        }

        // POST: api/LoginEntries
        // Adds one Entry to the LoginEntries Table
        [HttpPost]
        public async Task<ActionResult<LoginEntry>> PostLoginEntry(LoginEntry loginEntry)
        {
            if(SearchForEntry(loginEntry.name, loginEntry.password))
            {
                return BadRequest();
            }
            else
            {
                loginEntry.id = Guid.NewGuid();
                loginEntry.name = Encode(Encode(loginEntry.name));
                loginEntry.password = Encode(Encode(loginEntry.password));

                await _context.LoginEntries.AddAsync(loginEntry);
                await _context.SaveChangesAsync();
                return CreatedAtAction("GetLoginEntry", new { id = loginEntry.id }, loginEntry);
            }
        }

        // GET: api/LoginEntries/SearchForEntry/name/password
        // Searches for a specific Entry in the LoginEntries Table by a given name and password
        [HttpGet("SearchForEntry/{name}/{password}")]
        public Boolean SearchForEntry(string name, string password)
        {
            name = Encode(name);
            password = Encode(password);

            return !_context.LoginEntries.Where(e => e.name == name && e.password == password).IsNullOrEmpty<LoginEntry>();
        }

        // PUT: api/LeadEntries/5
        // Edits one specific Entry in the LeadEntries Table by ID
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLeadEntry(Guid id, LoginEntry leadEntry)
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
                if (!LoginEntryExists(id))
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

        // DELETE: api/LeadEntries/5
        // Deletes one specific Entry in the LeadEntries Table by ID
        [HttpDelete("{id}")]
        public async Task<String> DeleteLoginEntry(Guid id)
        {
            await _context.LoginEntries.Where(e => e.id == id).ExecuteDeleteAsync();
            await _context.SaveChangesAsync();
            return "{\"success\":1}";
        }

        // DELETE: api/LeadEntries
        // Deletes all Entries in the LeadEntries Table
        [HttpDelete]
        public async Task<String> DeleteLoginEntries()
        {
            await _context.LoginEntries.ExecuteDeleteAsync();
            await _context.SaveChangesAsync();
            return "{\"success\":1}";
        }

        // Encodes an input string
        private string Encode(string value)
        {
            byte[] encData_byte = new byte[value.Length];
            int i = 0;

            while (value.Length < 1024)
            {
                encData_byte = System.Text.Encoding.UTF8.GetBytes(value);
                value = Convert.ToBase64String(encData_byte);
                i++;
            }

            return value;
        }

        private bool LoginEntryExists(Guid id)
        {
            return _context.LoginEntries.Any(e => e.id == id);
        }
    }
}
