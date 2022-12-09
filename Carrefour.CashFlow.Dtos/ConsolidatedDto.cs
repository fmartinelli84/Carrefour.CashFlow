using Carrefour.Framework.Data;

namespace Carrefour.CashFlow.Dtos
{
    public class ConsolidatedDto : BaseTrackableDto
    {
        public long Id { get; set; }

        public DateTime Date { get; set; }

        public decimal Value { get; set; }
    }
}