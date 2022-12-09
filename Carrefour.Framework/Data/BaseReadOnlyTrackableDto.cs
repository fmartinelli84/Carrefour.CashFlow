﻿using System;
using System.Collections.Generic;
using System.Text;

namespace Carrefour.Framework.Data
{
    public abstract class BaseReadOnlyTrackableDto : IReadOnlyTrackableDto
    {
        public DateTime? CreatedAtDate { get; set; }
    }
}
