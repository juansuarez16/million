using Million.Application.Properties.Dtos;
using Million.Application.Properties.Ports;
using Million.Domain.Entities;
using Million.Infrastructure.Mongo.Mappers;
using Million.Infrastructure.Mongo.Models;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Million.Infrastructure.Mongo.Repositories;

public sealed class PropertyReadRepository : IPropertyReadRepository
{
    private readonly IMongoCollection<PropertyDocument> _col;

    public PropertyReadRepository(MongoContext ctx, MongoOptions options)
    {
        _col = ctx.Db.GetCollection<PropertyDocument>(options.PropertiesCollection);
    }

    public async Task<(IReadOnlyList<Property> Items, long Total)> ListAsync(
        PropertyListFilters filters,
        CancellationToken ct = default)
    {
        var fb = Builders<PropertyDocument>.Filter;
        var filter = fb.Empty;

        if (!string.IsNullOrWhiteSpace(filters.Name))
            filter &= fb.Regex(x => x.Name, new BsonRegularExpression(filters.Name, "i"));

        if (!string.IsNullOrWhiteSpace(filters.Address))
            filter &= fb.Regex(x => x.Address, new BsonRegularExpression(filters.Address, "i"));

        if (filters.MinPrice.HasValue)
            filter &= fb.Gte(x => x.Price, filters.MinPrice.Value);

        if (filters.MaxPrice.HasValue)
            filter &= fb.Lte(x => x.Price, filters.MaxPrice.Value);

      
        var findOptions = new FindOptions               
        {
            Collation = new Collation("en", strength: CollationStrength.Secondary)
        };

        var find = _col.Find(filter, findOptions);

        
        var sort = filters.Sort switch
        {
            "price" => Builders<PropertyDocument>.Sort.Ascending(x => x.Price),
            "-price" => Builders<PropertyDocument>.Sort.Descending(x => x.Price),
            "name" => Builders<PropertyDocument>.Sort.Ascending(x => x.Name),
            "-name" => Builders<PropertyDocument>.Sort.Descending(x => x.Name),
            _ => null
        };

        if (sort is not null)
            find = find.Sort(sort);

        // Paginación segura
        var page = filters.Page < 1 ? 1 : filters.Page;
        var pageSize = filters.PageSize is < 1 or > 200 ? 20 : filters.PageSize;

        var total = await _col.CountDocumentsAsync(filter, cancellationToken: ct);

        var docs = await find
            .Skip((page - 1) * pageSize)
            .Limit(pageSize)
            .ToListAsync(ct);

        var items = docs.Select(PropertyDocumentMapper.ToDomain).ToList();
        return (items, total);
    }

    public async Task<Property?> GetByIdAsync(string id, CancellationToken ct = default)
    {
        var doc = await _col.Find(x => x.Id == id).FirstOrDefaultAsync(ct);
        return doc is null ? null : PropertyDocumentMapper.ToDomain(doc);
    }
}
