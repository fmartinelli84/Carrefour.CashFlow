using Carrefour.CashFlow.Dtos;
using Carrefour.Framework.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Carrefour.CashFlow.Entities
{
    public class Consolidated : BaseTrackableEntity, IMapFromDto<ConsolidatedDto, Consolidated>
    {
        public Consolidated()
        {
        }

        public Consolidated(ConsolidatedDto dto, DbContext dbContext)
        {
            this.FromDto(dto, dbContext);
        }

        public long Id { get; set; }

        public DateTime Date { get; set; }

        public decimal Value { get; set; }



        public static readonly Expression<Func<Consolidated, ConsolidatedDto>> ToFullDto =
            v => new ConsolidatedDto()
            {
                Id = v.Id,
                Date = v.Date,
                Value = v.Value,

                CreatedAtDate = v.CreatedAtDate,
                ModifiedAtDate = v.ModifiedAtDate
            };


        public Consolidated FromDto(ConsolidatedDto dto, DbContext dbContext)
        {
            this.Id = dto.Id;
            this.Date = dto.Date.Date;
            this.Value = dto.Value;

            return this;
        }
    }

    public class ConsolidatedConfiguration : BaseEntityTypeConfiguration<Consolidated>
    {
        public override void Configure(EntityTypeBuilder<Consolidated> builder)
        {
            builder.HasIndex(e => e.Date).IsUnique();
            builder.Property(e => e.Value).HasColumnType("decimal(18,2)");
        }
    }
}
