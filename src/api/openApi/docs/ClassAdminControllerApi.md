# ClassAdminControllerApi

All URIs are relative to *http://localhost:9090*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addClass**](#addclass) | **POST** /api/admin/courses/{courseId}/classes | |
|[**addScheduleToClass**](#addscheduletoclass) | **POST** /api/admin/addschedule-to-class | |
|[**addTopicsToClass**](#addtopicstoclass) | **POST** /api/admin/classes/{batchId}/topics | |
|[**assignCourseToStudent**](#assigncoursetostudent) | **POST** /api/admin/students/{studentId}/courses | |
|[**cancelClass**](#cancelclass) | **PATCH** /api/admin/courses/classes/{batchId}/cancel | |
|[**cancelSchedule**](#cancelschedule) | **PATCH** /api/admin/schedules/{scheduleId}/cancel | |
|[**getSchedulesByStaff**](#getschedulesbystaff) | **GET** /api/admin/schedules/staff/{staffId} | |
|[**getStaffDailySchedule**](#getstaffdailyschedule) | **GET** /api/admin/staff/{staffId}/dailySchedules | |
|[**getStudentDetails**](#getstudentdetails) | **GET** /api/admin/student-details/{studentId} | |
|[**getTopicsByBatchId**](#gettopicsbybatchid) | **GET** /api/admin/classes/{batchId}/topics | |
|[**modifyClass**](#modifyclass) | **PUT** /api/admin/courses/classes/{batchId} | |
|[**modifySchedule**](#modifyschedule) | **PUT** /api/admin/schedules/{scheduleId} | |
|[**removeTopicsFromClass**](#removetopicsfromclass) | **DELETE** /api/admin/classes/{batchId}/topics | |
|[**viewStudents**](#viewstudents) | **GET** /api/admin/view-students | |

# **addClass**
> ClassResponse addClass(createClassRequest)


### Example

```typescript
import {
    ClassAdminControllerApi,
    Configuration,
    CreateClassRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassAdminControllerApi(configuration);

let courseId: string; // (default to undefined)
let createClassRequest: CreateClassRequest; //

const { status, data } = await apiInstance.addClass(
    courseId,
    createClassRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createClassRequest** | **CreateClassRequest**|  | |
| **courseId** | [**string**] |  | defaults to undefined|


### Return type

**ClassResponse**

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

# **addScheduleToClass**
> ClassScheduleResponse addScheduleToClass(classScheduleRequest)


### Example

```typescript
import {
    ClassAdminControllerApi,
    Configuration,
    ClassScheduleRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassAdminControllerApi(configuration);

let classScheduleRequest: ClassScheduleRequest; //

const { status, data } = await apiInstance.addScheduleToClass(
    classScheduleRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **classScheduleRequest** | **ClassScheduleRequest**|  | |


### Return type

**ClassScheduleResponse**

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

# **addTopicsToClass**
> string addTopicsToClass(addClassTopicRequest)


### Example

```typescript
import {
    ClassAdminControllerApi,
    Configuration,
    AddClassTopicRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassAdminControllerApi(configuration);

let batchId: number; // (default to undefined)
let addClassTopicRequest: AddClassTopicRequest; //

const { status, data } = await apiInstance.addTopicsToClass(
    batchId,
    addClassTopicRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **addClassTopicRequest** | **AddClassTopicRequest**|  | |
| **batchId** | [**number**] |  | defaults to undefined|


### Return type

**string**

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

# **assignCourseToStudent**
> StudentCourseResponse assignCourseToStudent(assignCourseRequest)


### Example

```typescript
import {
    ClassAdminControllerApi,
    Configuration,
    AssignCourseRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassAdminControllerApi(configuration);

let studentId: string; // (default to undefined)
let assignCourseRequest: AssignCourseRequest; //

const { status, data } = await apiInstance.assignCourseToStudent(
    studentId,
    assignCourseRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **assignCourseRequest** | **AssignCourseRequest**|  | |
| **studentId** | [**string**] |  | defaults to undefined|


### Return type

**StudentCourseResponse**

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

# **cancelClass**
> ClassResponse cancelClass()


### Example

```typescript
import {
    ClassAdminControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassAdminControllerApi(configuration);

let batchId: number; // (default to undefined)

const { status, data } = await apiInstance.cancelClass(
    batchId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **batchId** | [**number**] |  | defaults to undefined|


### Return type

**ClassResponse**

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

# **cancelSchedule**
> ClassScheduleResponse cancelSchedule()


### Example

```typescript
import {
    ClassAdminControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassAdminControllerApi(configuration);

let scheduleId: number; // (default to undefined)

const { status, data } = await apiInstance.cancelSchedule(
    scheduleId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **scheduleId** | [**number**] |  | defaults to undefined|


### Return type

**ClassScheduleResponse**

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

# **getSchedulesByStaff**
> Array<ClassScheduleResponse> getSchedulesByStaff()


### Example

```typescript
import {
    ClassAdminControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassAdminControllerApi(configuration);

let staffId: string; // (default to undefined)

const { status, data } = await apiInstance.getSchedulesByStaff(
    staffId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **staffId** | [**string**] |  | defaults to undefined|


### Return type

**Array<ClassScheduleResponse>**

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

# **getStaffDailySchedule**
> Array<ClassScheduleResponse> getStaffDailySchedule()


### Example

```typescript
import {
    ClassAdminControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassAdminControllerApi(configuration);

let staffId: string; // (default to undefined)
let date: string; // (default to undefined)

const { status, data } = await apiInstance.getStaffDailySchedule(
    staffId,
    date
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **staffId** | [**string**] |  | defaults to undefined|
| **date** | [**string**] |  | defaults to undefined|


### Return type

**Array<ClassScheduleResponse>**

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

# **getStudentDetails**
> ClassAdminStudentDetailsResponse getStudentDetails()


### Example

```typescript
import {
    ClassAdminControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassAdminControllerApi(configuration);

let studentId: string; // (default to undefined)

const { status, data } = await apiInstance.getStudentDetails(
    studentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentId** | [**string**] |  | defaults to undefined|


### Return type

**ClassAdminStudentDetailsResponse**

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

# **getTopicsByBatchId**
> Array<ClassTopicResponse> getTopicsByBatchId()


### Example

```typescript
import {
    ClassAdminControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassAdminControllerApi(configuration);

let batchId: number; // (default to undefined)

const { status, data } = await apiInstance.getTopicsByBatchId(
    batchId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **batchId** | [**number**] |  | defaults to undefined|


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

# **modifyClass**
> ClassResponse modifyClass(updateClassRequest)


### Example

```typescript
import {
    ClassAdminControllerApi,
    Configuration,
    UpdateClassRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassAdminControllerApi(configuration);

let batchId: number; // (default to undefined)
let updateClassRequest: UpdateClassRequest; //

const { status, data } = await apiInstance.modifyClass(
    batchId,
    updateClassRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateClassRequest** | **UpdateClassRequest**|  | |
| **batchId** | [**number**] |  | defaults to undefined|


### Return type

**ClassResponse**

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

# **modifySchedule**
> ClassScheduleResponse modifySchedule(classScheduleRequest)


### Example

```typescript
import {
    ClassAdminControllerApi,
    Configuration,
    ClassScheduleRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassAdminControllerApi(configuration);

let scheduleId: number; // (default to undefined)
let classScheduleRequest: ClassScheduleRequest; //

const { status, data } = await apiInstance.modifySchedule(
    scheduleId,
    classScheduleRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **classScheduleRequest** | **ClassScheduleRequest**|  | |
| **scheduleId** | [**number**] |  | defaults to undefined|


### Return type

**ClassScheduleResponse**

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

# **removeTopicsFromClass**
> string removeTopicsFromClass(removeClassTopicRequest)


### Example

```typescript
import {
    ClassAdminControllerApi,
    Configuration,
    RemoveClassTopicRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassAdminControllerApi(configuration);

let batchId: number; // (default to undefined)
let removeClassTopicRequest: RemoveClassTopicRequest; //

const { status, data } = await apiInstance.removeTopicsFromClass(
    batchId,
    removeClassTopicRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **removeClassTopicRequest** | **RemoveClassTopicRequest**|  | |
| **batchId** | [**number**] |  | defaults to undefined|


### Return type

**string**

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

# **viewStudents**
> Array<ClassAdminStudentDetailsResponse> viewStudents()


### Example

```typescript
import {
    ClassAdminControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassAdminControllerApi(configuration);

const { status, data } = await apiInstance.viewStudents();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<ClassAdminStudentDetailsResponse>**

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

