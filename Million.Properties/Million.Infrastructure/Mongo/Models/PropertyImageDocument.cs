using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Million.Infrastructure.Mongo.Models
{
    public sealed class PropertyImageDocument
    {
        public string File { get; set; } = default!; 
        public bool Enabled { get; set; }
    }
}
