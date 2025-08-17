using Million.Domain.Entities;
using Million.Application.Properties.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Million.Application.Properties.Mapping
{
    public static class PropertyMapper
    {
        public static PropertyDto ToDto(Property p) =>
            new(p.Id, p.IdOwner, p.Name, p.Address, p.Price, p.ImageUrl);
    }
}
