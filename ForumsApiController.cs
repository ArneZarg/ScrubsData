using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Example.Models;
using Example.Models.Domain.Forums;
using Example.Models.Requests.Forums;
using Example.Services;
using Example.Services.Interfaces;
using Example.Web.Controllers;
using Example.Web.Models.Responses;
using System;
using System.Collections.Generic;

namespace Example.Web.Api.Controllers
{
    [Route("api/forums")]
    [ApiController]
    public class ForumsApiController : BaseApiController
    {
        private IAuthenticationService<int> _authService = null;
        private IForumsService _service = null;
        public ForumsApiController(IForumsService service, ILogger<ForumsApiController> logger, IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpPost("posts")]
        public ActionResult<ItemResponse<int>> PostInsert(PostAddRequest model)
        {
            ObjectResult result = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                int id = _service.PostInsert(model, userId);
                ItemResponse<int> response = new ItemResponse<int>();
                response.Item = id;
                result = Created201(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);
                result = StatusCode(500, response);
            }
            return result;
        }
        [HttpPut("posts/{id:int}")]
        public ActionResult<SuccessResponse> PostUpdate(PostUpdateRequest model)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                _service.PostUpdate(model, userId);

                response = new SuccessResponse();

            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }
        [HttpGet("posts/paginate")]
        public ActionResult<ItemResponse<Paged<Post>>> PostSelectAll(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<Post> page = _service.PostSelectAll(pageIndex, pageSize);
                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found");
                }
                else
                {
                    response = new ItemResponse<Paged<Post>> { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }
        [HttpGet("posts/createdby")]
        public ActionResult<ItemResponse<Paged<Post>>> PostSelectAllByCreatedBy(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;
            int userId = _authService.GetCurrentUserId();

            try
            {
                Paged<Post> page = _service.PostSelectAllByCreatedBy(pageIndex, pageSize, userId);
                if (page == null)
                {
                    code = 500;
                    response = new ErrorResponse("App Resource not found");
                }
                else
                {
                    response = new ItemResponse<Paged<Post>> { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 404;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }
        [HttpGet("posts/{id:int}")]
        public ActionResult<ItemResponse<Post>> PostSelectById(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Post post = _service.PostSelectById(id);
                if (post == null)
                {
                    code = 500;
                    response = new ErrorResponse("App Resource not found");
                }
                else
                {
                    response = new ItemResponse<Post>() { Item = post };
                }
            }
            catch (Exception ex)
            {
                code = 404;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }
        [HttpDelete("posts/{id:int}")]
        public ActionResult<SuccessResponse> PostDelete(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                _service.PostDelete(id);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }
        [HttpGet("paginate")]
        public ActionResult<ItemResponse<Paged<Thread>>> GetAllPagination(int pageIndex, int pageSize)
        {
            ActionResult result = null;
            try
            {
                Paged<Thread> thread = _service.GetAllPagination(pageIndex, pageSize);
                if (thread == null)
                {
                    result = NotFound404(new ErrorResponse("Records Not Found"));
                }
                else
                {
                    ItemResponse<Paged<Thread>> response = new ItemResponse<Paged<Thread>>() { Item = thread };
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.Message.ToString()));
            }
            return result;
        }
        [HttpGet("postsByThreadId/{threadId:int}")]
        public ActionResult<ItemResponse<Paged<Post>>> PostSelectByThreadId(int pageIndex, int pageSize, int threadId)
        {
            ActionResult result = null;
            try
            {
                Paged<Post> posts = _service.PostSelectByThreadId(pageIndex, pageSize, threadId);
                if (posts == null)
                {
                    result = NotFound404(new ErrorResponse("Records Not Found"));
                }
                else
                {
                    ItemResponse<Paged<Post>> response = new ItemResponse<Paged<Post>>() { Item = posts };
                    result = Ok200(response);
                }
            }
            catch (Exception ex) {
                Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.Message.ToString()));
            }
            return result;
        }
        [HttpGet("current")]
        public ActionResult<ItemResponse<Paged<Thread>>> GetByCreatedBy(int pageIndex, int pageSize)
        {
            ActionResult result = null;
            int userId = _authService.GetCurrentUserId();
            try
            {
                Paged<Thread> paged = _service.GetByCreatedBy(userId, pageIndex, pageSize);
                if (paged == null)
                {
                    result = NotFound404(new ErrorResponse("Records Not Found"));
                }
                else
                {
                    ItemResponse<Paged<Thread>> response = new ItemResponse<Paged<Thread>>() { Item = paged };
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.Message.ToString()));
            }
            return result;
        }
        [HttpPost]
        public ActionResult<ItemResponse<int>> Add(ThreadAddRequest model)
        {
            ObjectResult result = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                int id = _service.Add(model, userId);
                ItemResponse<int> response = new ItemResponse<int>() { Item = id };
                result = Created201(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);
                result = StatusCode(500, response);
            }
            return result;
        }
        [HttpDelete("{id:int}")]
        public ActionResult<SuccessResponse> Delete(int id)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                _service.DeleteById(id);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }
        [HttpPut("{id:int}")]
        public ActionResult<ItemResponse<int>> Update(ThreadUpdateRequest model)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                _service.Update(model);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }
        [HttpGet("{id:int}")]
        public ActionResult GetById(int id)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                Thread thread = _service.GetById(id);
                if (thread == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application resource not found");
                }
                else
                {
                    response = new ItemResponse<Thread> { Item = thread };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(iCode, response);
        }
        [HttpPost("replies")]
        public ActionResult<ItemResponse<int>> ReplyInsert(ReplyAddRequest model)
        {
            ObjectResult result = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                int id = _service.ReplyInsert(model, userId);
                ItemResponse<int> response = new ItemResponse<int>();
                response.Item = id;
                result = Created201(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);
                result = StatusCode(500, response);

            }
            return result;
        }
        [HttpPut("replies/{id:int}")]
        public ActionResult<SuccessResponse> ReplyUpdate(ReplyUpdateRequest model)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                _service.ReplyUpdate(model, userId);

                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }
        [HttpGet("replies/paginate")]
        public ActionResult<ItemResponse<Paged<Reply>>> ReplySelectAll(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<Reply> page = _service.ReplySelectAll(pageIndex, pageSize);
                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found");
                }
                else
                {
                    response = new ItemResponse<Paged<Reply>> { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }
        [HttpGet("replies/postid/{postid:int}")]
        public ActionResult<ItemsResponse<Reply>> ReplySelectByPostId(int postId)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                List<Reply> reply = _service.ReplySelectByPostId(postId);
                if(reply == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found");
                }
                else
                {
                    response = new ItemsResponse<Reply> { Items = reply };
                }
            }
            catch(Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }
        [HttpDelete("replies/{id:int}")]
        public ActionResult<SuccessResponse> ReplyDelete(int id)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                _service.ReplyDelete(id);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }
        [HttpGet("replies/{id:int}")]
        public ActionResult<ItemResponse<Reply>> ReplySelectById(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Reply reply = _service.ReplySelectById(id);
                if (reply == null)
                {
                    code = 500;
                    response = new ErrorResponse("App Resource Not Found");
                }
                else
                {
                    response = new ItemResponse<Reply>() { Item = reply };
                }
            }
            catch (Exception ex)
            {
                code = 404;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }
    }
}
