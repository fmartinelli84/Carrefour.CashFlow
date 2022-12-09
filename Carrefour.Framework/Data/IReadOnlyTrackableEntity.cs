using System;
using System.Collections.Generic;
using System.Text;

namespace Carrefour.Framework.Data
{
    public interface IReadOnlyTrackableEntity
    {
        DateTime? CreatedAtDate { get; set; }
    }
}
