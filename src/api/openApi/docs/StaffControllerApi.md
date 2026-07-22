# StaffControllerApi

All URIs are relative to *http://localhost:9090*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createStaff**](#createstaff) | **POST** /api/staff/register | |
|[**forgotPassword1**](#forgotpassword1) | **POST** /api/staff/forgot-password | |
|[**getActiveStaff**](#getactivestaff) | **GET** /api/staff/active | |
|[**getAllStaff**](#getallstaff) | **GET** /api/staff/view-staff | |
|[**getAllStaff1**](#getallstaff1) | **GET** /api/staff/pagination | |
|[**getStaffById**](#getstaffbyid) | **GET** /api/staff/{staffId} | |
|[**registerInitialAdmin**](#registerinitialadmin) | **POST** /api/staff/admin-register | |
|[**resendLoginOtp**](#resendloginotp) | **POST** /api/staff/resend-login-otp | |
|[**resetPassword1**](#resetpassword1) | **POST** /api/staff/reset-password | |
|[**setPassword**](#setpassword) | **POST** /api/staff/set-Newpassword | |
|[**staffLogin**](#stafflogin) | **POST** /api/staff/login | |
|[**updateProfileImage**](#updateprofileimage) | **PUT** /api/staff/{staffId}/profile-image | |
|[**updateStaff**](#updatestaff) | **PUT** /api/staff/{staffId} | |
|[**validateResetToken**](#validateresettoken) | **GET** /api/staff/reset-password/validate | |
|[**verifyStaffOtp**](#verifystaffotp) | **POST** /api/staff/login-verification-otp | |

# **createStaff**
> StaffResponse createStaff()


### Example

```typescript
import {
    StaffControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffControllerApi(configuration);

let firstNm: string; // (default to undefined)
let lastNm: string; // (default to undefined)
let emailId: string; // (default to undefined)
let mobileNum: string; // (default to undefined)
let roleIds: Set<number>; // (default to undefined)
let dob: string; // (optional) (default to undefined)
let gender: string; // (optional) (default to undefined)
let dateOfJoining: string; // (optional) (default to undefined)
let profileImg: File; // (optional) (default to undefined)

const { status, data } = await apiInstance.createStaff(
    firstNm,
    lastNm,
    emailId,
    mobileNum,
    roleIds,
    dob,
    gender,
    dateOfJoining,
    profileImg
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **firstNm** | [**string**] |  | defaults to undefined|
| **lastNm** | [**string**] |  | defaults to undefined|
| **emailId** | [**string**] |  | defaults to undefined|
| **mobileNum** | [**string**] |  | defaults to undefined|
| **roleIds** | **Set&lt;number&gt;** |  | defaults to undefined|
| **dob** | [**string**] |  | (optional) defaults to undefined|
| **gender** | [**string**]**Array<&#39;MALE&#39; &#124; &#39;FEMALE&#39; &#124; &#39;PREFER_NOT_TO_SAY&#39; &#124; &#39;NON_BINARY&#39; &#124; &#39;OTHER&#39;>** |  | (optional) defaults to undefined|
| **dateOfJoining** | [**string**] |  | (optional) defaults to undefined|
| **profileImg** | [**File**] |  | (optional) defaults to undefined|


### Return type

**StaffResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **forgotPassword1**
> string forgotPassword1(forgotPasswordRequest)


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

**string**

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

# **getActiveStaff**
> PageStaffResponse getActiveStaff()


### Example

```typescript
import {
    StaffControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffControllerApi(configuration);

let page: number; // (optional) (default to 0)
let size: number; // (optional) (default to 10)

const { status, data } = await apiInstance.getActiveStaff(
    page,
    size
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] |  | (optional) defaults to 0|
| **size** | [**number**] |  | (optional) defaults to 10|


### Return type

**PageStaffResponse**

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

# **getAllStaff1**
> PageStaffResponse getAllStaff1()


### Example

```typescript
import {
    StaffControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffControllerApi(configuration);

let page: number; // (optional) (default to 0)
let size: number; // (optional) (default to 10)

const { status, data } = await apiInstance.getAllStaff1(
    page,
    size
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] |  | (optional) defaults to 0|
| **size** | [**number**] |  | (optional) defaults to 10|


### Return type

**PageStaffResponse**

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

# **resendLoginOtp**
> ResendOtpResponse resendLoginOtp(resendStaffOtpRequest)


### Example

```typescript
import {
    StaffControllerApi,
    Configuration,
    ResendStaffOtpRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffControllerApi(configuration);

let resendStaffOtpRequest: ResendStaffOtpRequest; //

const { status, data } = await apiInstance.resendLoginOtp(
    resendStaffOtpRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **resendStaffOtpRequest** | **ResendStaffOtpRequest**|  | |


### Return type

**ResendOtpResponse**

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
> string resetPassword1(setStaffPasswordRequest)


### Example

```typescript
import {
    StaffControllerApi,
    Configuration,
    SetStaffPasswordRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffControllerApi(configuration);

let setStaffPasswordRequest: SetStaffPasswordRequest; //

const { status, data } = await apiInstance.resetPassword1(
    setStaffPasswordRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **setStaffPasswordRequest** | **SetStaffPasswordRequest**|  | |


### Return type

**string**

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

# **setPassword**
> object setPassword(setStaffPasswordRequest)


### Example

```typescript
import {
    StaffControllerApi,
    Configuration,
    SetStaffPasswordRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffControllerApi(configuration);

let setStaffPasswordRequest: SetStaffPasswordRequest; //

const { status, data } = await apiInstance.setPassword(
    setStaffPasswordRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **setStaffPasswordRequest** | **SetStaffPasswordRequest**|  | |


### Return type

**object**

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

# **staffLogin**
> StaffLoginResponse staffLogin(staffLoginRequest)


### Example

```typescript
import {
    StaffControllerApi,
    Configuration,
    StaffLoginRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffControllerApi(configuration);

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

# **updateProfileImage**
> StaffResponse updateProfileImage()


### Example

```typescript
import {
    StaffControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffControllerApi(configuration);

let staffId: string; // (default to undefined)
let file: File; // (default to undefined)

const { status, data } = await apiInstance.updateProfileImage(
    staffId,
    file
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **staffId** | [**string**] |  | defaults to undefined|
| **file** | [**File**] |  | defaults to undefined|


### Return type

**StaffResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateStaff**
> StaffResponse updateStaff(staffUpdateRequest)


### Example

```typescript
import {
    StaffControllerApi,
    Configuration,
    StaffUpdateRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffControllerApi(configuration);

let staffId: string; // (default to undefined)
let staffUpdateRequest: StaffUpdateRequest; //

const { status, data } = await apiInstance.updateStaff(
    staffId,
    staffUpdateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **staffUpdateRequest** | **StaffUpdateRequest**|  | |
| **staffId** | [**string**] |  | defaults to undefined|


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

# **validateResetToken**
> string validateResetToken()


### Example

```typescript
import {
    StaffControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffControllerApi(configuration);

let token: string; // (default to undefined)

const { status, data } = await apiInstance.validateResetToken(
    token
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **token** | [**string**] |  | defaults to undefined|


### Return type

**string**

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

# **verifyStaffOtp**
> StaffLoginResponse verifyStaffOtp(staffOtpVerifyRequest)


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

const { status, data } = await apiInstance.verifyStaffOtp(
    staffOtpVerifyRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **staffOtpVerifyRequest** | **StaffOtpVerifyRequest**|  | |


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

