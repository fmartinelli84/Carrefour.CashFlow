using System;
using System.Collections.Generic;
using System.Text;

namespace Carrefour.Framework.Data
{
    public interface IReadOnlyTrackableDto
    {
        DateTime? CreatedAtDate { get; set; }
    }
}
