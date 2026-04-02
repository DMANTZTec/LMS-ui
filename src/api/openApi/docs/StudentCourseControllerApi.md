# StudentCourseControllerApi

All URIs are relative to *http://localhost:9090*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**enroll**](#enroll) | **POST** /api/student-course/enroll | |
|[**getStudentCourses**](#getstudentcourses) | **GET** /api/student-course/{studentId} | |

# **enroll**
> StudentCourseResponse enroll(studentCourseEnrollRequest)


### Example

```typescript
import {
    StudentCourseControllerApi,
    Configuration,
    StudentCourseEnrollRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentCourseControllerApi(configuration);

let studentCourseEnrollRequest: StudentCourseEnrollRequest; //

const { status, data } = await apiInstance.enroll(
    studentCourseEnrollRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentCourseEnrollRequest** | **StudentCourseEnrollRequest**|  | |


### Return type

**StudentCourseResponse**

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

# **getStudentCourses**
> Array<StudentCourseResponse> getStudentCourses()


### Example

```typescript
import {
    StudentCourseControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentCourseControllerApi(configuration);

let studentId: string; // (default to undefined)

const { status, data } = await apiInstance.getStudentCourses(
    studentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentId** | [**string**] |  | defaults to undefined|


### Return type

**Array<StudentCourseResponse>**

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

