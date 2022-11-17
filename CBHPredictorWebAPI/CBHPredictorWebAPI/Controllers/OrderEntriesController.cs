using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CBHPredictorWebAPI.Data;
using CBHPredictorWebAPI.Models;
using Microsoft.CodeAnalysis;
using System.Drawing.Drawing2D;

namespace CBHPredictorWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderEntriesController : ControllerBase
    {
        private readonly CBHDBContext _context;

        public OrderEntriesController(CBHDBContext context)
        {
            _context = context;
        }

        // GET: api/OrderEntries
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderEntry>>> GetOrderEntries()
        {
            return await _context.OrderEntries.ToListAsync();
        }

        // GET: api/OrderEntries/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderEntry>> GetOrderEntry([FromRoute]Guid id)
        {
            var orderEntry = await _context.OrderEntries.FindAsync(id);

            if (orderEntry == null)
            {
                return NotFound();
            }

            return orderEntry;
        }

        // PUT: api/OrderEntries/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrderEntry([FromRoute]Guid id, OrderEntry orderEntry)
        {
            if (id != orderEntry.id)
            {
                return BadRequest();
            }

            _context.Entry(orderEntry).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderEntryExists(id))
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

        // POST: api/OrderEntries
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<OrderEntry>> PostOrderEntry(OrderEntry orderEntry)
        {
            _context.OrderEntries.Add(orderEntry);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetOrderEntry", new { id = orderEntry.id }, orderEntry);
        }

        // DELETE: api/OrderEntries/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrderEntry(Guid id)
        {
            var orderEntry = await _context.OrderEntries.FindAsync(id);
            if (orderEntry == null)
            {
                return NotFound();
            }

            _context.OrderEntries.Remove(orderEntry);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OrderEntryExists(Guid id)
        {
            return _context.OrderEntries.Any(e => e.id == id);
        }
    }
}
