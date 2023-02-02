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
        public enum OrderColumns { customerID, orderID, orderDate, orderPrice, storageTemp, donorID, cbhSampleID, matrix, supplierID, supplierSampleID, productID, countryID, quantity , unit , age , gender , ethnicity , labParameter , resultNumerical , resultUnit , resultInterpretation , testMethod , testKitManufacturer , testSystemManufacturer , diagnosis , icd , histologicalDiagnosis , organ , collectionCountry , collectionDate }
        public enum order { ascending, descending }

        public OrderEntriesController(CBHDBContext context)
        {
            _context = context;
        }

        // GET: api/OrderEntries
        // Gets all Entries in the OrderEntries Table
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderEntry>>> GetOrderEntries()
        {
            return await _context.OrderEntries.OrderBy(e => e.orderDate).ToListAsync();
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

        [HttpGet("count")]
        public async Task<int> CountRows()
        {
            return await _context.OrderEntries.CountAsync();
        }

        [HttpGet("order-count")]
        public async Task<int> CountOrders()
        {
            return await _context.OrderEntries.Select(e => e.orderID).Distinct().CountAsync();
        }

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

        [HttpGet("date-count")]
        public async Task<ActionResult<IEnumerable<OrderDateResponse>>> CountDistinctDates()
        {
            List<OrderEntry> orderlist = await _context.OrderEntries.OrderBy(e => e.orderDate).ToListAsync();

            var date = "0";
            var index = -1;
            List<OrderDateResponse> response = new List<OrderDateResponse>();

            foreach(OrderEntry entry in orderlist) 
            {
                if(entry.orderDate.ToString().Remove(10) == date)
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
                    if(entry.orderID != orderID)
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

        [HttpGet("new-month-count")]
        public async Task<ActionResult<IDictionary<string, int>>> CountDistinctMonthsNew()
        {
            List<OrderEntry> orderlist = await _context.OrderEntries.OrderByDescending(e => e.orderDate).ThenBy(e => e.orderID).ToListAsync();

            var date = "0";
            var orderID = 0;
            
            Dictionary<string, int> response = new Dictionary<string, int>();

            foreach (OrderEntry entry in orderlist)
            {
                date = Convert.ToDateTime(entry.orderDate).ToString("yyyy-MM");
                if (response.ContainsKey(date))
                {
                    if (entry.orderID != orderID)
                    {
                        response[date]++;
                        orderID = entry.orderID ?? 0;
                    }
                }
                else
                {
                    orderID = entry.orderID ?? 0;
                    response.Add(date, 1);
                }
            }

            return response;
        }

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
                return CreatedAtAction("GetOrderEntry", new { id = orderEntry.id }, orderEntry);
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
