using System;
using System.Collections.Generic;
using System.Text;

namespace Example.Models.Domain.Forums
{
    public class Post
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public int ThreadId { get; set; }
        public int CreatedBy { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
        public string AvatarUrl { get; set; }
    }
}
