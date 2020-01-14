using System;
using System.Collections.Generic;
using System.Text;

namespace Example.Models.Requests.Forums
{
    public class ReplyAddRequest
    {
        public string Content { get; set; }
        public int PostId { get; set; }
    }
}
