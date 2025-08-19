using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Million.Application.Properties;
using Million.Application.Properties.Dtos;
using Million.Application.Properties.Services;
using Million.UnitTests.Common;            // ← usa los helpers de Common
using Million.WebApi.Controllers;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Million.UnitTests.WebApi;

[TestFixture]
public class PropertiesControllerTests
{
    [Test]
    public async Task GetById_returns_Ok_when_found()
    {
        // Arrange
        var svc = new Mock<IPropertyService>(MockBehavior.Strict);

        // Factory por reflexión desde Common (diccionario case-insensitive recomendado)
        var dto = ReflectionFactory.CreateWithDefaults<PropertyDto>(
            new Dictionary<string, object?>(StringComparer.OrdinalIgnoreCase)
            {
                ["id"] = "1",
                ["name"] = "Modern Loft",
                ["address"] = "A",
                ["price"] = 1m,
                ["idOwner"] = "o1",
                ["imageUrl"] = "img"
            });

        svc.Setup(s => s.GetByIdAsync("1", It.IsAny<CancellationToken>()))
           .ReturnsAsync(dto);

        var ctrl = new PropertiesController(svc.Object);

        // Act
        ActionResult<PropertyDto> result = await ctrl.GetById("1", CancellationToken.None);

        // Assert (independiente de OkObjectResult vs Value)
        var payload = result.ExtractValue<PropertyDto>();   // ← extensión de Common
        payload.Id.Should().Be("1");
        payload.Name.Should().Be("Modern Loft");

        svc.Verify(s => s.GetByIdAsync("1", It.IsAny<CancellationToken>()), Times.Once);
    }

    [Test]
    public async Task GetById_returns_NotFound_when_null()
    {
        // Arrange
        var svc = new Mock<IPropertyService>(MockBehavior.Strict);
        svc.Setup(s => s.GetByIdAsync("404", It.IsAny<CancellationToken>()))
           .ReturnsAsync((PropertyDto?)null);

        var ctrl = new PropertiesController(svc.Object);

        // Act
        ActionResult<PropertyDto> result = await ctrl.GetById("404", CancellationToken.None);

        // Assert
        result.Result.Should().BeOfType<NotFoundResult>();
        svc.Verify(s => s.GetByIdAsync("404", It.IsAny<CancellationToken>()), Times.Once);
    }
}
