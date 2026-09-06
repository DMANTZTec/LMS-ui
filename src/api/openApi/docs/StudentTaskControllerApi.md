# StudentTaskControllerApi

All URIs are relative to *http://localhost:9090/lms*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addStudentTask**](#addstudenttask) | **POST** /api/student-task/addtask | |
|[**getChaptersByCourse**](#getchaptersbycourse) | **GET** /api/student-task/dropdown/chapters | |
|[**getEnrolledCourses**](#getenrolledcourses) | **GET** /api/student-task/dropdown/courses | |
|[**getTasksByStatus**](#gettasksbystatus) | **GET** /api/student-task/status | |
|[**getTopicsByChapter**](#gettopicsbychapter) | **GET** /api/student-task/dropdown/topics | |

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

# **getChaptersByCourse**
> Array<ChapterDropdownResponse> getChaptersByCourse()


### Example

```typescript
import {
    StudentTaskControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentTaskControllerApi(configuration);

let courseId: string; // (default to undefined)

const { status, data } = await apiInstance.getChaptersByCourse(
    courseId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **courseId** | [**string**] |  | defaults to undefined|


### Return type

**Array<ChapterDropdownResponse>**

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

# **getEnrolledCourses**
> Array<CourseDropdownResponse> getEnrolledCourses()


### Example

```typescript
import {
    StudentTaskControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentTaskControllerApi(configuration);

let studentId: string; // (default to undefined)

const { status, data } = await apiInstance.getEnrolledCourses(
    studentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentId** | [**string**] |  | defaults to undefined|


### Return type

**Array<CourseDropdownResponse>**

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

# **getTasksByStatus**
> StudentTaskListResponse getTasksByStatus()


### Example

```typescript
import {
    StudentTaskControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentTaskControllerApi(configuration);

let studentId: string; // (default to undefined)
let status: 'ACTIVE' | 'COMPLETED'; // (default to undefined)

const { status, data } = await apiInstance.getTasksByStatus(
    studentId,
    status
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentId** | [**string**] |  | defaults to undefined|
| **status** | [**&#39;ACTIVE&#39; | &#39;COMPLETED&#39;**]**Array<&#39;ACTIVE&#39; &#124; &#39;COMPLETED&#39;>** |  | defaults to undefined|


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

# **getTopicsByChapter**
> Array<TopicDropdownResponse> getTopicsByChapter()


### Example

```typescript
import {
    StudentTaskControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentTaskControllerApi(configuration);

let chapterId: number; // (default to undefined)

const { status, data } = await apiInstance.getTopicsByChapter(
    chapterId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **chapterId** | [**number**] |  | defaults to undefined|


### Return type

**Array<TopicDropdownResponse>**

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

