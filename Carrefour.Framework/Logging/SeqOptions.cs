using System;
using System.Collections.Generic;
using System.Text;

namespace Carrefour.Framework.Logging
{
    public class SeqOptions
    {
        public Uri Address { get; set; } = null!;

        public long? EventBodyLimitBytes { get; set; }
    }
}
