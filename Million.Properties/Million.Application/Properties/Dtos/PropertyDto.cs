using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Million.Application.Properties.Dtos
{
    public sealed record PropertyDto(
    string Id,
    string IdOwner,
    string Name,
    string Address,
    decimal Price,
    string ImageUrl
);
}
