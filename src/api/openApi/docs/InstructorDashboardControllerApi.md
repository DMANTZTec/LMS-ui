# InstructorDashboardControllerApi

All URIs are relative to *http://localhost:9090/lms*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createTask**](#createtask) | **POST** /api/instructor/tasks | |
|[**getBatchSummary**](#getbatchsummary) | **GET** /api/instructor/batches | |
|[**getClassStats**](#getclassstats) | **GET** /api/instructor/class-stats | |
|[**getMyCourses1**](#getmycourses1) | **GET** /api/instructor/courses | |
|[**getStudentStats**](#getstudentstats) | **GET** /api/instructor/student-stats | |
|[**getTaskSubmissions**](#gettasksubmissions) | **GET** /api/instructor/submissions | |

# **createTask**
> InstructorTaskResponse createTask(instructorTaskRequest)


### Example

```typescript
import {
    InstructorDashboardControllerApi,
    Configuration,
    InstructorTaskRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new InstructorDashboardControllerApi(configuration);

let instructorTaskRequest: InstructorTaskRequest; //

const { status, data } = await apiInstance.createTask(
    instructorTaskRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **instructorTaskRequest** | **InstructorTaskRequest**|  | |


### Return type

**InstructorTaskResponse**

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

# **getBatchSummary**
> InstructorBatchSummaryResponse getBatchSummary()


### Example

```typescript
import {
    InstructorDashboardControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InstructorDashboardControllerApi(configuration);

let instructorId: string; // (default to undefined)

const { status, data } = await apiInstance.getBatchSummary(
    instructorId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **instructorId** | [**string**] |  | defaults to undefined|


### Return type

**InstructorBatchSummaryResponse**

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

# **getClassStats**
> InstructorClassStatsResponse getClassStats()


### Example

```typescript
import {
    InstructorDashboardControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InstructorDashboardControllerApi(configuration);

let instructorId: string; // (default to undefined)

const { status, data } = await apiInstance.getClassStats(
    instructorId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **instructorId** | [**string**] |  | defaults to undefined|


### Return type

**InstructorClassStatsResponse**

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

# **getMyCourses1**
> Array<InstructorCourseResponse> getMyCourses1()


### Example

```typescript
import {
    InstructorDashboardControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InstructorDashboardControllerApi(configuration);

let instructorId: string; // (default to undefined)

const { status, data } = await apiInstance.getMyCourses1(
    instructorId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **instructorId** | [**string**] |  | defaults to undefined|


### Return type

**Array<InstructorCourseResponse>**

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

# **getStudentStats**
> InstructorStudentStatsResponse getStudentStats()


### Example

```typescript
import {
    InstructorDashboardControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InstructorDashboardControllerApi(configuration);

let instructorId: string; // (default to undefined)

const { status, data } = await apiInstance.getStudentStats(
    instructorId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **instructorId** | [**string**] |  | defaults to undefined|


### Return type

**InstructorStudentStatsResponse**

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

# **getTaskSubmissions**
> Array<StudentTaskSubmissionResponse> getTaskSubmissions()


### Example

```typescript
import {
    InstructorDashboardControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InstructorDashboardControllerApi(configuration);

let staffId: string; // (default to undefined)

const { status, data } = await apiInstance.getTaskSubmissions(
    staffId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **staffId** | [**string**] |  | defaults to undefined|


### Return type

**Array<StudentTaskSubmissionResponse>**

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

