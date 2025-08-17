using Million.Domain.Entities;
using Million.Infrastructure.Mongo.Models;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Million.Infrastructure.Mongo.Mappers
{
    internal static class PropertyDocumentMapper
    {
        public static Property ToDomain(PropertyDocument d)
        => Property.Rehydrate(d.Id, d.IdOwner, d.Name, d.Address, d.Price, d.ImageUrl);

        public static PropertyDocument FromDomain(Property p) => new()
        {
            Id = p.Id,
            IdOwner = p.IdOwner,
            Name = p.Name,
            Address = p.Address,
            Price = p.Price,
            ImageUrl = p.ImageUrl
        };
    }
}