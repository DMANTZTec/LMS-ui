# EnrollmentControllerApi

All URIs are relative to *http://localhost:9090/lms*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createEnrollment**](#createenrollment) | **POST** /api/enrollments | |
|[**deleteEnrollment**](#deleteenrollment) | **DELETE** /api/enrollments/{id} | |
|[**getAllEnrollments**](#getallenrollments) | **GET** /api/enrollments | |
|[**getEnrollmentById**](#getenrollmentbyid) | **GET** /api/enrollments/{id} | |
|[**getEnrollmentsByStudent**](#getenrollmentsbystudent) | **GET** /api/enrollments/student/{studentId} | |
|[**updateEnrollment**](#updateenrollment) | **PUT** /api/enrollments/{id} | |

# **createEnrollment**
> EnrollmentResponse createEnrollment(enrollmentRequest)


### Example

```typescript
import {
    EnrollmentControllerApi,
    Configuration,
    EnrollmentRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new EnrollmentControllerApi(configuration);

let enrollmentRequest: EnrollmentRequest; //

const { status, data } = await apiInstance.createEnrollment(
    enrollmentRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **enrollmentRequest** | **EnrollmentRequest**|  | |


### Return type

**EnrollmentResponse**

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

# **deleteEnrollment**
> deleteEnrollment()


### Example

```typescript
import {
    EnrollmentControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EnrollmentControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.deleteEnrollment(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAllEnrollments**
> Array<EnrollmentResponse> getAllEnrollments()


### Example

```typescript
import {
    EnrollmentControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EnrollmentControllerApi(configuration);

const { status, data } = await apiInstance.getAllEnrollments();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<EnrollmentResponse>**

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

# **getEnrollmentById**
> EnrollmentResponse getEnrollmentById()


### Example

```typescript
import {
    EnrollmentControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EnrollmentControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getEnrollmentById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**EnrollmentResponse**

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

# **getEnrollmentsByStudent**
> Array<EnrollmentResponse> getEnrollmentsByStudent()


### Example

```typescript
import {
    EnrollmentControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EnrollmentControllerApi(configuration);

let studentId: string; // (default to undefined)

const { status, data } = await apiInstance.getEnrollmentsByStudent(
    studentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentId** | [**string**] |  | defaults to undefined|


### Return type

**Array<EnrollmentResponse>**

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

# **updateEnrollment**
> EnrollmentResponse updateEnrollment(enrollmentRequest)


### Example

```typescript
import {
    EnrollmentControllerApi,
    Configuration,
    EnrollmentRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new EnrollmentControllerApi(configuration);

let id: number; // (default to undefined)
let enrollmentRequest: EnrollmentRequest; //

const { status, data } = await apiInstance.updateEnrollment(
    id,
    enrollmentRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **enrollmentRequest** | **EnrollmentRequest**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**EnrollmentResponse**

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

