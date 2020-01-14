using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Example.Models.Requests.Forums
{
    public class ThreadUpdateRequest:ThreadAddRequest, IModelIdentifier
    {
        [Required]
        [Range(1, Int32.MaxValue)]
        public int Id { get; set; }
        [Required]
        public bool IsActive { get; set; }
    }
}
