using Carrefour.CashFlow.Dtos;
using Carrefour.Framework.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Linq.Expressions;

namespace Carrefour.CashFlow.Entities
{
    public class Movement : BaseTrackableEntity, IMapFromDto<MovementDto, Movement>
    {
        public Movement()
        {
        }

        public Movement(MovementDto dto, DbContext dbContext)
        {
            this.FromDto(dto, dbContext);
        }

        public long Id { get; set; }

        public DateTime Date { get; set; }

        public MovementType Type { get; set; }

        public decimal Value { get; set; }



        public static readonly Expression<Func<Movement, MovementDto>> ToFullDto =
            m => new MovementDto()
            {
                Id = m.Id,
                Date = m.Date,
                Type = m.Type,
                // Na hora de ler converte os débitos para valores positivos
                Value = m.Type == MovementType.Debit ? m.Value * -1 : m.Value,

                CreatedAtDate = m.CreatedAtDate,
                ModifiedAtDate = m.ModifiedAtDate
            };


        public Movement FromDto(MovementDto dto, DbContext dbContext)
        {
            this.Id = dto.Id;
            this.Date = dto.Date.Date;
            this.Type = dto.Type;
            // Na hora de salvar converte os débitos para valores negativos
            this.Value = dto.Type == MovementType.Debit ? dto.Value * -1 : dto.Value;

            return this;
        }
    }

    public class MovementConfiguration : BaseEntityTypeConfiguration<Movement>
    {
        public override void Configure(EntityTypeBuilder<Movement> builder)
        {
            builder.Property(e => e.Value).HasColumnType("decimal(18,2)");
        }
    }
}