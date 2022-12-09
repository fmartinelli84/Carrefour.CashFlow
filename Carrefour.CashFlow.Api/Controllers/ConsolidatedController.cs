using Carrefour.CashFlow.Business;
using Carrefour.CashFlow.Dtos;
using Carrefour.CashFlow.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Carrefour.CashFlow.Api.Controllers
{
    [ApiController]
    [Route("consolidated")]
    public class ConsolidatedController : ControllerBase
    {
        [HttpGet("")]
        public async Task<ActionResult<List<ConsolidatedDto>>> GetAllAsync(
            [FromServices] ConsolidatedBusiness consolidatedBusiness)
        {
            return await consolidatedBusiness.GetAllAsync();
        }
    }
}
