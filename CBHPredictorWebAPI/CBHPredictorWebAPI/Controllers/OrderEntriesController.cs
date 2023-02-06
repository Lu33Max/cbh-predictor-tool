using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CBHPredictorWebAPI.Data;
using CBHPredictorWebAPI.Models;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using System.Linq.Dynamic.Core;
using CBHPredictorWebAPI.Models.OrderModels;

namespace CBHPredictorWebAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class OrderEntriesController : ControllerBase
    {
        private readonly CBHDBContext _context;

        public OrderEntriesController(CBHDBContext context)
        {
            _context = context;
        }

        //------------------------------------------------------------BASIC-CRUD---------------------------------------------------------------------//
        // Returns all entries in the OrderEntries table
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderEntry>>> GetOrderEntries()
        {
            return await _context.OrderEntries.OrderBy(e => e.orderDate).ToListAsync();
        }

        // Returns one specific entry in the OrderEntries table by ID
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

        // Edits one specific entry in the OrderEntries table by ID
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

        // Adds one entry to the OrderEntries table
        [HttpPost]
        public async Task<ActionResult<OrderEntry>> PostOrderEntry(OrderEntry orderEntry)
        {
            if (!_context.OrderEntries.Any(e => e.cbhSampleID == orderEntry.cbhSampleID))
            {
                orderEntry.id = Guid.NewGuid();
                orderEntry.lastEdited = DateTime.Now;
                await _context.OrderEntries.AddAsync(orderEntry);
                await _context.SaveChangesAsync();
                return CreatedAtAction("GetOrderEntry", new { orderEntry.id }, orderEntry);
            }
            else
            {
                return BadRequest();
            }
        }

        // Deletes one specific entry in the OrderEntries table by ID
        [HttpDelete("{id}")]
        public async Task<string> DeleteOrderEntry(Guid id)
        {
            await _context.OrderEntries.Where(e => e.id == id).ExecuteDeleteAsync();
            await _context.SaveChangesAsync();
            return "{\"success\":1}";
        }

        // DELETE: api/LeadEntries
        // Deletes all Entries in the OrderEntries table
        [HttpDelete]
        public async Task<string> DeleteOrderEntries()
        {
            await _context.OrderEntries.ExecuteDeleteAsync();
            await _context.SaveChangesAsync();
            return "{\"success\":1}";
        }

        //---------------------------------------------------------SPECIFIC-OPERATIONS------------------------------------------------------------------//
        // Returns the number of all entries in the OrderEntries table
        [HttpGet("count")]
        public async Task<int> CountRows()
        {
            return await _context.OrderEntries.CountAsync();
        }

        // Returns the number of individual orders (entries with different orderID)
        [HttpGet("order-count")]
        public async Task<int> CountOrders()
        {
            return await _context.OrderEntries.Select(e => e.orderID).Distinct().CountAsync();
        }

        // Returns the number of distinct product prices in the form required by chart displaying it
        [HttpGet("price-count")]
        public async Task<ActionResult<IEnumerable<OrderPriceResponse>>> CountDistinctPrices()
        {
            return await _context.OrderEntries.GroupBy(e => e.orderPrice).Select(o => new OrderPriceResponse()
            {
                id = o.Key + "specimen",
                group = "specimen",
                price = o.Key,
                volume = o.Distinct().Count()
            }
            ).OrderBy(e => e.price).ToListAsync();
        }

        // Returns the number of distinct order prices (sum of all products with the sam eorderID) in the form required by chart displaying it
        [HttpGet("orderprice-count")]
        public async Task<ActionResult<IEnumerable<OrderPriceResponse>>> CountPricePerOrder()
        {
            List<OrderPriceResponse> prices = await _context.OrderEntries.GroupBy(e => e.orderPrice).Select(o => new OrderPriceResponse()
            {
                id = o.Key + "order",
                group = "order",
                price = o.Key,
                volume = o.Distinct().Count()
            }
            ).OrderBy(e => e.price).ToListAsync();

            return prices.GroupBy(e => e.price).Select(o => new OrderPriceResponse()
            {
                id = o.Key + "order",
                group = "order",
                price = o.Key,
                volume = o.Distinct().Count()
            }
            ).OrderBy(e => e.price).ToList();
        }

        // Returns the number of orders by date (used for the calendar)
        [HttpGet("date-count")]
        public async Task<ActionResult<IEnumerable<OrderDateResponse>>> CountDistinctDates()
        {
            List<OrderEntry> orderlist = await _context.OrderEntries.OrderBy(e => e.orderDate).ToListAsync();

            var date = "0";
            var index = -1;

            List<OrderDateResponse> response = new List<OrderDateResponse>();

            foreach (OrderEntry entry in orderlist)
            {
                if (entry.orderDate.ToString().Remove(10) == date)
                {
                    response[index].value++;
                }
                else
                {
                    response.Add(new OrderDateResponse() { day = Convert.ToDateTime(entry.orderDate).ToString("yyyy-MM-dd"), value = 1 });
                    date = entry.orderDate.ToString().Remove(10);
                    index++;
                }
            }

            return response;
        }

        // Returns the number of individual orders (with different orderID) by month
        [HttpGet("month-count")]
        public async Task<ActionResult<IEnumerable<MonthValueResponse>>> CountDistinctMonths()
        {
            List<OrderEntry> orderlist = await _context.OrderEntries.OrderByDescending(e => e.orderDate).ThenBy(e => e.orderID).ToListAsync();

            var date = "0";
            var orderID = 0;
            var index = -1;

            List<MonthValueResponse> response = new List<MonthValueResponse>();

            foreach (OrderEntry entry in orderlist)
            {
                if (Convert.ToDateTime(entry.orderDate).ToString("yyyy-MM") == date)
                {
                    if (entry.orderID != orderID)
                    {
                        response[index].value++;
                        orderID = entry.orderID ?? 0;
                    }
                }
                else
                {
                    response.Add(new MonthValueResponse() { month = Convert.ToDateTime(entry.orderDate).ToString("yyyy-MM"), value = 1 });
                    date = Convert.ToDateTime(entry.orderDate).ToString("yyyy-MM");
                    orderID = entry.orderID ?? 0;
                    index++;
                }
            }

            return response;
        }

        //// Alternative concept for the above method; potential later use
        //[HttpGet("new-month-count")]
        //public async Task<ActionResult<IDictionary<string, int>>> CountDistinctMonthsNew()
        //{
        //    List<OrderEntry> orderlist = await _context.OrderEntries.OrderByDescending(e => e.orderDate).ThenBy(e => e.orderID).ToListAsync();

        //    var date = "0";
        //    var orderID = 0;

        //    Dictionary<string, int> response = new Dictionary<string, int>();

        //    foreach (OrderEntry entry in orderlist)
        //    {
        //        date = Convert.ToDateTime(entry.orderDate).ToString("yyyy-MM");
        //        if (response.ContainsKey(date))
        //        {
        //            if (entry.orderID != orderID)
        //            {
        //                response[date]++;
        //                orderID = entry.orderID ?? 0;
        //            }
        //        }
        //        else
        //        {
        //            orderID = entry.orderID ?? 0;
        //            response.Add(date, 1);
        //        }
        //    }

        //    return response;
        //}

        // Returns a list of all months stored in the database
        // TODO: Add possibility to return other periods (days, years)
        [HttpGet("dates")]
        public async Task<ActionResult<IEnumerable<string>>> GetAllDates()
        {
            List<DateTime?> orderlist = await _context.OrderEntries.OrderByDescending(e => e.orderDate).Select(e => e.orderDate).ToListAsync();

            var date = "0";

            List<string> response = new List<string>();

            foreach (DateTime entry in orderlist)
            {
                if (Convert.ToDateTime(entry).ToString("yyyy-MM") != date)
                {
                    response.Add(Convert.ToDateTime(entry).ToString("yyyy-MM"));
                    date = Convert.ToDateTime(entry).ToString("yyyy-MM");
                }
            }

            return response;
        }

        // Exports the OrderEntries table as an Excel file
        // TODO: Add functionality to export with active filters
        [HttpGet("export")]
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

        //-------------------------------------------------------------FILTER----------------------------------------------------------------------//
        // Creates and executes custom SQL query based on inputted filters and sorting
        // TODO: Add Possibility to return only specified columns
        [HttpPost("filter/{relation}/{sort}/{cols}")]
        public async Task<ActionResult<IEnumerable<OrderEntry>>> FilterEntries([FromBody] string[][] filters, [FromRoute] bool relation, string sort, string cols)
        {
            var command = new StringBuilder("");

            if (!String.IsNullOrEmpty(cols) && cols != "null")
            {
                command.Append("SELECT " + cols + " FROM OrderEntries");
            }
            else
            {
                command.Append("SELECT * FROM OrderEntries");
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

                if (!sort.Contains("orderID"))
                {
                    command.Append(", orderID ASC");
                }
            }

            return await _context.OrderEntries.FromSqlRaw(command.ToString()).ToListAsync();
        }

        //-------------------------------------------------------------UTILITY---------------------------------------------------------------------//
        private bool OrderEntryExists(Guid id)
        {
            return _context.OrderEntries.Any(e => e.id == id);
        }
    }
}
