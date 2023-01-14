using CBHPredictorWebAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace CBHPredictorWebAPI.Data
{
    public class CBHDBContext : DbContext
    {
        public CBHDBContext(DbContextOptions<CBHDBContext> options) : base(options) {}

        public DbSet<OrderEntry> OrderEntries { get; set; }
        public DbSet<LeadEntry> LeadEntries { get; set; }
        public DbSet<GoogleSearchTerm> GoogleSearchTerms { get; set; }
        public DbSet<BingSearchTerm> BingSearchTerms { get; set; }
        public DbSet<UserModel> UserModels { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserModel>().HasData(new UserModel
            {
                id = Guid.NewGuid(),
                UserName = "name",
                Email = "email",
                Password = "password"
            });
        }
    }
}
