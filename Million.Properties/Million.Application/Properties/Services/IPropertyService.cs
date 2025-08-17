using Million.Application.Common;
using Million.Application.Properties.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Million.Application.Properties.Services
{
    public interface IPropertyService
    {
        Task<PagedResult<PropertyDto>> ListAsync(PropertyListFilters filters, CancellationToken ct = default);
        Task<PropertyDto?> GetByIdAsync(string id, CancellationToken ct = default);
    }
}
