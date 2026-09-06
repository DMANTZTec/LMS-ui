# EnrollmentBatchControllerApi

All URIs are relative to *http://localhost:9090/lms*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**assignStudentToBatch**](#assignstudenttobatch) | **POST** /api/enrollment-batches/assign | |
|[**getEnrolledBatchesByStudentId**](#getenrolledbatchesbystudentid) | **GET** /api/enrollment-batches/students/{studentId}/batches | |
|[**getEnrollmentBatch**](#getenrollmentbatch) | **GET** /api/enrollment-batches/{id} | |
|[**getStudentWeeklySchedule**](#getstudentweeklyschedule) | **GET** /api/enrollment-batches/students/{studentId}/weekly-schedule | |
|[**getStudentsByBatch**](#getstudentsbybatch) | **GET** /api/enrollment-batches/batches/{batchId}/students | |
|[**removeStudentFromBatch**](#removestudentfrombatch) | **DELETE** /api/enrollment-batches/{id} | |

# **assignStudentToBatch**
> EnrollmentBatchResponse assignStudentToBatch(assignStudentToBatchRequest)


### Example

```typescript
import {
    EnrollmentBatchControllerApi,
    Configuration,
    AssignStudentToBatchRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new EnrollmentBatchControllerApi(configuration);

let assignStudentToBatchRequest: AssignStudentToBatchRequest; //

const { status, data } = await apiInstance.assignStudentToBatch(
    assignStudentToBatchRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **assignStudentToBatchRequest** | **AssignStudentToBatchRequest**|  | |


### Return type

**EnrollmentBatchResponse**

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

# **getEnrolledBatchesByStudentId**
> Array<EnrollmentBatchResponse> getEnrolledBatchesByStudentId()


### Example

```typescript
import {
    EnrollmentBatchControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EnrollmentBatchControllerApi(configuration);

let studentId: string; // (default to undefined)

const { status, data } = await apiInstance.getEnrolledBatchesByStudentId(
    studentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentId** | [**string**] |  | defaults to undefined|


### Return type

**Array<EnrollmentBatchResponse>**

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

# **getEnrollmentBatch**
> EnrollmentBatchResponse getEnrollmentBatch()


### Example

```typescript
import {
    EnrollmentBatchControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EnrollmentBatchControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getEnrollmentBatch(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**EnrollmentBatchResponse**

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

# **getStudentWeeklySchedule**
> Array<DailyScheduleResponse> getStudentWeeklySchedule()


### Example

```typescript
import {
    EnrollmentBatchControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EnrollmentBatchControllerApi(configuration);

let studentId: string; // (default to undefined)

const { status, data } = await apiInstance.getStudentWeeklySchedule(
    studentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentId** | [**string**] |  | defaults to undefined|


### Return type

**Array<DailyScheduleResponse>**

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

# **getStudentsByBatch**
> Array<EnrollmentBatchResponse> getStudentsByBatch()


### Example

```typescript
import {
    EnrollmentBatchControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EnrollmentBatchControllerApi(configuration);

let batchId: number; // (default to undefined)

const { status, data } = await apiInstance.getStudentsByBatch(
    batchId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **batchId** | [**number**] |  | defaults to undefined|


### Return type

**Array<EnrollmentBatchResponse>**

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

# **removeStudentFromBatch**
> removeStudentFromBatch()


### Example

```typescript
import {
    EnrollmentBatchControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EnrollmentBatchControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.removeStudentFromBatch(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

