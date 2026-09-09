# InstructorDashboardControllerApi

All URIs are relative to *http://localhost:9090/lms*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createTask**](#createtask) | **POST** /api/instructor/tasks | |
|[**getBatchSummary**](#getbatchsummary) | **GET** /api/instructor/batches | |
|[**getClassStats**](#getclassstats) | **GET** /api/instructor/class-stats | |
|[**getMyCourseSummaries**](#getmycoursesummaries) | **GET** /api/instructor/coursesSummaries | |
|[**getMyCourses1**](#getmycourses1) | **GET** /api/instructor/courses | |
|[**getPendingReviews**](#getpendingreviews) | **GET** /api/instructor/pending-reviews | |
|[**getPlannedTopics**](#getplannedtopics) | **GET** /api/instructor/schedule/{scheduleId}/topics | |
|[**getStudentStats**](#getstudentstats) | **GET** /api/instructor/student-stats | |
|[**getTaskSubmissions**](#gettasksubmissions) | **GET** /api/instructor/submissions | |
|[**planClassTopics**](#planclasstopics) | **PUT** /api/instructor/schedule/{scheduleId}/topics | |

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

# **getMyCourseSummaries**
> Array<InstructorCourseSummaryResponse> getMyCourseSummaries()


### Example

```typescript
import {
    InstructorDashboardControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InstructorDashboardControllerApi(configuration);

let instructorId: string; // (default to undefined)

const { status, data } = await apiInstance.getMyCourseSummaries(
    instructorId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **instructorId** | [**string**] |  | defaults to undefined|


### Return type

**Array<InstructorCourseSummaryResponse>**

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

# **getPendingReviews**
> Array<StudentTaskSubmissionResponse> getPendingReviews()


### Example

```typescript
import {
    InstructorDashboardControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InstructorDashboardControllerApi(configuration);

let instructorId: string; // (default to undefined)

const { status, data } = await apiInstance.getPendingReviews(
    instructorId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **instructorId** | [**string**] |  | defaults to undefined|


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

# **getPlannedTopics**
> Array<ClassTopicResponse> getPlannedTopics()


### Example

```typescript
import {
    InstructorDashboardControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InstructorDashboardControllerApi(configuration);

let scheduleId: number; // (default to undefined)
let staffId: string; // (default to undefined)

const { status, data } = await apiInstance.getPlannedTopics(
    scheduleId,
    staffId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **scheduleId** | [**number**] |  | defaults to undefined|
| **staffId** | [**string**] |  | defaults to undefined|


### Return type

**Array<ClassTopicResponse>**

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

let instructorId: string; // (default to undefined)
let filter: 'ALL_SUBMISSIONS' | 'ASSIGNED_BY_ME'; // (optional) (default to 'ALL')

const { status, data } = await apiInstance.getTaskSubmissions(
    instructorId,
    filter
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **instructorId** | [**string**] |  | defaults to undefined|
| **filter** | [**&#39;ALL_SUBMISSIONS&#39; | &#39;ASSIGNED_BY_ME&#39;**]**Array<&#39;ALL_SUBMISSIONS&#39; &#124; &#39;ASSIGNED_BY_ME&#39;>** |  | (optional) defaults to 'ALL'|


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

# **planClassTopics**
> Array<ClassTopicResponse> planClassTopics(planClassTopicsRequest)


### Example

```typescript
import {
    InstructorDashboardControllerApi,
    Configuration,
    PlanClassTopicsRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new InstructorDashboardControllerApi(configuration);

let scheduleId: number; // (default to undefined)
let planClassTopicsRequest: PlanClassTopicsRequest; //

const { status, data } = await apiInstance.planClassTopics(
    scheduleId,
    planClassTopicsRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **planClassTopicsRequest** | **PlanClassTopicsRequest**|  | |
| **scheduleId** | [**number**] |  | defaults to undefined|


### Return type

**Array<ClassTopicResponse>**

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

