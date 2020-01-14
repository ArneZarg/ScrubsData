using System;
using System.Collections.Generic;
using System.Text;

namespace Example.Models.Requests.Forums
{
    public class PostUpdateRequest : PostAddRequest
    {
        public int Id { get; set; }
    }
}
