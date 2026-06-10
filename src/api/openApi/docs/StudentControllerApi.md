# StudentControllerApi

All URIs are relative to *http://localhost:9090*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**forgotPassword**](#forgotpassword) | **POST** /api/student/forgot-password | |
|[**getAllStudents**](#getallstudents) | **GET** /api/student/view-students | |
|[**login**](#login) | **POST** /api/student/login | |
|[**register**](#register) | **POST** /api/student/register | |
|[**resetPassword**](#resetpassword) | **POST** /api/student/reset-password | |
|[**updateProfile**](#updateprofile) | **PUT** /api/student/update/{studentId} | |
|[**verifyOtp**](#verifyotp) | **POST** /api/student/otp-verify | |
|[**verifyRegistrationOtp**](#verifyregistrationotp) | **POST** /api/student/verify-registration-otp | |

# **forgotPassword**
> string forgotPassword(forgotPasswordRequest)


### Example

```typescript
import {
    StudentControllerApi,
    Configuration,
    ForgotPasswordRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentControllerApi(configuration);

let forgotPasswordRequest: ForgotPasswordRequest; //

const { status, data } = await apiInstance.forgotPassword(
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

# **getAllStudents**
> Array<StudentResponse> getAllStudents()


### Example

```typescript
import {
    StudentControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentControllerApi(configuration);

const { status, data } = await apiInstance.getAllStudents();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<StudentResponse>**

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

# **login**
> StudentLoginResponse login(studentLoginRequest)


### Example

```typescript
import {
    StudentControllerApi,
    Configuration,
    StudentLoginRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentControllerApi(configuration);

let studentLoginRequest: StudentLoginRequest; //

const { status, data } = await apiInstance.login(
    studentLoginRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentLoginRequest** | **StudentLoginRequest**|  | |


### Return type

**StudentLoginResponse**

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

# **register**
> StudentResponse register(studentRegistrationRequest)


### Example

```typescript
import {
    StudentControllerApi,
    Configuration,
    StudentRegistrationRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentControllerApi(configuration);

let studentRegistrationRequest: StudentRegistrationRequest; //

const { status, data } = await apiInstance.register(
    studentRegistrationRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentRegistrationRequest** | **StudentRegistrationRequest**|  | |


### Return type

**StudentResponse**

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

# **resetPassword**
> string resetPassword(resetPasswordRequest)


### Example

```typescript
import {
    StudentControllerApi,
    Configuration,
    ResetPasswordRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentControllerApi(configuration);

let resetPasswordRequest: ResetPasswordRequest; //

const { status, data } = await apiInstance.resetPassword(
    resetPasswordRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **resetPasswordRequest** | **ResetPasswordRequest**|  | |


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

# **updateProfile**
> StudentResponse updateProfile()


### Example

```typescript
import {
    StudentControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentControllerApi(configuration);

let studentId: string; // (default to undefined)
let firstNm: string; // (default to undefined)
let lastNm: string; // (default to undefined)
let gender: string; // (default to undefined)
let dob: string; // (default to undefined)
let addr1: string; // (optional) (default to undefined)
let addr2: string; // (optional) (default to undefined)
let city: string; // (optional) (default to undefined)
let state: string; // (optional) (default to undefined)
let country: string; // (optional) (default to undefined)
let pin: string; // (optional) (default to undefined)
let mobileNum: string; // (optional) (default to undefined)
let emergencyContactNm: string; // (optional) (default to undefined)
let emergencyContactNum: string; // (optional) (default to undefined)
let profileImg: File; // (optional) (default to undefined)

const { status, data } = await apiInstance.updateProfile(
    studentId,
    firstNm,
    lastNm,
    gender,
    dob,
    addr1,
    addr2,
    city,
    state,
    country,
    pin,
    mobileNum,
    emergencyContactNm,
    emergencyContactNum,
    profileImg
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentId** | [**string**] |  | defaults to undefined|
| **firstNm** | [**string**] |  | defaults to undefined|
| **lastNm** | [**string**] |  | defaults to undefined|
| **gender** | [**string**] |  | defaults to undefined|
| **dob** | [**string**] |  | defaults to undefined|
| **addr1** | [**string**] |  | (optional) defaults to undefined|
| **addr2** | [**string**] |  | (optional) defaults to undefined|
| **city** | [**string**] |  | (optional) defaults to undefined|
| **state** | [**string**] |  | (optional) defaults to undefined|
| **country** | [**string**] |  | (optional) defaults to undefined|
| **pin** | [**string**] |  | (optional) defaults to undefined|
| **mobileNum** | [**string**] |  | (optional) defaults to undefined|
| **emergencyContactNm** | [**string**] |  | (optional) defaults to undefined|
| **emergencyContactNum** | [**string**] |  | (optional) defaults to undefined|
| **profileImg** | [**File**] |  | (optional) defaults to undefined|


### Return type

**StudentResponse**

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

# **verifyOtp**
> StudentLoginResponse verifyOtp(otpVerifyRequest)


### Example

```typescript
import {
    StudentControllerApi,
    Configuration,
    OtpVerifyRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentControllerApi(configuration);

let otpVerifyRequest: OtpVerifyRequest; //

const { status, data } = await apiInstance.verifyOtp(
    otpVerifyRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **otpVerifyRequest** | **OtpVerifyRequest**|  | |


### Return type

**StudentLoginResponse**

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

# **verifyRegistrationOtp**
> string verifyRegistrationOtp(otpVerifyRequest)


### Example

```typescript
import {
    StudentControllerApi,
    Configuration,
    OtpVerifyRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentControllerApi(configuration);

let otpVerifyRequest: OtpVerifyRequest; //

const { status, data } = await apiInstance.verifyRegistrationOtp(
    otpVerifyRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **otpVerifyRequest** | **OtpVerifyRequest**|  | |


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

