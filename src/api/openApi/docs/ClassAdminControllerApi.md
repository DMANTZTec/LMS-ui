# ClassAdminControllerApi

All URIs are relative to *http://localhost:9090*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addClass**](#addclass) | **POST** /api/admin/courseschedule/{courseId}/classes | |
|[**addInstructorsToBatch**](#addinstructorstobatch) | **POST** /api/admin/courseschedule/classes/{batchId}/instructors | |
|[**addScheduleToClass**](#addscheduletoclass) | **POST** /api/admin/addschedule-to-class | |
|[**addTopicsToClass**](#addtopicstoclass) | **POST** /api/admin/classes/{batchId}/topics | |
|[**assignCourseToStudent**](#assigncoursetostudent) | **POST** /api/admin/students/{studentId}/courses | |
|[**assignInstructor**](#assigninstructor) | **POST** /api/admin/{scheduleId}/assign-instructor | |
|[**cancelClass**](#cancelclass) | **PATCH** /api/admin/courseschedule/classes/{batchId}/cancel | |
|[**cancelSchedule**](#cancelschedule) | **PATCH** /api/admin/schedules/{scheduleId}/cancel | |
|[**getAllSchedules**](#getallschedules) | **GET** /api/admin/schedules | |
|[**getBatchById**](#getbatchbyid) | **GET** /api/admin/courseschedule/classes/{batchId} | |
|[**getClassesByCourse**](#getclassesbycourse) | **GET** /api/admin/courseschedule/{courseId}/classes | |
|[**getInstructorsByBatchId**](#getinstructorsbybatchid) | **GET** /api/admin/courseschedule/classes/{batchId}/instructors | |
|[**getScheduleById**](#getschedulebyid) | **GET** /api/admin/schedules/{scheduleId} | |
|[**getSchedulesByBatch**](#getschedulesbybatch) | **GET** /api/admin/courseschedule/{batchId}/schedules | |
|[**getSchedulesByStaff**](#getschedulesbystaff) | **GET** /api/admin/schedules/staff/{staffId} | |
|[**getStaffDailySchedule**](#getstaffdailyschedule) | **GET** /api/admin/staff/{staffId}/dailySchedules | |
|[**getStudentDetails**](#getstudentdetails) | **GET** /api/admin/student-details/{studentId} | |
|[**getTopicsByBatchId**](#gettopicsbybatchid) | **GET** /api/admin/classes/{batchId}/topics | |
|[**modifyClass**](#modifyclass) | **PUT** /api/admin/modify/courseschedule/classes/{batchId} | |
|[**modifySchedule**](#modifyschedule) | **PUT** /api/admin/courseschedule/{scheduleId} | |
|[**removeTopicsFromClass**](#removetopicsfromclass) | **DELETE** /api/admin/classes/{batchId}/topics | |
|[**updateInstructorsForBatch**](#updateinstructorsforbatch) | **PUT** /api/admin/courseschedule/classes/{batchId}/instructors | |
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

# **addInstructorsToBatch**
> Array<BatchInstructorResponse> addInstructorsToBatch(batchInstructorRequest)


### Example

```typescript
import {
    ClassAdminControllerApi,
    Configuration,
    BatchInstructorRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassAdminControllerApi(configuration);

let batchId: number; // (default to undefined)
let batchInstructorRequest: BatchInstructorRequest; //

const { status, data } = await apiInstance.addInstructorsToBatch(
    batchId,
    batchInstructorRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **batchInstructorRequest** | **BatchInstructorRequest**|  | |
| **batchId** | [**number**] |  | defaults to undefined|


### Return type

**Array<BatchInstructorResponse>**

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
> ClassScheduleResponse addScheduleToClass(addScheduleRequest)


### Example

```typescript
import {
    ClassAdminControllerApi,
    Configuration,
    AddScheduleRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassAdminControllerApi(configuration);

let addScheduleRequest: AddScheduleRequest; //

const { status, data } = await apiInstance.addScheduleToClass(
    addScheduleRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **addScheduleRequest** | **AddScheduleRequest**|  | |


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

# **assignInstructor**
> string assignInstructor(assignInstructorRequest)


### Example

```typescript
import {
    ClassAdminControllerApi,
    Configuration,
    AssignInstructorRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassAdminControllerApi(configuration);

let scheduleId: number; // (default to undefined)
let assignInstructorRequest: AssignInstructorRequest; //

const { status, data } = await apiInstance.assignInstructor(
    scheduleId,
    assignInstructorRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **assignInstructorRequest** | **AssignInstructorRequest**|  | |
| **scheduleId** | [**number**] |  | defaults to undefined|


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

# **getAllSchedules**
> Array<ClassScheduleResponse> getAllSchedules()


### Example

```typescript
import {
    ClassAdminControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassAdminControllerApi(configuration);

const { status, data } = await apiInstance.getAllSchedules();
```

### Parameters
This endpoint does not have any parameters.


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

# **getBatchById**
> ClassResponse getBatchById()


### Example

```typescript
import {
    ClassAdminControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassAdminControllerApi(configuration);

let batchId: number; // (default to undefined)

const { status, data } = await apiInstance.getBatchById(
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

# **getClassesByCourse**
> Array<ClassResponse> getClassesByCourse()


### Example

```typescript
import {
    ClassAdminControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassAdminControllerApi(configuration);

let courseId: string; // (default to undefined)

const { status, data } = await apiInstance.getClassesByCourse(
    courseId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **courseId** | [**string**] |  | defaults to undefined|


### Return type

**Array<ClassResponse>**

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

# **getInstructorsByBatchId**
> Array<BatchInstructorResponse> getInstructorsByBatchId()


### Example

```typescript
import {
    ClassAdminControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassAdminControllerApi(configuration);

let batchId: number; // (default to undefined)

const { status, data } = await apiInstance.getInstructorsByBatchId(
    batchId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **batchId** | [**number**] |  | defaults to undefined|


### Return type

**Array<BatchInstructorResponse>**

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

# **getScheduleById**
> ClassScheduleResponse getScheduleById()


### Example

```typescript
import {
    ClassAdminControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassAdminControllerApi(configuration);

let scheduleId: number; // (default to undefined)

const { status, data } = await apiInstance.getScheduleById(
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

# **getSchedulesByBatch**
> Array<ClassScheduleResponse> getSchedulesByBatch()


### Example

```typescript
import {
    ClassAdminControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassAdminControllerApi(configuration);

let batchId: number; // (default to undefined)

const { status, data } = await apiInstance.getSchedulesByBatch(
    batchId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **batchId** | [**number**] |  | defaults to undefined|


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
> ClassScheduleResponse modifySchedule(addScheduleRequest)


### Example

```typescript
import {
    ClassAdminControllerApi,
    Configuration,
    AddScheduleRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassAdminControllerApi(configuration);

let scheduleId: number; // (default to undefined)
let addScheduleRequest: AddScheduleRequest; //

const { status, data } = await apiInstance.modifySchedule(
    scheduleId,
    addScheduleRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **addScheduleRequest** | **AddScheduleRequest**|  | |
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

# **updateInstructorsForBatch**
> Array<BatchInstructorResponse> updateInstructorsForBatch(batchInstructorRequest)


### Example

```typescript
import {
    ClassAdminControllerApi,
    Configuration,
    BatchInstructorRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassAdminControllerApi(configuration);

let batchId: number; // (default to undefined)
let batchInstructorRequest: BatchInstructorRequest; //

const { status, data } = await apiInstance.updateInstructorsForBatch(
    batchId,
    batchInstructorRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **batchInstructorRequest** | **BatchInstructorRequest**|  | |
| **batchId** | [**number**] |  | defaults to undefined|


### Return type

**Array<BatchInstructorResponse>**

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

