# StudentTaskSubmissionControllerApi

All URIs are relative to *http://localhost:9090/lms*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**submitTask**](#submittask) | **POST** /api/student-task-submission | |

# **submitTask**
> StudentTaskSubmissionResponse submitTask()


### Example

```typescript
import {
    StudentTaskSubmissionControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentTaskSubmissionControllerApi(configuration);

let studentTaskId: number; // (default to undefined)
let studentId: string; // (default to undefined)
let attachments: Array<File>; // (default to undefined)
let submissionNotes: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.submitTask(
    studentTaskId,
    studentId,
    attachments,
    submissionNotes
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentTaskId** | [**number**] |  | defaults to undefined|
| **studentId** | [**string**] |  | defaults to undefined|
| **attachments** | **Array&lt;File&gt;** |  | defaults to undefined|
| **submissionNotes** | [**string**] |  | (optional) defaults to undefined|


### Return type

**StudentTaskSubmissionResponse**

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

