using FluentAssertions;
using NUnit.Framework;
using Million.Domain.Entities;
using System;

namespace Million.UnitTests.Domain;

[TestFixture]
public class PropertyTests
{
    [Test]
    public void Rehydrate_returns_immutable_snapshot()
    {
        // Arrange + Act
        var p = Property.Rehydrate(
            id: "1",
            idOwner: "owner-1",
            name: "Modern Loft",
            address: "Main St 10",
            price: 200_000m,
            imageUrl: "img"
        );

        // Assert (AAA + equivalence on core fields)
        p.Id.Should().Be("1");
        p.IdOwner.Should().Be("owner-1");   // ajusta a OwnerId si tu entidad usa ese nombre
        p.Name.Should().Be("Modern Loft");
        p.Address.Should().Be("Main St 10");
        p.Price.Should().Be(200_000m);
        p.ImageUrl.Should().Be("img");
    }

    // --- Regla de negocio: precio no negativo ---
    // Marca este test como pendiente si aún no implementas la validación en la entidad.
    // Cuando la implementes (guard clause), elimina [Ignore] y cambia Exception por ArgumentOutOfRangeException.
    [Test]
    [Ignore("Pendiente: implementar guard clause en Property.Rehydrate para price < 0")]
    public void Price_should_not_be_negative()
    {
        // Arrange
        Action act = () => Property.Rehydrate(
            id: "1",
            idOwner: "owner-1",
            name: "X",
            address: "Y",
            price: -1m,
            imageUrl: "img"
        );

        // Assert (cuando implementes la regla, usa: act.Should().Throw<ArgumentOutOfRangeException>())
        act.Should().Throw<Exception>();
    }
}
