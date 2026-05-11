# ClassStudentControllerApi

All URIs are relative to *http://localhost:9090*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**enrollStudents**](#enrollstudents) | **POST** /api/class-students/enroll | |
|[**removeStudents**](#removestudents) | **POST** /api/class-students/remove | |

# **enrollStudents**
> Array<EnrollStudentResponse> enrollStudents(enrollStudentRequest)


### Example

```typescript
import {
    ClassStudentControllerApi,
    Configuration,
    EnrollStudentRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassStudentControllerApi(configuration);

let enrollStudentRequest: EnrollStudentRequest; //

const { status, data } = await apiInstance.enrollStudents(
    enrollStudentRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **enrollStudentRequest** | **EnrollStudentRequest**|  | |


### Return type

**Array<EnrollStudentResponse>**

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

# **removeStudents**
> Array<string> removeStudents(removeStudentRequest)


### Example

```typescript
import {
    ClassStudentControllerApi,
    Configuration,
    RemoveStudentRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassStudentControllerApi(configuration);

let removeStudentRequest: RemoveStudentRequest; //

const { status, data } = await apiInstance.removeStudents(
    removeStudentRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **removeStudentRequest** | **RemoveStudentRequest**|  | |


### Return type

**Array<string>**

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

