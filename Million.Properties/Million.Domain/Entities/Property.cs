using Million.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Million.Domain.Entities
{
    public sealed class Property: BaseEntity<string>
    {
        public string IdOwner { get; private set; } = default!;
        public string Name { get; private set; } = default!;
        public string Address { get; private set; } = default!;
        public decimal Price { get; private set; }
        public string ImageUrl { get; private set; } = default!;

        private Property() { }

        public static Property Create(string idOwner, string name, string address, decimal price, string imageUrl)
        {
            Validate(idOwner, name, address, price, imageUrl);

            return new Property
            {
                Id = Guid.NewGuid().ToString(), 
                IdOwner = idOwner,
                Name = name,
                Address = address,
                Price = price,
                ImageUrl = imageUrl
            };
        }

        public static Property Rehydrate(string id, string idOwner, string name, string address, decimal price, string imageUrl)
        {
            if (string.IsNullOrWhiteSpace(id)) throw new DomainException("Id is required.");
            Validate(idOwner, name, address, price, imageUrl);

            return new Property
            {
                Id = id,                         
                IdOwner = idOwner,
                Name = name,
                Address = address,
                Price = price,
                ImageUrl = imageUrl
            };
        }

        public void UpdatePrice(decimal price)
        {
            if (price < 0) throw new DomainException("Price cannot be negative.");
            Price = price;
            Touch();
        }
        private static void Validate(string idOwner, string name, string address, decimal price, string imageUrl)
        {
            if (string.IsNullOrWhiteSpace(idOwner)) throw new DomainException("IdOwner is required.");
            if (string.IsNullOrWhiteSpace(name)) throw new DomainException("Name is required.");
            if (string.IsNullOrWhiteSpace(address)) throw new DomainException("Address is required.");
            if (price < 0) throw new DomainException("Price cannot be negative.");
            if (string.IsNullOrWhiteSpace(imageUrl)) throw new DomainException("ImageUrl is required.");
        }

    }
}
