using Microsoft.AspNetCore.Mvc;
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
        public enum OrderColumns { customerID, orderID, orderDate, orderPrice, storageTemp, donorID, cbhSampleID, matrix, supplierID, supplierSampleID, productID, countryID, quantity , unit , age , gender , ethnicity , labParameter , resultNumerical , resultUnit , resultInterpretation , testMethod , testKitManufacturer , testSystemManufacturer , diagnosis , icd , histologicalDiagnosis , organ , collectionCountry , collectionDate }

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

        [HttpGet("ExportToExcel")]
        public async Task<IActionResult> ExportOrderEntriesToExcel()
        {
            try
            {
                List<OrderEntry> employees = await _context.OrderEntries.ToListAsync();
                FileStreamResult fr = ExportToExcel.CreateExcelFile.StreamExcelDocument
                                     (employees, "OrderEntries.xlsx");
                return fr;
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(ex);
            }
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

        [HttpGet("GetAny/{col}/{value}/{exact}")]
        public async Task<ActionResult<IEnumerable<OrderEntry>>> GetByAny(OrderColumns col, string value, bool exact)
        {
            string command;

            if (exact)
            {
                command = "SELECT * FROM OrderEntries WHERE [" + col + "] LIKE {0}";
            }
            else
            {
                command = "SELECT * FROM OrderEntries WHERE [" + col + "] LIKE '%' + {0} + '%'";
            }

            return await _context.OrderEntries.FromSqlRaw(command, value).ToListAsync();
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
            await _context.OrderEntries.AddAsync(orderEntry);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetOrderEntry", new { id = orderEntry.id }, orderEntry);
        }

        // DELETE: api/OrderEntries/5
        // Deletes one specific Entry in the OrderEntries Table by ID
        [HttpDelete("{id}")]
        public async Task<String> DeleteOrderEntry(Guid id)
        {
            await _context.OrderEntries.Where(e => e.id == id).ExecuteDeleteAsync();
            await _context.SaveChangesAsync();
            return "Success";
        }

        // DELETE: api/LeadEntries
        // Deletes all Entries in the OrderEntries Table
        [HttpDelete]
        public async Task<String> DeleteOrderEntries()
        {
            await _context.OrderEntries.ExecuteDeleteAsync();
            await _context.SaveChangesAsync();
            return "Success";
        }

        private bool OrderEntryExists(Guid id)
        {
            return _context.OrderEntries.Any(e => e.id == id);
        }
    }
}
