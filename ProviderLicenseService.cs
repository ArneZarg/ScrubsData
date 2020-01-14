using Example.Data;
using Example.Data.Providers;
using Example.Models;
using Example.Models.Domain;
using Example.Models.Domain.Providers;
using Example.Models.Requests.Licenses;
using Example.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace Example.Services
{
    public class ProviderLicenseService : ILicenseService
    {
        
        
        IDataProvider _data = null;

        public ProviderLicenseService(IDataProvider data) {
            _data = data;
        }

       
        public int Add(ProviderLicenseAddRequest model, int userId)
        {
            int id = 0;

            string procName = "dbo.Licenses_Insert";
            
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                
                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;

                
                col.Add(idOut);

                col.AddWithValue("@LicenseStateId", model.LicenseStateId);
                col.AddWithValue("@LicenseNumber", model.LicenseNumber);
                col.AddWithValue("@DateExpires", model.DateExpires);
                col.AddWithValue("@CreatedBy", userId);

            }, returnParameters: delegate(SqlParameterCollection returnCol)
            {
                
                object outputId = returnCol["@Id"].Value;
                Int32.TryParse(outputId.ToString(), out id);
            });
            return id;
        }
        
        public ProviderLicense Get(int id) {
            string procName = "dbo.Licenses_Select_ById";
            ProviderLicense license = null;
            _data.ExecuteCmd(procName, inputParamMapper:delegate (SqlParameterCollection parameterCollection)
            {
                parameterCollection.AddWithValue("@Id", id);
                
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                license = MapLicense(reader, out startingIndex);
            });
            return license;
        }

        public Paged<ProviderLicense> Pagination(int pageIndex, int pageSize) {

            string procName = "dbo.Licenses_SelectAll";
            Paged<ProviderLicense> pagedList = null;
            List<ProviderLicense> list = null;
            
            int totalCount = 0;
            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection param){
                    param.AddWithValue("@CurrentPage", pageIndex);
                    param.AddWithValue("@ItemsPerPage", pageSize);
                },singleRecordMapper: delegate (IDataReader reader, short set){
                    int startingIndex = 0;
                    ProviderLicense pl = MapLicense(reader, out startingIndex );
                    if (list == null)
                    {
                        totalCount = reader.GetSafeInt32(startingIndex += 1);
                        list = new List<ProviderLicense>();
                    }
                    list.Add(pl);
                });
            if (list != null)
            {
                pagedList = new Paged<ProviderLicense>(list, pageIndex, pageSize, totalCount);
            }
            if (totalCount == 0) {
                ;
            }
            return pagedList;
        }

        public Paged<ProviderLicense> GetByCreatedBy(int pageIndex, int pageSize, int createdBy)
        {
            string procName = "dbo.Licenses_Select_ByCreatedBy";
            Paged<ProviderLicense> pagedList = null;
            List<ProviderLicense> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection param){
                    param.AddWithValue("@CurrentPage", pageIndex);
                    param.AddWithValue("@ItemsPerPage", pageSize);
                    param.AddWithValue("@CreatedBy", createdBy);
                },singleRecordMapper: delegate (IDataReader reader, short set) {
                    int startingIndex = 0;
                    ProviderLicense pl = MapLicense(reader, out startingIndex);
                    if (list == null)
                    {
                        totalCount = reader.GetSafeInt32(startingIndex+=1);
                        list = new List<ProviderLicense>();
                        
                    }
                    list.Add(pl);
                });
            if (list != null)
            {
                pagedList = new Paged<ProviderLicense>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public Paged<ProviderLicense> GetByState(int pageIndex, int pageSize, int stateId)
        {
            string procName = "dbo.Licenses_Select_byState";
            Paged<ProviderLicense> pagedList = null;
            List<ProviderLicense> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection param)
            {
                param.AddWithValue("@PageIndex", pageIndex);
                param.AddWithValue("@ItemsPerPage", pageSize);
                param.AddWithValue("@State", stateId);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                ProviderLicense pl = MapLicense(reader, out startingIndex);
                if (list == null)
                {
                    totalCount = reader.GetSafeInt32(startingIndex+=1);
                    list = new List<ProviderLicense>();
                }
                list.Add(pl);
            });
            if (list != null) {
                pagedList = new Paged<ProviderLicense>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public Paged<ProviderLicense> Search(int pageIndex, int pageSize, string search) {
            string procName = "dbo.Licenses_Search";
            Paged<ProviderLicense> pagedList = null;
            List <ProviderLicense> list = null;
            int totalCount = 0;
            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection param)
            {
                param.AddWithValue("@PageIndex", pageIndex);
                param.AddWithValue("@ItemsPerPage", pageSize);
                param.AddWithValue("@Search", search);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex;
                 ProviderLicense pl = MapLicense(reader, out startingIndex);
                 if (list == null)
                 {
                    totalCount = reader.GetSafeInt32(startingIndex += 1);
                    list = new List<ProviderLicense>();
                 }
                 list.Add(pl);
             });
            if (list != null) {
                pagedList = new Paged<ProviderLicense>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public void DeleteById(int id) {
            string procName = "dbo.Licenses_Delete_ById";
            _data.ExecuteNonQuery(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);
            });
        }

        public void Update(ProviderLicenseUpdateRequest model, int userId)
        {

            string procName = "dbo.Licenses_Update";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", model.Id);
                col.AddWithValue("@LicenseStateId", model.LicenseStateId);
                col.AddWithValue("@LicenseNumber", model.LicenseNumber);
                col.AddWithValue("@DateExpires", model.DateExpires);
                col.AddWithValue("@ModifiedBy", userId);
            });
        }
        

        private static ProviderLicense MapLicense(IDataReader reader, out int index)
        {
            index = 0;
            ProviderLicense license = new ProviderLicense();
            license.Id = reader.GetSafeInt32(index);
            
            
            license.LicenseNumber = reader.GetSafeString(index += 1);
            license.DateExpires = reader.GetSafeDateTime(index += 1);
            license.CreatedBy = reader.GetSafeInt32(index += 1);
            license.DateCreated = reader.GetSafeDateTime(index += 1);
            license.ModifiedBy = reader.GetSafeInt32(index += 1);
            license.DateModified = reader.GetSafeDateTime(index += 1);
            
            int userProfileId = reader.GetSafeInt32(index += 1);
            int userId = reader.GetSafeInt32(index += 1);
            string firstName = reader.GetSafeString(index += 1);
            string lastName = reader.GetSafeString(index += 1);
            string mi = reader.GetSafeString(index += 1);
            string avatarUrl = reader.GetSafeString(index += 1);
            DateTime dateCreated = reader.GetSafeDateTime(index += 1);
            DateTime dateModified = reader.GetSafeDateTime(index += 1);
            int createdBy = reader.GetSafeInt32(index += 1);
            int modifiedBy = reader.GetSafeInt32(index += 1);
            int stateId = reader.GetSafeInt32(index+=1);
            string state = reader.GetSafeString(index+=1);

            string stateCode = reader.GetSafeString(index += 1);

            if (userProfileId > 0)
            {
                license.UserProfile = new UserProfile();
                license.UserProfile.Id = userProfileId;
                license.UserProfile.UserId = userId;
                license.UserProfile.FirstName = firstName;
                license.UserProfile.LastName = lastName;
                license.UserProfile.Mi = mi;
                license.UserProfile.AvatarUrl = avatarUrl;
                license.UserProfile.DateCreated = dateCreated;
                license.UserProfile.DateModified = dateModified;
                license.UserProfile.CreatedBy = createdBy;
                license.UserProfile.ModifiedBy = modifiedBy;
            }
            if (stateId > 0)
            {
                license.State = new State();
                license.State.Id = stateId;
                license.State.Name = state;
                license.State.Code = stateCode;
            }
            return license;
        }
    }
}
