# StudentTaskControllerApi

All URIs are relative to *http://localhost:9090*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addStudentTask**](#addstudenttask) | **POST** /api/student-task/addtask | |
|[**markNeedHelp**](#markneedhelp) | **PATCH** /api/student-task/need-help | |

# **addStudentTask**
> StudentTaskResponse addStudentTask(studentTaskRequest)


### Example

```typescript
import {
    StudentTaskControllerApi,
    Configuration,
    StudentTaskRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentTaskControllerApi(configuration);

let studentTaskRequest: StudentTaskRequest; //

const { status, data } = await apiInstance.addStudentTask(
    studentTaskRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentTaskRequest** | **StudentTaskRequest**|  | |


### Return type

**StudentTaskResponse**

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

# **markNeedHelp**
> StudentTaskResponse markNeedHelp(studentNeedHelpRequest)


### Example

```typescript
import {
    StudentTaskControllerApi,
    Configuration,
    StudentNeedHelpRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentTaskControllerApi(configuration);

let studentNeedHelpRequest: StudentNeedHelpRequest; //

const { status, data } = await apiInstance.markNeedHelp(
    studentNeedHelpRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentNeedHelpRequest** | **StudentNeedHelpRequest**|  | |


### Return type

**StudentTaskResponse**

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

