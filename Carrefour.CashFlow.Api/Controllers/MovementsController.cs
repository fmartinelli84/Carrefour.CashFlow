using Carrefour.CashFlow.Business;
using Carrefour.CashFlow.Dtos;
using Carrefour.CashFlow.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Carrefour.CashFlow.Api.Controllers
{
    [ApiController]
    [Route("movements")]
    public class MovementsController : ControllerBase
    {
        [HttpGet("{id}")]
        public async Task<ActionResult<MovementDto?>> GetByIdAsync(
            [FromRoute] long id, 
            [FromServices] MovementBusiness movementBusiness)
        {
            return await movementBusiness.GetByIdAsync(id);
        }

        [HttpGet("")]
        public async Task<ActionResult<List<MovementDto>>> GetAllAsync(
            [FromServices] MovementBusiness movementBusiness)
        {
            return await movementBusiness.GetAllAsync();
        }

        [HttpPost("")]
        public async Task<ActionResult<MovementDto?>> CreateAsync(
            [FromBody] MovementDto movement,
            [FromServices] MovementBusiness movementBusiness)
        {
            return await movementBusiness.CreateAsync(movement);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<MovementDto?>> UpdateAsync(
            [FromRoute] long id,
            [FromBody] MovementDto movement,
            [FromServices] MovementBusiness movementBusiness)
        {
            movement.Id = id;
            return await movementBusiness.UpdateAsync(movement);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<MovementDto?>> DeleteAsync(
            [FromRoute] long id,
            [FromServices] MovementBusiness movementBusiness)
        {
            return await movementBusiness.DeleteAsync(id);
        }
    }
}
