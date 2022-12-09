using Carrefour.CashFlow.Entities;
using Carrefour.Framework.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Security.Claims;

namespace Carrefour.CashFlow.Data
{
    public class CashFlowDbContext : DbContext
    {
        private readonly IServiceProvider serviceProvider;

        public CashFlowDbContext(IServiceProvider serviceProvider)
        {
            this.serviceProvider = serviceProvider;
        }

        public CashFlowDbContext(DbContextOptions<CashFlowDbContext> options, IServiceProvider serviceProvider)
            : base(options)
        {
            this.serviceProvider = serviceProvider;
        }


        public DbSet<Movement> Movements { get; set; }

        public DbSet<Consolidated> Consolidated { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);


            modelBuilder.ApplyConfiguration(new MovementConfiguration());
            modelBuilder.ApplyConfiguration(new ConsolidatedConfiguration());


            modelBuilder.Model
                .GetEntityTypes()
                .SelectMany(e => e.GetForeignKeys())
                .ToList()
                .ForEach(fk => fk.DeleteBehavior = DeleteBehavior.Restrict);
        }

        public override async Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default)
        {
            this.FillTrackable();

            return await base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
        }

        public override int SaveChanges(bool acceptAllChangesOnSuccess)
        {
            this.FillTrackable();

            return base.SaveChanges(acceptAllChangesOnSuccess);
        }
    }
}