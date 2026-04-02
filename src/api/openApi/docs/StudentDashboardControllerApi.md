# StudentDashboardControllerApi

All URIs are relative to *http://localhost:9090*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getChapterProgress**](#getchapterprogress) | **GET** /api/student-dashboard/{courseId}/chapters-progress | |
|[**getCourseProgress**](#getcourseprogress) | **GET** /api/student-dashboard/dashboard/course/{courseId}/progress | |
|[**getDashboardSummary**](#getdashboardsummary) | **GET** /api/student-dashboard/summary/{studentId} | |
|[**getMyClasses**](#getmyclasses) | **GET** /api/student-dashboard/classes/{studentId} | |
|[**getMyCourses**](#getmycourses) | **GET** /api/student-dashboard/my-coursesprogress | |
|[**getTopicProgress**](#gettopicprogress) | **GET** /api/student-dashboard/{courseId}/topics-progress | |
|[**getWeeklySchedule**](#getweeklyschedule) | **GET** /api/student-dashboard/weekly-schedule/{studentId} | |

# **getChapterProgress**
> Array<ChapterProgressResponse> getChapterProgress()


### Example

```typescript
import {
    StudentDashboardControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentDashboardControllerApi(configuration);

let courseId: string; // (default to undefined)
let studentId: string; // (default to undefined)

const { status, data } = await apiInstance.getChapterProgress(
    courseId,
    studentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **courseId** | [**string**] |  | defaults to undefined|
| **studentId** | [**string**] |  | defaults to undefined|


### Return type

**Array<ChapterProgressResponse>**

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

# **getCourseProgress**
> CourseProgressSummaryResponse getCourseProgress()


### Example

```typescript
import {
    StudentDashboardControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentDashboardControllerApi(configuration);

let courseId: string; // (default to undefined)
let studentId: string; // (default to undefined)

const { status, data } = await apiInstance.getCourseProgress(
    courseId,
    studentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **courseId** | [**string**] |  | defaults to undefined|
| **studentId** | [**string**] |  | defaults to undefined|


### Return type

**CourseProgressSummaryResponse**

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

# **getDashboardSummary**
> StudentDashboardSummaryResponse getDashboardSummary()


### Example

```typescript
import {
    StudentDashboardControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentDashboardControllerApi(configuration);

let studentId: string; // (default to undefined)

const { status, data } = await apiInstance.getDashboardSummary(
    studentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentId** | [**string**] |  | defaults to undefined|


### Return type

**StudentDashboardSummaryResponse**

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

# **getMyClasses**
> Array<StudentClassResponse> getMyClasses()


### Example

```typescript
import {
    StudentDashboardControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentDashboardControllerApi(configuration);

let studentId: string; // (default to undefined)

const { status, data } = await apiInstance.getMyClasses(
    studentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentId** | [**string**] |  | defaults to undefined|


### Return type

**Array<StudentClassResponse>**

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

# **getMyCourses**
> StudentMyCoursesResponse getMyCourses()


### Example

```typescript
import {
    StudentDashboardControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentDashboardControllerApi(configuration);

let studentId: string; // (default to undefined)
let status: 'PLANNED' | 'ONGOING' | 'COMPLETED'; // (optional) (default to undefined)

const { status, data } = await apiInstance.getMyCourses(
    studentId,
    status
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentId** | [**string**] |  | defaults to undefined|
| **status** | [**&#39;PLANNED&#39; | &#39;ONGOING&#39; | &#39;COMPLETED&#39;**]**Array<&#39;PLANNED&#39; &#124; &#39;ONGOING&#39; &#124; &#39;COMPLETED&#39;>** |  | (optional) defaults to undefined|


### Return type

**StudentMyCoursesResponse**

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

# **getTopicProgress**
> Array<TopicProgressResponse> getTopicProgress()


### Example

```typescript
import {
    StudentDashboardControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentDashboardControllerApi(configuration);

let courseId: string; // (default to undefined)
let studentId: string; // (default to undefined)

const { status, data } = await apiInstance.getTopicProgress(
    courseId,
    studentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **courseId** | [**string**] |  | defaults to undefined|
| **studentId** | [**string**] |  | defaults to undefined|


### Return type

**Array<TopicProgressResponse>**

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

# **getWeeklySchedule**
> WeeklyScheduleResponse getWeeklySchedule()


### Example

```typescript
import {
    StudentDashboardControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentDashboardControllerApi(configuration);

let studentId: string; // (default to undefined)

const { status, data } = await apiInstance.getWeeklySchedule(
    studentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentId** | [**string**] |  | defaults to undefined|


### Return type

**WeeklyScheduleResponse**

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

