using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CBHPredictorWebAPI.Data;
using CBHPredictorWebAPI.Models;
using System.Text;
using System.Net;
using static CBHPredictorWebAPI.Controllers.BingSearchTermsController;

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

        [HttpGet("SortByColumn")]
        public async Task<ActionResult<IEnumerable<OrderEntry>>> SortByColumn(OrderColumns col, Order order)
        {
            if (order == Order.ascending)
            {
                return await _context.OrderEntries.FromSqlRaw("SELECT * FROM OrderEntries ORDER BY [" + col + "] ASC").ToListAsync();
            }
            else
            {
                return await _context.OrderEntries.FromSqlRaw("SELECT * FROM OrderEntries ORDER BY [" + col + "] DESC").ToListAsync();
            }
        }

        [HttpGet("ExportToExcel")]
        public async Task<IActionResult> ExportOrderEntriesToExcel()
        {
            try
            {
                List<OrderEntry> sheet = await _context.OrderEntries.OrderBy(e => e.cbhSampleID + 0).ToListAsync();
                FileStreamResult fr = ExportToExcel.CreateExcelFile.StreamExcelDocument(sheet, "OrderEntries.xlsx");

                return fr;
                
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(ex);
            }
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

            orderEntry.lastEdited = DateTime.Now;
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

            return Ok(orderEntry);
        }

        // POST: api/OrderEntries
        // Adds one Entry to the OrderEntries Table
        [HttpPost]
        public async Task<ActionResult<OrderEntry>> PostOrderEntry(OrderEntry orderEntry)
        {
            if (!_context.OrderEntries.Any(e => e.cbhSampleID == orderEntry.cbhSampleID))
            {
                orderEntry.id = Guid.NewGuid();
                orderEntry.lastEdited = DateTime.Now;
                await _context.OrderEntries.AddAsync(orderEntry);
                await _context.SaveChangesAsync();
                return CreatedAtAction("GetLeadEntry", new { id = orderEntry.id }, orderEntry);
            }
            else
            {
                return BadRequest();
            }
        }

        // DELETE: api/OrderEntries/5
        // Deletes one specific Entry in the OrderEntries Table by ID
        [HttpDelete("{id}")]
        public async Task<string> DeleteOrderEntry(Guid id)
        {
            await _context.OrderEntries.Where(e => e.id == id).ExecuteDeleteAsync();
            await _context.SaveChangesAsync();
            return "{\"success\":1}";
        }

        // DELETE: api/LeadEntries
        // Deletes all Entries in the OrderEntries Table
        [HttpDelete]
        public async Task<string> DeleteOrderEntries()
        {
            await _context.OrderEntries.ExecuteDeleteAsync();
            await _context.SaveChangesAsync();
            return "{\"success\":1}";
        }

        //-------------------------------------------------------------FILTER----------------------------------------------------------------------//
        //---- Apply Filter ----//
        [HttpGet("ApplyFilter/{relation}")]
        public async Task<ActionResult<IEnumerable<OrderEntry>>> ApplyFilter(string relation)
        {
            var command = new StringBuilder("SELECT * FROM OrderEntries WHERE ");
            string? filter = HttpContext.Session.GetString("OrderFilter");

            if (!string.IsNullOrEmpty(filter))
            {
                filter = filter.Remove(0, 1);
                string[] filters = filter.Split(";");

                if (relation.Equals("AND"))
                {
                    filter = string.Join(" AND ", filters);
                }
                else
                {
                    filter = string.Join(" OR ", filters);
                }

                command.Append(filter);
                return await _context.OrderEntries.FromSqlRaw(command.ToString()).ToListAsync();
            }

            return BadRequest();
        }

        //---- Add new Filter ----//
        // Add Single Filter
        [HttpPost("AddSingleFilter/{col}/{value}/{exact}")]
        public string AddSingleFilter(string col, string value, bool exact)
        {
            string filter = CreateSingleFilterString(col, value, exact);
            HttpContext.Session.SetString("OrderFilter", HttpContext.Session.GetString("OrderFilter") + ";" + filter);
            return "{\"success\":1}";
        }

        // Add Range Filter
        [HttpPost("AddRangeFilter/{col}/{fromVal}/{toVal}")]
        public string AddRangeFilter(string col, string fromVal, string toVal)
        {
            string filter = CreateRangeFilterString(col, fromVal, toVal);
            HttpContext.Session.SetString("OrderFilter", HttpContext.Session.GetString("OrderFilter") + ";" + filter);
            return "{\"success\":1}";
        }

        // Add Comparing Filter
        [HttpPost("AddCompareFilter/{col}/{value}/{before}")]
        public string AddCompareFilter(string col, string value, bool before)
        {
            string filter = CreateCompareFilterString(col, value, before);
            HttpContext.Session.SetString("OrderFilter", HttpContext.Session.GetString("OrderFilter") + ";" + filter);
            return "{\"success\":1}";
        }

        //---- Remove existing Filter ----//
        // Remove Single Filter
        [HttpDelete("RemoveSingleFilter/{col}/{value}/{exact}")]
        public string RemoveSingleFilter(string col, string value, bool exact)
        {
            string filter = ";" + CreateSingleFilterString(col, value, exact);
            string? allFilters = HttpContext.Session.GetString("OrderFilter");

            allFilters = allFilters.Replace(filter, "");

            HttpContext.Session.SetString("OrderFilter", allFilters);

            return "{\"success\":1}";
        }

        // Remove Range Filter
        [HttpDelete("RemoveRangeFilter/{col}/{fromVal}/{toVal}")]
        public string RemoveRangeFilter(string col, string fromVal, string toVal)
        {
            string filter = ";" + CreateRangeFilterString(col, fromVal, toVal);
            string? allFilters = HttpContext.Session.GetString("OrderFilter");

            allFilters = allFilters.Replace(filter, "");

            HttpContext.Session.SetString("OrderFilter", allFilters);

            return "{\"success\":1}";
        }

        // Remove Comparing Filter
        [HttpDelete("RemoveCompareFilter/{col}/{value}/{before}")]
        public string RemoveCompareFilter(string col, string value, bool before)
        {
            string filter = ";" + CreateCompareFilterString(col, value, before);
            string? allFilters = HttpContext.Session.GetString("OrderFilter");

            allFilters = allFilters.Replace(filter, "");

            HttpContext.Session.SetString("OrderFilter", allFilters);

            return "{\"success\":1}";
        }

        // Remove all Filter
        [HttpDelete("RemoveAllFilter")]
        public string RemoveAllFilter()
        {
            HttpContext.Session.SetString("OrderFilter", string.Empty);
            return "{\"success\":1}";
        }

        //---- Create Filter Strings ----//
        private string CreateSingleFilterString(string col, string value, bool exact)
        {
            if (exact)
            {
                return "[" + col + "] LIKE '" + value + "'";
            }
            else
            {
                return "[" + col + "] LIKE '%" + value + "%'";
            }
        }
        private string CreateRangeFilterString(string col, string fromVal, string toVal)
        {
            return "[" + col + "] BETWEEN '" + fromVal + "' AND '" + toVal + "'";
        }
        private string CreateCompareFilterString(string col, string value, bool before)
        {
            if (before)
            {
                return "[" + col + "] < '" + value + "'";
            }
            else
            {
                return "[" + col + "] > '" + value + "'";
            }
        }

        //-------------------------------------------------------------UTILITY---------------------------------------------------------------------//
        private bool OrderEntryExists(Guid id)
        {
            return _context.OrderEntries.Any(e => e.id == id);
        }
    }
}
