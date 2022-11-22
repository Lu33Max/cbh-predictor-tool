﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CBHPredictorWebAPI.Data;
using CBHPredictorWebAPI.Models;

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
        // Gets all Entries in the OrderEntries Table
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderEntry>>> GetOrderEntries()
        {
            return await _context.OrderEntries.ToListAsync();
        }

        // GET: api/OrderEntries/5
        // Gets one specific Entry in the OrderEntries Table by ID
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
        // Edits one specific Entry in the OrderEntries Table by ID
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
        // Adds one Entry to the OrderEntries Table
        [HttpPost]
        public async Task<ActionResult<OrderEntry>> PostOrderEntry(OrderEntry orderEntry)
        {
            _context.OrderEntries.Add(orderEntry);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetOrderEntry", new { id = orderEntry.id }, orderEntry);
        }

        // DELETE: api/OrderEntries/5
        // Deletes one specific Entry in the OrderEntries Table by ID
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

        // DELETE: api/LeadEntries
        // Deletes all Entries in the OrderEntries Table
        [HttpDelete]
        public async Task<ActionResult<IEnumerable<OrderEntry>>> DeleteOrderEntries()
        {
            var list = new List<OrderEntry>();
            list = await _context.OrderEntries.ToListAsync();

            var orderEntry = list[0];
            while (orderEntry != null)
            {
                _context.OrderEntries.Remove(orderEntry);
                await _context.SaveChangesAsync();
                list = await _context.OrderEntries.ToListAsync();

                if (list.Count == 0)
                {
                    break;
                }
                else
                {
                    orderEntry = list[0];
                }
            }

            return NoContent();
        }

        private bool OrderEntryExists(Guid id)
        {
            return _context.OrderEntries.Any(e => e.id == id);
        }
    }
}
