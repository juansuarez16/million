using System;
using System.Linq;
using System.Collections.Generic;
using Million.Domain.Entities;
using Million.Infrastructure.Mongo.Models;

namespace Million.Infrastructure.Mongo.Mappers;

internal static class PropertyDocumentMapper
{
    /// Document (Mongo) -> Domain
    /// Toma la imagen habilitada; si no hay, la primera; si no existen, string.Empty.
    public static Property ToDomain(PropertyDocument d)
    {
        if (d is null) throw new ArgumentNullException(nameof(d));

        var imageUrl =
            d.Images?.FirstOrDefault(i => i.Enabled)?.File
            ?? d.Images?.FirstOrDefault()?.File
            ?? string.Empty;

        return Property.Rehydrate(
            id: d.Id,
            idOwner: d.IdOwner,
            name: d.Name,
            address: d.Address,
            price: d.Price,
            imageUrl: imageUrl
        );
    }

    /// Domain -> Document
    /// Si el dominio trae ImageUrl, lo mapeamos a Images con una imagen Enabled.
    public static PropertyDocument FromDomain(Property p)
    {
        if (p is null) throw new ArgumentNullException(nameof(p));

        var doc = new PropertyDocument
        {
            // ⚠️ Si tu PropertyDocument.Id lo genera Mongo (ObjectId), elimina esta línea.
            Id = p.Id,
            IdOwner = p.IdOwner,
            Name = p.Name,
            Address = p.Address,
            Price = p.Price,
            Images = new List<PropertyImageDocument>()
        };

        if (!string.IsNullOrWhiteSpace(p.ImageUrl))
        {
            doc.Images.Add(new PropertyImageDocument
            {
                File = p.ImageUrl,
                Enabled = true
            });
        }

        return doc;
    }
}
