using Example.Models;
using Example.Models.Domain.Forums;
using Example.Models.Requests.Forums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Example.Services.Interfaces
{
    public interface IForumsService
    {
        int Add(ThreadAddRequest model, int userId);
        Paged<Thread> GetAllPagination(int pageIndex, int pageSize);
        void DeleteById(int id);
        void Update(ThreadUpdateRequest model);
        Thread GetById(int id);
        Paged<Thread> GetByCreatedBy(int userId, int pageIndex, int pageSize);
        int PostInsert(PostAddRequest model, int userId);
        void PostUpdate(PostUpdateRequest model, int userId);
        Paged<Post> PostSelectAll(int pageIndex, int pageSize);
        Paged<Post> PostSelectAllByCreatedBy(int pageIndex, int pageSize, int userId);
        Paged<Post> PostSelectByThreadId(int pageIndex, int pageSize, int threadId);
        Post PostSelectById(int id);
        void PostDelete(int id);
        int ReplyInsert(ReplyAddRequest model, int userId);
        void ReplyUpdate(ReplyUpdateRequest model, int userId);
        Paged<Reply> ReplySelectAll(int pageIndex, int pageSize);
        List<Reply> ReplySelectByPostId(int postId);
        void ReplyDelete(int id);
        Reply ReplySelectById(int id);
    }
}
