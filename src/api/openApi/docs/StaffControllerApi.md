# StaffControllerApi

All URIs are relative to *http://localhost:9090*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**forgotPassword1**](#forgotpassword1) | **POST** /api/staff/forgot-password | |
|[**getAllStaff**](#getallstaff) | **GET** /api/staff/view-staff | |
|[**getStaffById**](#getstaffbyid) | **GET** /api/staff/{staffId} | |
|[**registerInitialAdmin**](#registerinitialadmin) | **POST** /api/staff/admin-register | |
|[**registerStaff**](#registerstaff) | **POST** /api/staff/register | |
|[**resetPassword1**](#resetpassword1) | **POST** /api/staff/reset-password | |
|[**verifyOtp1**](#verifyotp1) | **POST** /api/staff/verify-otp | |

# **forgotPassword1**
> StaffPasswordResponse forgotPassword1(forgotPasswordRequest)


### Example

```typescript
import {
    StaffControllerApi,
    Configuration,
    ForgotPasswordRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffControllerApi(configuration);

let forgotPasswordRequest: ForgotPasswordRequest; //

const { status, data } = await apiInstance.forgotPassword1(
    forgotPasswordRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **forgotPasswordRequest** | **ForgotPasswordRequest**|  | |


### Return type

**StaffPasswordResponse**

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

# **getAllStaff**
> Array<StaffResponse> getAllStaff()


### Example

```typescript
import {
    StaffControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffControllerApi(configuration);

const { status, data } = await apiInstance.getAllStaff();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<StaffResponse>**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getStaffById**
> StaffResponse getStaffById()


### Example

```typescript
import {
    StaffControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffControllerApi(configuration);

let staffId: string; // (default to undefined)

const { status, data } = await apiInstance.getStaffById(
    staffId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **staffId** | [**string**] |  | defaults to undefined|


### Return type

**StaffResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **registerInitialAdmin**
> StaffResponse registerInitialAdmin(staffRegistrationRequest)


### Example

```typescript
import {
    StaffControllerApi,
    Configuration,
    StaffRegistrationRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffControllerApi(configuration);

let staffRegistrationRequest: StaffRegistrationRequest; //

const { status, data } = await apiInstance.registerInitialAdmin(
    staffRegistrationRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **staffRegistrationRequest** | **StaffRegistrationRequest**|  | |


### Return type

**StaffResponse**

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

# **registerStaff**
> StaffResponse registerStaff(staffRegistrationRequest)


### Example

```typescript
import {
    StaffControllerApi,
    Configuration,
    StaffRegistrationRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffControllerApi(configuration);

let staffRegistrationRequest: StaffRegistrationRequest; //
let loggedInStaffId: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.registerStaff(
    staffRegistrationRequest,
    loggedInStaffId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **staffRegistrationRequest** | **StaffRegistrationRequest**|  | |
| **loggedInStaffId** | [**string**] |  | (optional) defaults to undefined|


### Return type

**StaffResponse**

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

# **resetPassword1**
> StaffPasswordResponse resetPassword1(staffResetPasswordRequest)


### Example

```typescript
import {
    StaffControllerApi,
    Configuration,
    StaffResetPasswordRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffControllerApi(configuration);

let staffResetPasswordRequest: StaffResetPasswordRequest; //

const { status, data } = await apiInstance.resetPassword1(
    staffResetPasswordRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **staffResetPasswordRequest** | **StaffResetPasswordRequest**|  | |


### Return type

**StaffPasswordResponse**

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

# **verifyOtp1**
> OtpVerifyResponse verifyOtp1(staffOtpVerifyRequest)


### Example

```typescript
import {
    StaffControllerApi,
    Configuration,
    StaffOtpVerifyRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffControllerApi(configuration);

let staffOtpVerifyRequest: StaffOtpVerifyRequest; //

const { status, data } = await apiInstance.verifyOtp1(
    staffOtpVerifyRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **staffOtpVerifyRequest** | **StaffOtpVerifyRequest**|  | |


### Return type

**OtpVerifyResponse**

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

