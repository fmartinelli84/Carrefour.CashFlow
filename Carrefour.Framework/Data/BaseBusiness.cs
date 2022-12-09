using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Carrefour.Framework.Data
{
    public abstract class BaseBusiness<TDbContext>
        where TDbContext : DbContext
    {
        protected readonly TDbContext dbContext;

        public BaseBusiness(TDbContext dbContext)
        {
            this.dbContext = dbContext;
        }
    }
}
