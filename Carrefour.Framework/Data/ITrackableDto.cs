using System;
using System.Collections.Generic;
using System.Text;

namespace Carrefour.Framework.Data
{
    public interface ITrackableDto : IReadOnlyTrackableDto
    {
        DateTime? ModifiedAtDate { get; set; }
    }
}
