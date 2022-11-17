using CBHPredictorWebAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace CBHPredictorWebAPI.Data
{
    public class CBHDBContext : DbContext
    {
        public CBHDBContext(DbContextOptions<CBHDBContext> options) : base(options) {}

        public DbSet<OrderEntry> OrderEntries { get; set; }
        public DbSet<LeadEntry> LeadEntries { get; set; }
    }
}
