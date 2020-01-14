using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Example.Models.Domain;
using Example.Services;
using Example.Services.Interfaces;
using Example.Web.Controllers;
using Example.Web.Models.Responses;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Example.Models;
using Example.Models.Domain.Providers;
using Example.Models.Requests.Licenses;

namespace Example.Web.Api.Controllers
{
    [Route("api/licenses")]
    [ApiController]
    public class ProviderLicenseApiController : BaseApiController
    {
        private ILicenseService _service = null;
        private IAuthenticationService<int> _authService = null;

        public ProviderLicenseApiController(ILicenseService service, ILogger<PingApiController> logger,
            IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> Add(ProviderLicenseAddRequest model)
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
        
        [HttpGet("{id:int}")]
        public ActionResult GetById(int id)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                ProviderLicense license = _service.Get(id);

                if (license == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application resource not found");
                    
                }
                else
                {
                    response = new ItemResponse<ProviderLicense> { Item = license };
                    
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
        
        [HttpGet("paginate")]
        public ActionResult<ItemResponse<Paged<ProviderLicense>>> Pagination(int pageIndex, int pageSize) {
            ActionResult result = null;
            try
            {
                Paged<ProviderLicense> paged = _service.Pagination(pageIndex, pageSize);

                if (paged == null)
                {
                    result = NotFound404(new ErrorResponse("Records Not Found"));
                }
                else
                {
                    ItemResponse<Paged<ProviderLicense>> response = new ItemResponse<Paged<ProviderLicense>>() { Item=paged};
                   
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
        public ActionResult<ItemResponse<Paged<ProviderLicense>>> CreatedBy(int pageIndex, int pageSize) {
            ActionResult result = null;
            int userId = _authService.GetCurrentUserId();
            try {
                Paged<ProviderLicense> paged = _service.GetByCreatedBy(pageIndex, pageSize, userId);
                if (paged == null)
                {
                    result = NotFound404(new ErrorResponse("Records Not Found"));
                }
                else {
                    ItemResponse<Paged<ProviderLicense>> response = new ItemResponse<Paged<ProviderLicense>>() { Item=paged};
                   
                    result = Ok200(response);
                }
            }
            catch (Exception ex) {
                Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.Message.ToString()));
            }
            return result;
        }
        [HttpGet("state")]
        public ActionResult<ItemResponse<Paged<ProviderLicense>>> GetByState(int pageIndex, int pageSize, int stateId) {
            ActionResult result = null;
            
            try
            {
                int userId = _authService.GetCurrentUserId();
                Paged<ProviderLicense> paged = _service.GetByState(pageIndex, pageSize, stateId);
                if (paged == null)
                {
                    result = NotFound404(new ErrorResponse("Records Not Found"));
                }
                else
                {
                    ItemResponse<Paged<ProviderLicense>> response = new ItemResponse<Paged<ProviderLicense>>() {Item=paged };
                    
                    result = Ok200(response);
                }
            }
            catch (Exception ex) {
                Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.Message.ToString()));
            }
            return result;
        }
        
        [HttpGet("search")]
        public ActionResult<ItemResponse<Paged<ProviderLicense>>> Search(int pageIndex, int pageSize, string search) {
            ActionResult result = null;
            try {
                Paged<ProviderLicense> paged = _service.Search(pageIndex, pageSize, search);
                if (paged == null) {
                    result = NotFound404(new ErrorResponse("Records Not Found"));
                }
                else {
                    ItemResponse<Paged<ProviderLicense>> response = new ItemResponse<Paged<ProviderLicense>>() { Item=paged};
                    result = Ok200(response);
                }
            }
            catch(Exception ex)
            {
                Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.Message.ToString()));
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
            catch (Exception ex) {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpPut("{id:int}")]
        public ActionResult<ItemResponse<int>> Update(ProviderLicenseUpdateRequest model) {
            int code = 200;
            BaseResponse response = null;
            
            try
            {
                int userId = _authService.GetCurrentUserId();
                _service.Update(model, userId);
                response = new SuccessResponse();
            }
            catch(Exception ex) {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }
    }
}
