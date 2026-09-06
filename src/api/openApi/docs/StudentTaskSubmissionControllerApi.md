# StudentTaskSubmissionControllerApi

All URIs are relative to *http://localhost:9090/lms*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**submitTask**](#submittask) | **POST** /api/student-task-submission | |

# **submitTask**
> StudentTaskSubmissionResponse submitTask(studentTaskSubmissionRequest)


### Example

```typescript
import {
    StudentTaskSubmissionControllerApi,
    Configuration,
    StudentTaskSubmissionRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentTaskSubmissionControllerApi(configuration);

let studentTaskSubmissionRequest: StudentTaskSubmissionRequest; //

const { status, data } = await apiInstance.submitTask(
    studentTaskSubmissionRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentTaskSubmissionRequest** | **StudentTaskSubmissionRequest**|  | |


### Return type

**StudentTaskSubmissionResponse**

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

