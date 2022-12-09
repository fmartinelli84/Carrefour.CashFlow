using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Carrefour.Framework.Data;

namespace Carrefour.Framework.Data
{
    public static class DbContextExtensions
    {
        public static void FillTrackable(this DbContext dbContext)
        {
            dbContext.ChangeTracker.DetectChanges();

            foreach (var entry in dbContext.ChangeTracker.Entries())
            {
                if (entry.State == EntityState.Detached || entry.State == EntityState.Unchanged)
                    continue;

                if (entry.Entity is IReadOnlyTrackableEntity readOnlyTrackableEntity)
                {
                    if (entry.State == EntityState.Added)
                    {
                        readOnlyTrackableEntity.CreatedAtDate = DateTime.Now;

                        if (entry.Entity is ITrackableEntity trackableEntity)
                        {
                            trackableEntity.ModifiedAtDate = readOnlyTrackableEntity.CreatedAtDate;
                        }
                    }
                    else if (entry.State == EntityState.Modified)
                    {
                        entry.Property(nameof(IReadOnlyTrackableEntity.CreatedAtDate)).IsModified = false;

                        if (entry.Entity is ITrackableEntity trackableEntity)
                        {
                            trackableEntity.ModifiedAtDate = DateTime.Now;
                        }
                    }
                }
            }
        }

        public static IQueryable Set(this DbContext context, Type type)
        {
            var method = typeof(DbContext).GetMethods().Single(p =>
            p.Name == nameof(DbContext.Set) && p.ContainsGenericParameters && !p.GetParameters().Any());

            // Build a method with the specific type argument you're interested in
            method = method.MakeGenericMethod(type);

            return (method.Invoke(context, null) as IQueryable)!;
        }
    }
}
