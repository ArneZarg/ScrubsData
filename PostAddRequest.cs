using System;
using System.Collections.Generic;
using System.Text;

namespace Example.Models.Requests.Forums
{
    public class PostAddRequest
    {
        public string Content { get; set; }
        public int ThreadId { get; set; }
    }
}
