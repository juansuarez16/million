using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Million.Application.Common;
using Million.Application.Properties.Dtos;
using Million.Application.Properties.Services;

namespace Million.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public sealed class PropertiesController : ControllerBase
    {
        private readonly IPropertyService _service;
        public PropertiesController(IPropertyService service) => _service = service;

        /// <summary>List properties with filters/paging/sorting.</summary>
        [HttpGet]
        [ProducesResponseType(typeof(PagedResult<PropertyDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PagedResult<PropertyDto>>> List(
            [FromQuery] PropertyListFilters filters,
            CancellationToken ct)
        {
            var result = await _service.ListAsync(filters, ct);
            return Ok(result);
        }

        /// <summary>Get property by ID.</summary>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(PropertyDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<PropertyDto>> GetById(string id, CancellationToken ct)
        {
            var dto = await _service.GetByIdAsync(id, ct);
            return dto is null ? NotFound() : Ok(dto);
        }
    }
}
