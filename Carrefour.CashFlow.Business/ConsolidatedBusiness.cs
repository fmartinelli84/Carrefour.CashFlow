using Carrefour.CashFlow.Data;
using Carrefour.CashFlow.Dtos;
using Carrefour.CashFlow.Entities;
using Carrefour.Framework.Data;
using Carrefour.Framework.Exceptions;
using Carrefour.Framework.Jobs;
using Carrefour.Framework.Processes;
using LinqKit;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Security.Claims;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Carrefour.CashFlow.Business
{
    public class ConsolidatedBusiness : BaseBusiness<CashFlowDbContext>
    {
        private readonly ILogger<ConsolidatedBusiness> logger;

        public ConsolidatedBusiness(CashFlowDbContext dbContext, ILogger<ConsolidatedBusiness> logger)
            : base(dbContext)
        {
            this.logger = logger;
        }

        public async Task<List<ConsolidatedDto>> GetAllAsync()
        {
            var consolidated = await this.dbContext.Consolidated.AsExpandable()
                .Select(Consolidated.ToFullDto)
                .OrderByDescending(c => c.Date)
                .ToListAsync();

            return consolidated;
        }

        public async Task<bool> GenerateAsync(CancellationToken cancellationToken)
        {
            return await new EtlProcess(this.GetType().GetJobName(), this.logger)
                .ExtractMany(async () =>
                {
                    var consolidatedList = new List<Consolidated>();

                    // Captura a data inicial a partir da qual todas as consolidadas precisarão ser atualizadas
                    var initialDate = await this.dbContext.Movements
                        .Where(m =>
                            m.ModifiedAtDate >= this.dbContext.Consolidated.Max(c => c.ModifiedAtDate) ||
                            this.dbContext.Consolidated.Max(c => c.ModifiedAtDate) == null)
                        .OrderBy(m => m.Date)
                        .Select(m => (DateTime?)m.Date)
                        .FirstOrDefaultAsync(cancellationToken);


                    // Não tem nada para ser atualizado
                    if (initialDate is null)
                        return consolidatedList.AsEnumerable();


                    // Captura o saldo anterior e os lançamentos posteriores a data inicial
                    var movements = await
                        (from movement in this.dbContext.Movements
                         join c in this.dbContext.Consolidated on movement.Date equals c.Date into cg
                         from consolidated in cg.DefaultIfEmpty()
                         where
                             movement.Date >= initialDate
                         select new
                         {
                             ConsolidatedId = ((long?)consolidated.Id) ?? 0,
                             Date = movement.Date,
                             FirstConsolidatedValue =
                                 (movement.Date == initialDate ?
                                     (this.dbContext.Consolidated
                                         .Where(c => c.Date == this.dbContext.Consolidated.Where(c1 => c1.Date < movement.Date).Max(c1 => c1.Date))
                                         .Select(c => (decimal?)c.Value)
                                         .FirstOrDefault()) : null),
                             MovementValue = movement.Value
                         })
                        .OrderBy(c => c.Date)
                        .ToListAsync(cancellationToken);


                    // Soma o saldo anterior com os outros lançamentos, agrupando por dia
                    var consolidatedEntity = new Consolidated()
                    {
                        Id = 0,
                        Date = initialDate.Value,
                        Value = movements
                            .Where(m => m.FirstConsolidatedValue != null)
                            .Select(m => m.FirstConsolidatedValue)
                            .FirstOrDefault() ?? 0
                    };

                    foreach (var movement in movements)
                    {
                        if (consolidatedEntity.Date != movement.Date)
                        {
                            consolidatedList.Add(consolidatedEntity);

                            consolidatedEntity = new Consolidated()
                            {
                                Id = movement.ConsolidatedId,
                                Date = movement.Date,
                                Value = consolidatedList.Last().Value + movement.MovementValue
                            };
                        }
                        else
                        {
                            consolidatedEntity.Id = movement.ConsolidatedId;
                            consolidatedEntity.Date = movement.Date;
                            consolidatedEntity.Value += movement.MovementValue;
                        }
                    }

                    if (!consolidatedList.Contains(consolidatedEntity))
                    {
                        consolidatedList.Add(consolidatedEntity);
                    }



                    return consolidatedList
                        .OrderByDescending(m => m.Date)
                        .AsEnumerable();
                })
                .LoadMany(async consolidated =>
                {
                    foreach (var c in consolidated)
                    {
                        var entry = this.dbContext.Attach(c);

                        if (c.Id == 0)
                        {
                            entry.State = EntityState.Added;
                        }
                        else
                        {
                            entry.State = EntityState.Modified;
                        }
                    }

                    await this.dbContext.SaveChangesAsync(cancellationToken);
                })
                .Batch(1000)
                .RunAsync(cancellationToken);
        }
    }
}