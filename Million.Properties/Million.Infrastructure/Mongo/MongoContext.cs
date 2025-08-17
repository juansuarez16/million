using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Million.Infrastructure.Mongo
{
    public sealed class MongoContext
    {
        public IMongoDatabase Db { get; }

        public MongoContext(MongoOptions options)
        {
            var client = new MongoClient(options.ConnectionString);
            Db = client.GetDatabase(options.Database);

            var props = Db.GetCollection<Models.PropertyDocument>(options.PropertiesCollection);
            EnsurePropertyIndexes(props).GetAwaiter().GetResult();
        }

        private static async Task EnsurePropertyIndexes(IMongoCollection<Models.PropertyDocument> col)
        {
            var keys = Builders<Models.PropertyDocument>.IndexKeys;

            var models = new List<CreateIndexModel<Models.PropertyDocument>>
    {
        new(keys.Ascending(p => p.Name)),
        new(keys.Ascending(p => p.Address)),
        new(keys.Ascending(p => p.Price)),
        new(keys.Ascending(p => p.Price).Ascending(p => p.Name))
    };

            await col.Indexes.CreateManyAsync(models);
        }
    }
}
