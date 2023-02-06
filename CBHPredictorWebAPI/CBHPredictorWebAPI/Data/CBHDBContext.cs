using CBHPredictorWebAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace CBHPredictorWebAPI.Data
{
    public class CBHDBContext : DbContext
    {
        // Defines the DBContext and all tables assigned to it
        public CBHDBContext(DbContextOptions<CBHDBContext> options) : base(options) {}

        public DbSet<OrderEntry> OrderEntries { get; set; }
        public DbSet<LeadEntry> LeadEntries { get; set; }
        public DbSet<GoogleSearchTerm> GoogleSearchTerms { get; set; }
        public DbSet<BingSearchTerm> BingSearchTerms { get; set; }
        public DbSet<UserModel> UserModels { get; set; }

        // Inserts a user into the database when it's created
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserModel>().HasData(new UserModel
            {
                id = Guid.NewGuid(),
                UserName = "Vm0wd2QyUXlVWGxWV0d4V1YwZDRWMVl3WkRSV01WbDNXa1JTV0ZKdGVGWlZNakExVmpBeFYySkVUbGhoTWsweFZtcEdZV015U2tWVWJHaG9UVlZ3VlZadGNFZFRNbEpJVm10V1VtSlZXbGhXYlhoelRURmFkR05GU214U2JHdzFWVEowVjFaWFNraGhSemxWVm14YU0xWnNXbUZqVmtaMFVteFNUbUpGY0VwV2JURXdZVEZrU0ZOclpHcFNWR3hoV1d4U1IyUnNXbGRYYlVaclVqQTFSMWRyV25kV01ERkZVbFJHVjFaRmIzZFdha1poVjBaT2NtRkhhRk5sYlhoWFZtMHhORmxWTUhoWGJrNVlZbFZhY2xWcVFURlNNVlY1VFZSU1ZrMXJjRmhWTW5SM1ZqSktWVkpZWkZwV1JWcHlWVEJhVDJOc2NFaGpSazVYVWpOb2IxWXhaRFJWTVVsNVZXNU9XR0pIVWxsWmJHaFRWMFpTVjJGRlRsTmlSbkJaV2xWb2ExWXdNVVZTYTFwV1lrWktSRlpxUVhoa1ZsWjFWMnhhYUdFeGNGbFhhMVpoVkRKTmVGcElUbWhTTW5oVVdWUk9RMWRzV1hoWGJYUk9VakZHTlZaWE5VOWhiRXAwVld4c1dtSkdXbWhaTW5oWFl6RldjbHBHVW1sU00yaFlWbXBLTkZReFdsaFRhMlJxVW0xNGFGVXdhRU5UUmxweFUydGFiRlpzV2xwWGExcDNZa2RGZWxGcmJGZGlXRUpJVmtSS1UxWXhXblZVYkdocFZqTm9WVlpHWTNoaU1XUkhWMjVTVGxaRlNsaFVWbVEwVjBaYVdHUkhkRmhTTUZZMVZsZDRjMWR0U2tkWGJXaGFUVlp3VkZacVJtdGtWbkJHVGxaT2FWSnRPVE5XTW5oWFlUQXhSMWRzYUZSaE1sSnhWV3RXWVZZeFduRlViVGxyWWtad2VGVnRkREJoYXpGeVRsVm9XbFpXY0hKWlZXUkdaV3hHY21KR1pGZFNWWEJ2VmpGYWExVXhXWGhVYmxaVllrWktjRlZxUmt0V1ZscEhWV3RLYTAxRVJsTlZSbEYzVUZFOVBRPT0=",
                Email = "email",
                Password = "Vm0wd2QyUXlVWGxWV0d4V1YwZDRWMVl3WkRSWFJteFZVMjA1VjAxV2JETlhhMk0xVmpGYWMySkVUbGhoTWsweFZqQmFTMk15U2tWVWJHaG9UV3N3ZUZadGNFZFRNazE1VTJ0V1ZXSkhhRzlVVmxaM1ZsWmFkR05GWkZSTmF6RTFWVEowVjFaWFNraGhSemxWVmpOT00xcFZXbUZrUjA1R1drWndWMDFFUlRGV1ZFb3dWakZhV0ZOcmFHaFNlbXhXVm0xNFlVMHhXbk5YYlVacVZtdGFNRlZ0ZUZOVWJVcEdZMFZ3VjJKVVJYZFdha1pYWkVaT2MxZHNhR2xTTW1oWlYxZDRiMkl5Vm5OVmJGWlRZbFZhY2xWcVFURlNNWEJHVjJ4T1ZXSkdjRmxhU0hCSFZqRmFSbUl6WkZkaGExcG9WakJhVDJOdFNrZFRiV3hUVFcxb1dsWXhaRFJpTWtsM1RVaG9XR0pIVWxsWmJHaFRWMFpTVjFkdVpFNVNiRm93V2xWYVQxWlhTbFpYVkVwV1lrWktSRlpxU2tkamJVVjZZVVphYUdFeGNHOVdha0poVkRKT2RGSnJaRmhpVjJoeldXeG9iMkl4V25STldHUlZUV3RzTlZWdGRHdGhiRXAwVld4c1dtSkhhRlJXTUZwVFZqSkdSbFJzVG1sU2JrSmFWMnhXYjJFeFdYZE5WVlpUWWtkU1lWUlZXbUZOTVZweFUydDBWMVpyY0ZwWGExcDNZa2RGZWxGcmJGaFhTRUpJVmtSS1UxWXhXblZVYkdocFZqSm9lbGRYZUc5aU1rbDRWMWhvWVZKR1NuQlVWM1J6VGtaYVdHUkhkR2hXYXpWSFZqSjRVMWR0U2tkWGJXaGFUVlp3VkZacVJtdGtWbkJHVGxaT2FWSnRPVE5XTW5oWFlUQXhSMWRzYUZSaE1sSnhWV3RXWVZZeFduRlViVGxyWWtad2VGVnRkREJoYXpGeVRsVm9XbFpXY0hKWlZXUkdaV3hHY21KR1pGZFNWWEJ2VmpGYWExVXhXWGhVYmxaVllrWktjRlZxUmt0V1ZscEhWV3RLYTAxRVJsTlZSbEYzVUZFOVBRPT0="
            });
        }
    }
}
