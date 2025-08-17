using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Million.Domain.Abstractions
{
    public interface IReadRepository<T> where T : class
    {
        Task<T?> GetByIdAsync(string id, CancellationToken ct = default);
        
        Task<(IReadOnlyList<T> Items, long Total)> ListAsync(
            CancellationToken ct = default);
    }
}
