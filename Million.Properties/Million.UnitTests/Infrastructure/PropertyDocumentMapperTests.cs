using System.Collections.Generic;
using FluentAssertions;
using NUnit.Framework;
using Million.Infrastructure.Mongo.Models;
using Million.Infrastructure.Mongo.Mappers;
using Million.Domain.Common; // 👈 para DomainException

namespace Million.UnitTests.Infrastructure;

[TestFixture]
public class PropertyDocumentMapperTests
{
    [Test]
    public void ToDomain_picks_enabled_image_or_first_and_throws_if_none()
    {
        var doc = new PropertyDocument
        {
            Id = "x1",
            IdOwner = "owner-1",
            Name = "Modern Loft",
            Address = "Main St 10",
            Price = 250_000m,
            Images = new List<PropertyImageDocument>
            {
                new() { File = "img-disabled", Enabled = false },
                new() { File = "img-enabled",  Enabled = true  }
            }
        };

        // Caso 1: hay habilitada → usa la habilitada
        var domain = PropertyDocumentMapper.ToDomain(doc);
        domain.ImageUrl.Should().Be("img-enabled");

        // Caso 2: no hay habilitadas pero hay una → usa la primera
        doc.Images = new List<PropertyImageDocument> { new() { File = "img-first", Enabled = false } };
        PropertyDocumentMapper.ToDomain(doc).ImageUrl.Should().Be("img-first");

        // Caso 3: no hay imágenes → debe lanzar DomainException (imagen requerida por dominio)
        doc.Images.Clear();
        var act = () => PropertyDocumentMapper.ToDomain(doc);
        act.Should().Throw<DomainException>()
           .WithMessage("*ImageUrl*");
    }

    [Test]
    public void FromDomain_creates_enabled_image_from_ImageUrl()
    {
        var p = Million.Domain.Entities.Property.Rehydrate("1", "owner-1", "Name", "Addr", 1m, "cover.png");
        var d = PropertyDocumentMapper.FromDomain(p);

        d.Id.Should().Be("1"); // quita esta aserción si tu Id lo genera Mongo
        d.Images.Should().ContainSingle();
        d.Images[0].File.Should().Be("cover.png");
        d.Images[0].Enabled.Should().BeTrue();
    }
}
