using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Million.Infrastructure.Mongo.Models
{
    public sealed class PropertyDocument
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = default!;

        public string IdOwner { get; set; } = default!;
        public string Name { get; set; } = default!;
        public string Address { get; set; } = default!;
        public decimal Price { get; set; }
        public string CodeInternal { get; set; } = default!;
        public int Year { get; set; }

        // 🔹 Agregamos imágenes
        public List<PropertyImageDocument> Images { get; set; } = new();

        // 🔹 Ya existían las trazas
        public List<PropertyTraceDocument> Traces { get; set; } = new();
    }
}
