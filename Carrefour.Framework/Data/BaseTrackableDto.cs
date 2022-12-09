using System;
using System.Collections.Generic;
using System.Text;

namespace Carrefour.Framework.Data
{
    public abstract class BaseTrackableDto : BaseReadOnlyTrackableDto, ITrackableDto
    {
        public DateTime? ModifiedAtDate { get; set; }
    }
}
