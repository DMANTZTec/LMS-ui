# StaffCourseControllerApi

All URIs are relative to *http://localhost:9090*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**assignInstructorsToCourse**](#assigninstructorstocourse) | **POST** /api/staff-course/assign | |
|[**getAllInstructors**](#getallinstructors) | **GET** /api/staff-course/instructors | |
|[**getCoursesByStaff**](#getcoursesbystaff) | **GET** /api/staff-course/staff/{staffId} | |
|[**getInstructorsByCourse**](#getinstructorsbycourse) | **GET** /api/staff-course/course/{courseId} | |
|[**removeInstructorFromCourse**](#removeinstructorfromcourse) | **DELETE** /api/staff-course/remove | |

# **assignInstructorsToCourse**
> string assignInstructorsToCourse(assignInstructorToCourseRequest)


### Example

```typescript
import {
    StaffCourseControllerApi,
    Configuration,
    AssignInstructorToCourseRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffCourseControllerApi(configuration);

let courseId: string; // (default to undefined)
let assignInstructorToCourseRequest: AssignInstructorToCourseRequest; //

const { status, data } = await apiInstance.assignInstructorsToCourse(
    courseId,
    assignInstructorToCourseRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **assignInstructorToCourseRequest** | **AssignInstructorToCourseRequest**|  | |
| **courseId** | [**string**] |  | defaults to undefined|


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

# **getAllInstructors**
> Array<InstructorResponse> getAllInstructors()


### Example

```typescript
import {
    StaffCourseControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffCourseControllerApi(configuration);

const { status, data } = await apiInstance.getAllInstructors();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<InstructorResponse>**

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

# **getCoursesByStaff**
> Array<StaffCourseResponse> getCoursesByStaff()


### Example

```typescript
import {
    StaffCourseControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffCourseControllerApi(configuration);

let staffId: string; // (default to undefined)

const { status, data } = await apiInstance.getCoursesByStaff(
    staffId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **staffId** | [**string**] |  | defaults to undefined|


### Return type

**Array<StaffCourseResponse>**

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

# **getInstructorsByCourse**
> Array<InstructorResponse> getInstructorsByCourse()


### Example

```typescript
import {
    StaffCourseControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffCourseControllerApi(configuration);

let courseId: string; // (default to undefined)

const { status, data } = await apiInstance.getInstructorsByCourse(
    courseId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **courseId** | [**string**] |  | defaults to undefined|


### Return type

**Array<InstructorResponse>**

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

# **removeInstructorFromCourse**
> string removeInstructorFromCourse()


### Example

```typescript
import {
    StaffCourseControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StaffCourseControllerApi(configuration);

let courseId: string; // (default to undefined)
let staffId: string; // (default to undefined)

const { status, data } = await apiInstance.removeInstructorFromCourse(
    courseId,
    staffId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **courseId** | [**string**] |  | defaults to undefined|
| **staffId** | [**string**] |  | defaults to undefined|


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

