using Million.Application.Common;
using Million.Application.Properties.Dtos;
using Million.Application.Properties.Mapping;
using Million.Application.Properties.Ports;
using Million.Domain.Abstractions;
using Million.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Million.Application.Properties.Services
{
    public sealed class PropertyService : IPropertyService
    {
        private readonly IPropertyReadRepository _readRepo;

        public PropertyService(IPropertyReadRepository readRepo)
        {
            _readRepo = readRepo;
        }

        public async Task<PagedResult<PropertyDto>> ListAsync(PropertyListFilters filters, CancellationToken ct = default)
        {
           
            var page = filters.Page < 1 ? 1 : filters.Page;
            var size = filters.PageSize is < 1 or > 200 ? 20 : filters.PageSize;
            filters = filters with { Page = page, PageSize = size };

            var (items, total) = await _readRepo.ListAsync(filters, ct);

            var dtos = items.Select(PropertyMapper.ToDto).ToList();
            return new PagedResult<PropertyDto>(dtos, total, filters.Page, filters.PageSize);
        }

        public async Task<PropertyDto?> GetByIdAsync(string id, CancellationToken ct = default)
        {
            var entity = await _readRepo.GetByIdAsync(id, ct);
            return entity is null ? null : PropertyMapper.ToDto(entity);
        }

    }
}
