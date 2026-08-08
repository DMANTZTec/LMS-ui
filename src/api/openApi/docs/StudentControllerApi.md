# StudentControllerApi

All URIs are relative to *http://localhost:9090*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**changePassword**](#changepassword) | **POST** /api/student/change-password | |
|[**forgotPassword**](#forgotpassword) | **POST** /api/student/forgot-password | |
|[**getAllStudents**](#getallstudents) | **GET** /api/student/view-students | |
|[**getStudentById**](#getstudentbyid) | **GET** /api/student/{studentId} | |
|[**login**](#login) | **POST** /api/student/login | |
|[**register**](#register) | **POST** /api/student/register | |
|[**resendOtp**](#resendotp) | **POST** /api/student/resend-otp | |
|[**resetPassword**](#resetpassword) | **POST** /api/student/reset-password | |
|[**updateProfile**](#updateprofile) | **PUT** /api/student/{studentId} | |
|[**updateProfileImage**](#updateprofileimage) | **PUT** /api/student/{studentId}/profile-image | |
|[**verifyLoginOtp**](#verifyloginotp) | **POST** /api/student/verify-login-otp | |
|[**verifyOtp**](#verifyotp) | **POST** /api/student/registration/verify-otp | |

# **changePassword**
> string changePassword(changePasswordRequest)


### Example

```typescript
import {
    StudentControllerApi,
    Configuration,
    ChangePasswordRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentControllerApi(configuration);

let changePasswordRequest: ChangePasswordRequest; //

const { status, data } = await apiInstance.changePassword(
    changePasswordRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **changePasswordRequest** | **ChangePasswordRequest**|  | |


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

# **getStudentById**
> StudentResponse getStudentById()


### Example

```typescript
import {
    StudentControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentControllerApi(configuration);

let studentId: string; // (default to undefined)

const { status, data } = await apiInstance.getStudentById(
    studentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentId** | [**string**] |  | defaults to undefined|


### Return type

**StudentResponse**

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
> RegistrationResponse register(studentRegistrationRequest)


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

**RegistrationResponse**

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

# **resendOtp**
> RegistrationResponse resendOtp(resendOtpRequest)


### Example

```typescript
import {
    StudentControllerApi,
    Configuration,
    ResendOtpRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentControllerApi(configuration);

let resendOtpRequest: ResendOtpRequest; //

const { status, data } = await apiInstance.resendOtp(
    resendOtpRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **resendOtpRequest** | **ResendOtpRequest**|  | |


### Return type

**RegistrationResponse**

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
> StudentResponse updateProfile(studentUpdateRequest)


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

const { status, data } = await apiInstance.updateProfile(
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
> StudentResponse updateProfileImage()


### Example

```typescript
import {
    StudentControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentControllerApi(configuration);

let studentId: string; // (default to undefined)
let profileImg: File; // (default to undefined)

const { status, data } = await apiInstance.updateProfileImage(
    studentId,
    profileImg
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentId** | [**string**] |  | defaults to undefined|
| **profileImg** | [**File**] |  | defaults to undefined|


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

# **verifyLoginOtp**
> StudentLoginResponse verifyLoginOtp(otpVerifyRequest)


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

const { status, data } = await apiInstance.verifyLoginOtp(
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

# **verifyOtp**
> StudentResponse verifyOtp(otpVerifyRequest)


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

