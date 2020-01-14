using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Example.Models.Requests.Forums
{
    public class ThreadAddRequest
    {
        [Required]
        [StringLength(50)]
        public string Subject { get; set; }
    }
}
