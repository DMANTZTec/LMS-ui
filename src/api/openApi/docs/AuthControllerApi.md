# AuthControllerApi

All URIs are relative to *http://localhost:9090*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**staffLogin**](#stafflogin) | **POST** /api/auth/staff/login | |

# **staffLogin**
> StaffLoginResponse staffLogin(staffLoginRequest)


### Example

```typescript
import {
    AuthControllerApi,
    Configuration,
    StaffLoginRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthControllerApi(configuration);

let staffLoginRequest: StaffLoginRequest; //

const { status, data } = await apiInstance.staffLogin(
    staffLoginRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **staffLoginRequest** | **StaffLoginRequest**|  | |


### Return type

**StaffLoginResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

