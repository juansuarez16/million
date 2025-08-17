using Million.Application.Properties.Dtos;
using Million.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Million.Application.Properties.Ports
{
    public interface IPropertyReadRepository
    {
        Task<(IReadOnlyList<Property> Items, long Total)> ListAsync(
            PropertyListFilters filters,
            CancellationToken ct = default);

        Task<Property?> GetByIdAsync(string id, CancellationToken ct = default);
    }
}
