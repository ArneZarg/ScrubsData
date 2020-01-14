using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Providers;
using Sabio.Models.Requests.Licenses;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text;

namespace Sabio.Services.Interfaces
{
    public interface ILicenseService
    {
        int Add(ProviderLicenseAddRequest model, int userId);

        ProviderLicense Get(int id);

        void DeleteById(int Id);

        void Update(ProviderLicenseUpdateRequest model, int userId);

        Paged<ProviderLicense> Pagination(int pageIndex, int pageSize);

        Paged<ProviderLicense> GetByCreatedBy(int pageIndex, int pageSize, int userId);

        Paged<ProviderLicense> GetByState(int pageIndex, int pageSize, int stateId);

        Paged<ProviderLicense> Search(int pageIndex, int pageSize, string search);
    }
}
