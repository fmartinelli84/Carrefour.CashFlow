using Carrefour.Framework.Data;

namespace Carrefour.CashFlow.Dtos
{
    public class MovementDto : BaseTrackableDto
    {
        public long Id { get; set; }

        public DateTime Date { get; set; }

        public MovementType Type { get; set; }

        public decimal Value { get; set; }
    }
}