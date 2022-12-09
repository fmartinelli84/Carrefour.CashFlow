using System;
using System.Collections.Generic;
using System.Text;

namespace Carrefour.Framework.Data
{
    public interface ITrackableEntity : IReadOnlyTrackableEntity
    {
        DateTime? ModifiedAtDate { get; set; }
    }
}
