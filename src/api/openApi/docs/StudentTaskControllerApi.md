# StudentTaskControllerApi

All URIs are relative to *http://localhost:9090*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addStudentTask**](#addstudenttask) | **POST** /api/student-task/addtask | |
|[**deleteTask**](#deletetask) | **DELETE** /api/student-task/deletetask | |
|[**getHoursSpent**](#gethoursspent) | **GET** /api/student-task/hours-spent/{studentId} | |
|[**getStudentTasks**](#getstudenttasks) | **GET** /api/student-task | |
|[**markNeedHelp**](#markneedhelp) | **PATCH** /api/student-task/need-help | |
|[**markTaskCompleted**](#marktaskcompleted) | **PATCH** /api/student-task/{taskId}/complete | |
|[**updateStudentTask**](#updatestudenttask) | **PUT** /api/student-task/updatetask | |

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

# **deleteTask**
> string deleteTask()


### Example

```typescript
import {
    StudentTaskControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentTaskControllerApi(configuration);

let studentId: string; // (default to undefined)
let topicId: number; // (default to undefined)

const { status, data } = await apiInstance.deleteTask(
    studentId,
    topicId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentId** | [**string**] |  | defaults to undefined|
| **topicId** | [**number**] |  | defaults to undefined|


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

# **getHoursSpent**
> HoursSpentResponse getHoursSpent()


### Example

```typescript
import {
    StudentTaskControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentTaskControllerApi(configuration);

let studentId: string; // (default to undefined)

const { status, data } = await apiInstance.getHoursSpent(
    studentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentId** | [**string**] |  | defaults to undefined|


### Return type

**HoursSpentResponse**

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

# **getStudentTasks**
> StudentTaskListResponse getStudentTasks()


### Example

```typescript
import {
    StudentTaskControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentTaskControllerApi(configuration);

let studentId: string; // (default to undefined)
let status: 'ACTIVE' | 'COMPLETED'; // (optional) (default to undefined)

const { status, data } = await apiInstance.getStudentTasks(
    studentId,
    status
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentId** | [**string**] |  | defaults to undefined|
| **status** | [**&#39;ACTIVE&#39; | &#39;COMPLETED&#39;**]**Array<&#39;ACTIVE&#39; &#124; &#39;COMPLETED&#39;>** |  | (optional) defaults to undefined|


### Return type

**StudentTaskListResponse**

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

# **markTaskCompleted**
> StudentTaskResponse markTaskCompleted()


### Example

```typescript
import {
    StudentTaskControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentTaskControllerApi(configuration);

let taskId: number; // (default to undefined)
let studentId: string; // (default to undefined)

const { status, data } = await apiInstance.markTaskCompleted(
    taskId,
    studentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **taskId** | [**number**] |  | defaults to undefined|
| **studentId** | [**string**] |  | defaults to undefined|


### Return type

**StudentTaskResponse**

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

# **updateStudentTask**
> StudentTaskResponse updateStudentTask(studentTaskUpdateRequest)


### Example

```typescript
import {
    StudentTaskControllerApi,
    Configuration,
    StudentTaskUpdateRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentTaskControllerApi(configuration);

let studentTaskUpdateRequest: StudentTaskUpdateRequest; //

const { status, data } = await apiInstance.updateStudentTask(
    studentTaskUpdateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentTaskUpdateRequest** | **StudentTaskUpdateRequest**|  | |


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

