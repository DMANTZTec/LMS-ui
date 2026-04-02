# StudentControllerApi

All URIs are relative to *http://localhost:9090*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**forgotPassword**](#forgotpassword) | **POST** /api/student/forgot-password | |
|[**getAllStudents**](#getallstudents) | **GET** /api/student/view-students | |
|[**login**](#login) | **POST** /api/student/login | |
|[**registerStudent**](#registerstudent) | **POST** /api/student/register | |
|[**resetPassword**](#resetpassword) | **POST** /api/student/reset-password | |
|[**updateStudentProfile**](#updatestudentprofile) | **PUT** /api/student/update/{studentId} | |
|[**verifyOtp**](#verifyotp) | **POST** /api/student/otp-verify | |

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

No authorization required

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

No authorization required

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

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **registerStudent**
> StudentResponse registerStudent(studentRegistrationRequest)


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

const { status, data } = await apiInstance.registerStudent(
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

No authorization required

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

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateStudentProfile**
> StudentResponse updateStudentProfile(studentUpdateRequest)


### Example

```typescript
import {
    StudentControllerApi,
    Configuration,
    StudentUpdateRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentControllerApi(configuration);

let studentId: string; // (default to undefined)
let studentUpdateRequest: StudentUpdateRequest; //

const { status, data } = await apiInstance.updateStudentProfile(
    studentId,
    studentUpdateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentUpdateRequest** | **StudentUpdateRequest**|  | |
| **studentId** | [**string**] |  | defaults to undefined|


### Return type

**StudentResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **verifyOtp**
> OtpVerifyResponse verifyOtp(otpVerifyRequest)


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

**OtpVerifyResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

