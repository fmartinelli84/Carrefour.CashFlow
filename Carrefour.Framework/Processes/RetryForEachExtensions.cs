using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Carrefour.Framework.Processes
{
    public static class RetryForEachExtensions
    {
        public static RetryForEach<TItem> RetryForEach<TItem>(this IEnumerable<TItem> list, Action<TItem, int> itemHandler)
        {
            return new RetryForEach<TItem>(list, itemHandler);
        }
        public static RetryForEach<TItem> RetryForEach<TItem>(this IEnumerable<TItem> list, Func<TItem, int, bool> itemHandler)
        {
            return new RetryForEach<TItem>(list, itemHandler);
        }
        public static RetryForEach<TItem> RetryForEach<TItem>(this IEnumerable<TItem> list, Func<TItem, int, Task> itemHandler)
        {
            return new RetryForEach<TItem>(list, itemHandler);
        }
        public static RetryForEach<TItem> RetryForEach<TItem>(this IEnumerable<TItem> list, Func<TItem, int, Task<bool>> itemHandler)
        {
            return new RetryForEach<TItem>(list, itemHandler);
        }
    }
}
