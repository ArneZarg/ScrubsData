using Example.Data;
using Example.Data.Providers;
using Example.Models;
using Example.Models.Domain.Forums;
using Example.Models.Requests.Forums;
using Example.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace Example.Services
{
    public class ForumsService : IForumsService
    {
        IDataProvider _data = null;

        public ForumsService(IDataProvider data)
        {
            _data = data;
        }
        public int PostInsert(PostAddRequest model, int userId)
        {
            int id = 0;
            _data.ExecuteNonQuery("dbo.Posts_Insert",
                delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@Content", model.Content);
                    col.AddWithValue("@ThreadId", model.ThreadId);
                    col.AddWithValue("@CreatedBy", userId);
                    
                    SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                    idOut.Direction = ParameterDirection.Output;

                    col.Add(idOut);
                },
                delegate (SqlParameterCollection returnCol)
                {
                    object returnId = returnCol["@Id"].Value;
                    Int32.TryParse(returnId.ToString(), out id);
                });
            return id;
        }
        public void PostUpdate(PostUpdateRequest model, int userId)
        {
            _data.ExecuteNonQuery("dbo.Posts_Update",
                delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@Id", model.Id);
                    col.AddWithValue("@Content", model.Content);
                    col.AddWithValue("@ModifiedBy", userId);
                }, null);
        }
        public Paged<Post> PostSelectAll(int pageIndex, int pageSize)
        {
            Paged<Post> pagedResults = null;
            List<Post> list = null;
            Post post = null;

            int totalCount = 0;

            _data.ExecuteCmd("dbo.Posts_SelectAll",
                delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("PageIndex", pageIndex);
                    col.AddWithValue("PageSize", pageSize);
                },
                delegate (IDataReader reader, short set)
                {
                    int index;
                    PostMapper(reader, out post, out index);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(index++);
                    }
                    if (list == null)
                    {
                        list = new List<Post>();
                    }
                    list.Add(post);
                });
            if (list != null)
            {
                pagedResults = new Paged<Post>(list, pageIndex, pageSize, totalCount);
            }
            return pagedResults;
        }
        public Paged<Post> PostSelectByThreadId(int pageIndex, int pageSize, int threadId) {
            Paged<Post> pagedResults = null;
            List<Post> list = null;
            Post post = null;
            int totalCount = 0;
            _data.ExecuteCmd("dbo.Posts_SelectByThreadId",
                delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@PageIndex", pageIndex);
                    col.AddWithValue("@PageSize", pageSize);
                    col.AddWithValue("@ThreadId", threadId);
                },
                delegate (IDataReader reader, short set)
                {
                    int index;
                    PostMapper(reader, out post, out index);
                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(index++);
                    }
                    if (list == null)
                    {
                        list = new List<Post>();
                    }
                    list.Add(post);
                });
            if (list != null) {
                pagedResults = new Paged<Post>(list, pageIndex, pageSize, totalCount);
            }
            return pagedResults;
        }
        public Paged<Post> PostSelectAllByCreatedBy(int pageIndex, int pageSize, int userId)
        {
            Paged<Post> pagedResults = null;
            List<Post> list = null;
            Post post = null;

            int totalCount = 0;

            _data.ExecuteCmd("dbo.Posts_SelectAll_ByCreatedBy",
                delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@PageIndex", pageIndex);
                    col.AddWithValue("@PageSize", pageSize);
                    col.AddWithValue("@CreatedBy", userId);
                },
                delegate (IDataReader reader, short set)
                {
                    int index;
                    PostMapper(reader, out post, out index);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(index++);
                    }
                    if (list == null)
                    {
                        list = new List<Post>();
                    } 
                 list.Add(post);
                });
            if (list != null)
            {
                pagedResults = new Paged<Post>(list, pageIndex, pageSize, totalCount);
            }
            return pagedResults;
        }
        public Post PostSelectById(int id)
        {
            Post post = null;

            _data.ExecuteCmd("dbo.Posts_SelectById",
                delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@Id", id);
                },
                delegate (IDataReader reader, short set)
                {
                    int index;
                    PostMapper(reader, out post, out index);
                });
            return post;
        }
        public void PostDelete(int id)
        {
            _data.ExecuteNonQuery("dbo.Posts_Delete",
                delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@Id", id);
                }, null);
        }
        public int ReplyInsert(ReplyAddRequest model, int userId)
        {
            int id = 0;

            _data.ExecuteNonQuery("dbo.Replies_Insert",
                delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@Content", model.Content);
                    col.AddWithValue("@PostId", model.PostId);
                    col.AddWithValue("@CreatedBy", userId);

                    SqlParameter idOutput = new SqlParameter("@Id", SqlDbType.Int);
                    idOutput.Direction = ParameterDirection.Output;

                    col.Add(idOutput);
                },
                delegate (SqlParameterCollection returnCol)
                {
                    object returnId = returnCol["@Id"].Value;
                    Int32.TryParse(returnId.ToString(), out id);
                });
            return id;
        }
        public void ReplyUpdate(ReplyUpdateRequest model, int userId)
        {
            _data.ExecuteNonQuery("dbo.Replies_Update",
                delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@Id", model.Id);
                    col.AddWithValue("@Content", model.Content);
                    col.AddWithValue("@ModifiedBy", userId);
                },
                null);
        }
        public Paged<Reply> ReplySelectAll(int pageIndex, int pageSize)
        {
            Paged<Reply> pagedReply = null;
            List<Reply> list = null;
            Reply reply = null;

            int totalCount = 0;

            _data.ExecuteCmd("dbo.Replies.SelectAll",
                delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@PageIndex", pageIndex);
                    col.AddWithValue("PageSize", pageSize);
                },
                delegate (IDataReader reader, short set)
                {
                    int index = 0;

                    reply = new Reply();
                    reply.Id = reader.GetSafeInt32(index++);
                    reply.Content = reader.GetSafeString(index++);
                    reply.PostId = reader.GetSafeInt32(index++);
                    reply.CreatedBy = reader.GetSafeInt32(index++);
                    reply.ModifiedBy = reader.GetSafeInt32(index++);
                    reply.DateCreated = reader.GetSafeDateTime(index++);
                    reply.DateModified = reader.GetSafeDateTime(index++);
                    reply.AvatarUrl = reader.GetSafeString(index++);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(index++);
                    }
                    if (list == null)
                    {
                        list = new List<Reply>();
                    }
                    list.Add(reply);
                });
            if (list != null)
            {
                pagedReply = new Paged<Reply>(list, pageIndex, pageSize, totalCount);
            }
            return pagedReply;
        }
        public List<Reply> ReplySelectByPostId(int postId)
        {
  
            List<Reply> list = null;
            Reply reply = null;

            _data.ExecuteCmd("dbo.Replies_SelectAll_ByPostId",
                delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@PostId", postId);
                },
                delegate (IDataReader reader, short set)
                {
                    int index = 0;

                    reply = new Reply();
                    reply.Id = reader.GetSafeInt32(index++);
                    reply.Content = reader.GetSafeString(index++);
                    reply.PostId = reader.GetSafeInt32(index++);
                    reply.CreatedBy = reader.GetSafeInt32(index++);
                    reply.ModifiedBy = reader.GetSafeInt32(index++);
                    reply.DateCreated = reader.GetSafeDateTime(index++);
                    reply.DateModified = reader.GetSafeDateTime(index++);
                    reply.AvatarUrl = reader.GetSafeString(index++);

                    if(list == null)
                    {
                        list = new List<Reply>();
                    }
                    list.Add(reply);
                });
            return list;
        }
        public void ReplyDelete (int id)
        {
            _data.ExecuteNonQuery("dbo.Replies_Delete",
                delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@Id", id);
                });
        }
        private static void PostMapper(IDataReader reader, out Post post, out int index)
        {
            post = new Post();
            index = 0;
            post.Id = reader.GetSafeInt32(index++);
            post.Content = reader.GetSafeString(index++);
            post.ThreadId = reader.GetSafeInt32(index++);
            post.CreatedBy = reader.GetSafeInt32(index++);
            post.ModifiedBy = reader.GetSafeInt32(index++);
            post.DateCreated = reader.GetSafeDateTime(index++);
            post.DateModified = reader.GetSafeDateTime(index++);
            post.AvatarUrl = reader.GetSafeString(index++);
        }
        public int Add(ThreadAddRequest model, int userId)
        {
            int id = 0;
            string procName = "dbo.Threads_Insert";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;


                col.AddWithValue("@Subject", model.Subject);
                col.AddWithValue("@CreatedBy", userId);
                col.Add(idOut);
            }, returnParameters: delegate (SqlParameterCollection returnCol) {
                object outputId = returnCol["@Id"].Value;
                Int32.TryParse(outputId.ToString(), out id);
            });
            return id;
        }
        public Paged<Thread> GetAllPagination(int pageIndex, int pageSize)
        {
            string procName = "[dbo].[Threads_SelectAll]";
            Paged<Thread> pagedList = null;
            List<Thread> list = null;
            int totalCount = 0;
            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection col) {
                col.AddWithValue("@PageIndex", pageIndex);
                col.AddWithValue("@PageSize", pageSize);
            }, singleRecordMapper: delegate (IDataReader reader, short set) {
                int startingIndex = 0;
                Thread thread = MapThread(reader, out startingIndex);
                if (list == null)
                {
                    totalCount = reader.GetSafeInt32(startingIndex += 1);
                    list = new List<Thread>();
                }
                list.Add(thread);
            });
            if (list != null)
            {
                pagedList = new Paged<Thread>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }
        public void DeleteById(int id)
        {
            string procName = "dbo.Threads_Delete_ById";
            _data.ExecuteNonQuery(procName, delegate (SqlParameterCollection parameterCollection)
            {
                parameterCollection.AddWithValue("@Id", id);
            });
        }
        public void Update(ThreadUpdateRequest model)
        {
            string procName = "dbo.Threads_Update";
            _data.ExecuteNonQuery(procName, delegate (SqlParameterCollection parameterCollection)
            {
                parameterCollection.AddWithValue("@Subject", model.Subject);
                parameterCollection.AddWithValue("@IsActive", model.IsActive);
                parameterCollection.AddWithValue("@Id", model.Id);
            });
        }
        public Thread GetById(int id)
        {
            string procName = "dbo.Threads_Select_ById";
            Thread thread = null;
            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", id);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                thread = MapThread(reader, out startingIndex);
            });
            return thread;
        }
        public Paged<Thread> GetByCreatedBy(int userId, int pageIndex, int pageSize)
        {
            string procName = "[dbo].[Threads_Select_ByCreatedBy]";
            Paged<Thread> pagedList = null;
            List<Thread> list = null;

            int totalCount = 0;
            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@CreatedBy", userId);
                col.AddWithValue("@PageIndex", pageIndex);
                col.AddWithValue("@PageSize", pageSize);

            }, singleRecordMapper: delegate (IDataReader reader, short set) {
                int startingIndex = 0;
                Thread thread = MapThread(reader, out startingIndex);
                if (list == null)
                {
                    totalCount = reader.GetSafeInt32(startingIndex += 1);
                    list = new List<Thread>();
                }
                list.Add(thread);
            });
            if (list != null)
            {
                pagedList = new Paged<Thread>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }
        public Reply ReplySelectById(int id)
        {
            Reply reply = null;

            _data.ExecuteCmd("dbo.Replies_SelectById",
                delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@Id", id);
                },
                delegate (IDataReader reader, short set)
                {
                    int index = 0;

                    reply.Id = reader.GetSafeInt32(index++);
                    reply.Content = reader.GetSafeString(index++);
                    reply.PostId = reader.GetSafeInt32(index++);
                    reply.CreatedBy = reader.GetSafeInt32(index++);
                    reply.ModifiedBy = reader.GetSafeInt32(index++);
                    reply.DateCreated = reader.GetSafeDateTime(index++);
                    reply.DateModified = reader.GetSafeDateTime(index++);
                });
            return reply;
        }
        private static Thread MapThread(IDataReader reader, out int index)
        {
            index = 0;
            Thread thread = new Thread();
            thread.Id = reader.GetSafeInt32(index);
            thread.Subject = reader.GetSafeString(index += 1);
            thread.IsActive = reader.GetSafeBool(index += 1);
            thread.CreatedBy = reader.GetSafeInt32(index += 1);
            thread.DateCreated = reader.GetSafeDateTime(index += 1);
            return thread;
        }
    }
}
