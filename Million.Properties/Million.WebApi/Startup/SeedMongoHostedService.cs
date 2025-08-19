using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Million.Infrastructure.Mongo;
using Million.Infrastructure.Mongo.Models;
using MongoDB.Driver;
using System.Net;

namespace Million.WebApi.Startup;

public sealed class SeedMongoHostedService : IHostedService
{
    private readonly MongoContext _ctx;
    private readonly MongoOptions _options;
    private readonly ILogger<SeedMongoHostedService> _log;

   
    private static readonly string[] primaryImages = new[]
    {
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
        "https://images.unsplash.com/photo-1560184897-e6c9d8e59e3d",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
        "https://images.unsplash.com/photo-1613977257363-707ba9348227",
        "https://images.unsplash.com/photo-1600585154154-1a06be39d4ef",
        "https://images.unsplash.com/photo-1600585154206-7dba1b4f5d7b",
        "https://images.unsplash.com/photo-1600585154303-d03f1c4b1c86",
        "https://images.unsplash.com/photo-1600585154534-0d5a3c8d3e3f",
        "https://images.unsplash.com/photo-1600585154770-0ef0a5c7c94d",
        "https://images.unsplash.com/photo-1600585154890-0b4a52d6a9e1",
        "https://images.unsplash.com/photo-1600585154975-58a6f59c3c2c",
        "https://images.unsplash.com/photo-1600585155039-96dcb6c3b5d3",
        "https://images.unsplash.com/photo-1600585155203-73b7d1cf3f88",
        "https://images.unsplash.com/photo-1600585155277-4dc2621c99f3",
        "https://images.unsplash.com/photo-1600585155373-3d13f6d8a5f2",
        "https://images.unsplash.com/photo-1600585155435-2f54f5df8e7a",
        "https://images.unsplash.com/photo-1600585155500-89c19d9ad5d1",
        "https://images.unsplash.com/photo-1600585155550-15c7b5bff8a7",
        "https://images.unsplash.com/photo-1600585155623-67a2d2ff9b4f",
        "https://images.unsplash.com/photo-1600585155677-ec3d9cda9f63",
        "https://images.unsplash.com/photo-1600585155739-0b3b0a6f9c17",
        "https://images.unsplash.com/photo-1600585155801-3f51a8db32c5",
        "https://images.unsplash.com/photo-1600585155859-6af517a826ff",
        "https://images.unsplash.com/photo-1600585155931-7420f4a3b14d",
        "https://images.unsplash.com/photo-1600585156001-9e2f3a2b65d2",
        "https://images.unsplash.com/photo-1523217582562-09d0def993a6",
        "https://images.unsplash.com/photo-1572120360610-d971b9d7767c",
        "https://images.unsplash.com/photo-1549187774-b4e9b0445b41",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858",
        "https://images.unsplash.com/photo-1449844908441-8829872d2607",
        "https://images.unsplash.com/photo-1464146072230-91cabc968266",
        "https://images.unsplash.com/photo-1560448075-bb4caa6c59ef",
        "https://images.unsplash.com/photo-1502005229762-cf1b2da7c52f",
        "https://images.unsplash.com/photo-1460317442991-0ec209397118",
        "https://images.unsplash.com/photo-1501183638710-841dd1904471",
        "https://images.unsplash.com/photo-1501045661006-fcebe0257c3f",
        "https://images.unsplash.com/photo-1460353581641-37baddab0fa2"
    };

    private static readonly string[] fallbackQueries = new[]
    {
        "house", "apartment", "villa", "condo", "real-estate", "architecture", "interior"
    };

    private static readonly HttpClient http = new()
    {
        Timeout = TimeSpan.FromSeconds(2)
    };

    private static string BuildPrimary(string baseUrl)
        => $"{baseUrl}?auto=format&fit=crop&w=960&h=640&q=70";

    private static string BuildFallback(string query, int salt)
        => $"https://source.unsplash.com/960x640/?{query}&sig={salt}";

    private static string Placeholder()
        => "https://placehold.co/960x640?text=Property";

    private static async Task<string> FirstReachableAsync(IEnumerable<string> candidates, CancellationToken ct)
    {
        foreach (var url in candidates)
        {
            try
            {
                using var req = new HttpRequestMessage(HttpMethod.Head, url);
                using var res = await http.SendAsync(req, HttpCompletionOption.ResponseHeadersRead, ct);
                if ((int)res.StatusCode >= 200 && (int)res.StatusCode < 400)
                    return url;
            }
            catch { /* ignore; try next */ }
        }
        return Placeholder();
    }

    private static async Task<string> GetImageUrlAsync(int index, CancellationToken ct)
    {
        var primary = BuildPrimary(primaryImages[Math.Abs(index) % primaryImages.Length]);

        var q1 = BuildFallback(fallbackQueries[Math.Abs(index) % fallbackQueries.Length], index);
        var q2 = BuildFallback(fallbackQueries[(Math.Abs(index) + 3) % fallbackQueries.Length], index + 777);

        return await FirstReachableAsync(new[] { primary, q1, q2 }, ct);
    }

    public SeedMongoHostedService(MongoContext ctx, MongoOptions options, ILogger<SeedMongoHostedService> log)
    {
        _ctx = ctx;
        _options = options;
        _log = log;
    }

    public async Task StartAsync(CancellationToken ct)
    {
        var col = _ctx.Db.GetCollection<PropertyDocument>(_options.PropertiesCollection);

        var existing = await col.Find(FilterDefinition<PropertyDocument>.Empty)
                                .Project(x => new { x.Id, x.Images })
                                .ToListAsync(ct);

        var needsMigration = existing.Any(d => d.Images != null && d.Images.Any(i => i.File != null && i.File.Contains("picsum.photos")));
        if (needsMigration)
        {
            _log.LogInformation("Migrating existing picsum images to validated real estate images…");
            var i = 1;
            foreach (var doc in existing)
            {
                var hasPicsum = doc.Images != null && doc.Images.Any(img => img.File != null && img.File.Contains("picsum.photos"));
                if (!hasPicsum) { i++; continue; }

                var main = await GetImageUrlAsync(i, ct);
                var alt  = await GetImageUrlAsync(i + 50, ct);

                var newImages = new List<PropertyImageDocument>
                {
                    new() { File = main, Enabled = true  },
                    new() { File = alt,  Enabled = false },
                };

                var update = Builders<PropertyDocument>.Update.Set(x => x.Images, newImages);
                await col.UpdateOneAsync(Builders<PropertyDocument>.Filter.Eq(x => x.Id, doc.Id), update, cancellationToken: ct);
                i++;
            }

            _log.LogInformation("Image migration completed.");
            return; 
        }
     

        var count = await col.CountDocumentsAsync(FilterDefinition<PropertyDocument>.Empty, cancellationToken: ct);
        if (count > 0)
        {
            _log.LogInformation("Seed skipped: {Count} documents already present.", count);
            return;
        }

        _log.LogInformation("Seeding properties…");

        var owners = new[] {
            ("owner-1","Olivia Brown"), ("owner-2","Liam Johnson"), ("owner-3","Emma Davis"),
            ("owner-4","Noah Wilson"), ("owner-5","Ava Miller"), ("owner-6","Sophia Garcia")
        };

        var streets = new[] {
            "Main St", "Ocean Dr", "Pine Ave", "Sunset Blvd", "Elm St", "Maple Rd",
            "Brickell Ave", "Collins Ave", "Biscayne Blvd", "Coral Way"
        };

        var names = new[] {
            "Modern Loft", "Beach House", "Suburban Home", "Luxury Condo", "City Studio",
            "Family House", "Garden Villa", "Cozy Cottage", "Penthouse", "Townhouse",
            "Country Retreat", "Riverside Flat"
        };

        var rnd = new Random(2025);
        var list = new List<PropertyDocument>(24);

        for (int idx = 1; idx <= 24; idx++)
        {
            var owner = owners[rnd.Next(owners.Length)];
            var nm = names[rnd.Next(names.Length)];
            var st = streets[rnd.Next(streets.Length)];
            var num = rnd.Next(10, 999);

            var basePrice = (decimal)rnd.Next(120_000, 1_200_000);
            var year = rnd.Next(1995, 2025);
            var code = $"{nm.Split(' ')[0].ToUpperInvariant()}-{num:d3}";

            // ⬇️ URLs validadas (sin 404)
            var main = await GetImageUrlAsync(idx, ct);
            var alt  = await GetImageUrlAsync(idx + 50, ct);

            var images = new List<PropertyImageDocument>
            {
                new() { File = main, Enabled = true  },
                new() { File = alt,  Enabled = false },
            };

            var traces = new List<PropertyTraceDocument>();
            var traceCount = rnd.Next(0, 3);
            for (int t = 0; t < traceCount; t++)
            {
                var yearsAgo = rnd.Next(1, 6);
                traces.Add(new PropertyTraceDocument
                {
                    Name = t == 0 ? "Initial Sale" : "Tax Update",
                    DateSale = DateTime.UtcNow.AddYears(-yearsAgo),
                    Value = basePrice - rnd.Next(10_000, 60_000),
                    Tax = rnd.Next(5_000, 25_000)
                });
            }

            list.Add(new PropertyDocument
            {
                IdOwner = owner.Item1,
                Name = nm,
                Address = $"{num} {st}, Miami FL",
                Price = basePrice,
                CodeInternal = code,
                Year = year,
                Images = images,
                Traces = traces
            });
        }

        await col.InsertManyAsync(list, cancellationToken: ct);
        _log.LogInformation("Seed completed: {Count} properties inserted.", list.Count);
    }

    public Task StopAsync(CancellationToken ct) => Task.CompletedTask;
}
