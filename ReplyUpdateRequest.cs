using System;
using System.Collections.Generic;
using System.Text;

namespace Example.Models.Requests.Forums
{
    public class ReplyUpdateRequest : ReplyAddRequest
    {
        public int Id { get; set; }
    }
}
