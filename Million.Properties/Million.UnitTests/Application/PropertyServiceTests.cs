using FluentAssertions;
using Million.Application.Properties;
using Million.Application.Properties.Dtos;
using Million.Application.Properties.Ports;
using Million.Application.Properties.Services;
using Million.Domain.Entities;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Million.UnitTests.Application;

[TestFixture]
public class PropertyServiceTests
{
    [Test]
    public async Task ListAsync_applies_filters_sort_and_pagination()
    {
        // Datos base (equivalence partitioning: distintos owners, direcciones y precios)
        var data = new List<Property>
        {
            Property.Rehydrate("1","o1","Modern Loft","Main St 10", 200_000m,"i1"),
            Property.Rehydrate("2","o2","Beach House","Ocean Dr 55", 950_000m,"i2"),
            Property.Rehydrate("3","o1","City Studio","Main St 77", 180_000m,"i3"),
            Property.Rehydrate("4","o3","Suburban Home","Elm St 2",  350_000m,"i4"),
        };

        var repo = new Mock<IPropertyReadRepository>(MockBehavior.Strict);

        // ✅ IMPORTANTE: devolvemos Task.FromResult<(IReadOnlyList<Property>, long)> para evitar
        // problemas con ReturnsAsync e inferencia de tuplas.
        repo.Setup(r => r.ListAsync(It.IsAny<PropertyListFilters>(), It.IsAny<CancellationToken>()))
            .Returns((PropertyListFilters f, CancellationToken _) =>
            {
                IEnumerable<Property> q = data;

                if (!string.IsNullOrWhiteSpace(f.Name))
                    q = q.Where(p => p.Name.Contains(f.Name, StringComparison.OrdinalIgnoreCase));
                if (!string.IsNullOrWhiteSpace(f.Address))
                    q = q.Where(p => p.Address.Contains(f.Address, StringComparison.OrdinalIgnoreCase));
                if (f.MinPrice.HasValue) q = q.Where(p => p.Price >= f.MinPrice.Value);
                if (f.MaxPrice.HasValue) q = q.Where(p => p.Price <= f.MaxPrice.Value);

                q = f.Sort switch
                {
                    "price" => q.OrderBy(p => p.Price),
                    "-price" => q.OrderByDescending(p => p.Price),
                    "name" => q.OrderBy(p => p.Name),
                    "-name" => q.OrderByDescending(p => p.Name),
                    _ => q
                };

                var total = q.LongCount();
                var page = f.Page < 1 ? 1 : f.Page;
                var size = f.PageSize is < 1 or > 200 ? 20 : f.PageSize;
                var items = q.Skip((page - 1) * size).Take(size).ToList();

                // 👇 tupla correctamente tipada
                return Task.FromResult<(IReadOnlyList<Property>, long)>(((IReadOnlyList<Property>)items, total));
            });

        var svc = new PropertyService(repo.Object);

        var filters = new PropertyListFilters
        {
            Name = "o",
            Address = "St",
            MinPrice = 180_000m,
            MaxPrice = 400_000m,
            Sort = "price",
            Page = 1,
            PageSize = 2
        };

        // Act
        var result = await svc.ListAsync(filters);

        // Assert
        result.Total.Should().BeGreaterThan(0);
        result.Items.Should().OnlyContain(i =>
            i.Name.Contains("o", StringComparison.OrdinalIgnoreCase) &&
            i.Address.Contains("St", StringComparison.OrdinalIgnoreCase) &&
            i.Price >= 180_000m && i.Price <= 400_000m);

        result.Items.Select(i => i.Price).Should().BeInAscendingOrder();
        result.Page.Should().Be(1);
        result.PageSize.Should().Be(2);

        // (opcional) verifica que el repo fue llamado 1 sola vez
        repo.Verify(r => r.ListAsync(It.IsAny<PropertyListFilters>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Test]
    public async Task ListAsync_normalizes_page_and_pageSize()
    {
        var repo = new Mock<IPropertyReadRepository>(MockBehavior.Strict);

        // ✅ Usa Task.FromResult tipado y asegúrate de que el total sea long (0L)
        repo.Setup(r => r.ListAsync(It.IsAny<PropertyListFilters>(), It.IsAny<CancellationToken>()))
            .Returns((PropertyListFilters _, CancellationToken __) =>
                Task.FromResult<(IReadOnlyList<Property>, long)>((Array.Empty<Property>(), 0L)));

        var svc = new PropertyService(repo.Object);

        // Act
        var res = await svc.ListAsync(new PropertyListFilters { Page = 0, PageSize = 500 });

        // Assert (técnica: input validation/normalization)
        res.Page.Should().Be(1);
        res.PageSize.Should().Be(20);

        // Verifica que el servicio pasó filtros normalizados al repo
        repo.Verify(r => r.ListAsync(
            It.Is<PropertyListFilters>(f => f.Page == 1 && f.PageSize == 20),
            It.IsAny<CancellationToken>()), Times.Once);
    }
}
