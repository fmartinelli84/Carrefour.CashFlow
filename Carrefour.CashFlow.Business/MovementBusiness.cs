using Carrefour.CashFlow.Data;
using Carrefour.CashFlow.Dtos;
using Carrefour.CashFlow.Entities;
using Carrefour.Framework.Data;
using Carrefour.Framework.Exceptions;
using Carrefour.Framework.Jobs;
using Carrefour.Framework.Processes;
using LinqKit;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Carrefour.CashFlow.Business
{
    public class MovementBusiness : BaseBusiness<CashFlowDbContext>
    {
        public MovementBusiness(CashFlowDbContext dbContext)
            : base(dbContext)
        {
        }

        public async Task<MovementDto?> GetByIdAsync(long id)
        {
            var movement = await this.dbContext.Movements.AsExpandable()
                .Where(m => m.Id == id)
                .Select(Movement.ToFullDto)
                .FirstOrDefaultAsync();

            return movement;
        }

        public async Task<List<MovementDto>> GetAllAsync()
        {
            var movements = await this.dbContext.Movements.AsExpandable()
                .Select(Movement.ToFullDto)
                .OrderByDescending(m => m.Date)
                .ThenByDescending(m => m.Id)
                .ToListAsync();

            return movements;
        }

        public async Task<MovementDto?> CreateAsync(MovementDto movement)
        {
            this.EnsureIsValid(movement);

            var newMovement = new Movement(movement, this.dbContext);

            this.dbContext.Movements.Add(newMovement);

            await this.dbContext.SaveChangesAsync();

            movement.Id = newMovement.Id;

            return await this.GetByIdAsync(movement.Id);
        }

        public async Task<MovementDto?> UpdateAsync(MovementDto movement)
        {
            this.EnsureIsValid(movement);

            var currentMovement = await dbContext.Movements
                .Where(m => m.Id == movement.Id)
                .FirstOrDefaultAsync();

            if (currentMovement != null)
            {
                currentMovement.FromDto(movement, this.dbContext);

                await dbContext.SaveChangesAsync();

                return await this.GetByIdAsync(movement.Id);
            }

            return null;
        }

        public async Task<MovementDto?> DeleteAsync(long id)
        {
            var currentVessel = await dbContext.Movements
                .Where(m => m.Id == id)
                .FirstOrDefaultAsync();

            if (currentVessel != null)
            {
                var vessel = await this.GetByIdAsync(currentVessel.Id);

                this.dbContext.Movements.Remove(currentVessel);

                await this.dbContext.SaveChangesAsync();

                return vessel;
            }

            return null;
        }

        private void EnsureIsValid(MovementDto movement)
        {
            if (movement.Type != MovementType.Debit && movement.Type != MovementType.Credit)
                throw new BusinessException("Type must be Debit (1) or Credit (2).");

            if (movement.Value <= 0)
                throw new BusinessException("Value cannot be less than zero.");
        }
    }
}