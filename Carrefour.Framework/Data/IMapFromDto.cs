using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Carrefour.Framework.Data
{
    public interface IMapFromDto<TDto, TEntity>
        where TEntity : IMapFromDto<TDto, TEntity>
    {
        TEntity FromDto(TDto dto, DbContext dbContext);
    }
}
