# InstructorAttendanceControllerApi

All URIs are relative to *{VITE_API_URL}*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getScheduleAttendance**](#getscheduleattendance) | **GET** /api/instructor/schedules/{scheduleId}/attendance | |
|[**markAttendancePost**](#markattendancepost) | **POST** /api/instructor/schedules/{scheduleId}/attendance/mark | |
|[**markAttendancePut**](#markattendanceput) | **PUT** /api/instructor/schedules/{scheduleId}/attendance/mark | |

# **getScheduleAttendance**
> ScheduleAttendanceResponse getScheduleAttendance()


### Example

```typescript
import {
    InstructorAttendanceControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InstructorAttendanceControllerApi(configuration);

let scheduleId: number; // (default to undefined)

const { status, data } = await apiInstance.getScheduleAttendance(
    scheduleId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **scheduleId** | [**number**] |  | defaults to undefined|


### Return type

**ScheduleAttendanceResponse**

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

# **markAttendancePost**
> MarkAttendanceResponse markAttendancePost(markAttendanceRequest)


### Example

```typescript
import {
    InstructorAttendanceControllerApi,
    Configuration,
    MarkAttendanceRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new InstructorAttendanceControllerApi(configuration);

let scheduleId: number; // (default to undefined)
let markAttendanceRequest: MarkAttendanceRequest; //

const { status, data } = await apiInstance.markAttendancePost(
    scheduleId,
    markAttendanceRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **markAttendanceRequest** | **MarkAttendanceRequest**|  | |
| **scheduleId** | [**number**] |  | defaults to undefined|


### Return type

**MarkAttendanceResponse**

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

# **markAttendancePut**
> MarkAttendanceResponse markAttendancePut(markAttendanceRequest)


### Example

```typescript
import {
    InstructorAttendanceControllerApi,
    Configuration,
    MarkAttendanceRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new InstructorAttendanceControllerApi(configuration);

let scheduleId: number; // (default to undefined)
let markAttendanceRequest: MarkAttendanceRequest; //

const { status, data } = await apiInstance.markAttendancePut(
    scheduleId,
    markAttendanceRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **markAttendanceRequest** | **MarkAttendanceRequest**|  | |
| **scheduleId** | [**number**] |  | defaults to undefined|


### Return type

**MarkAttendanceResponse**

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

