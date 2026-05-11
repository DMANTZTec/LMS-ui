# StudentTaskMentorControllerApi

All URIs are relative to *http://localhost:9090*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**acknowledgeMentorHelp**](#acknowledgementorhelp) | **PUT** /api/student-task-mentor/{id}/acknowledge | |
|[**createMentoringActivity**](#creatementoringactivity) | **POST** /api/student-task-mentor | |
|[**updateMentoringMinutes**](#updatementoringminutes) | **PUT** /api/student-task-mentor/{id} | |

# **acknowledgeMentorHelp**
> StudentTaskMentorResponse acknowledgeMentorHelp(acknowledgeMentorRequest)


### Example

```typescript
import {
    StudentTaskMentorControllerApi,
    Configuration,
    AcknowledgeMentorRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentTaskMentorControllerApi(configuration);

let id: number; // (default to undefined)
let acknowledgeMentorRequest: AcknowledgeMentorRequest; //

const { status, data } = await apiInstance.acknowledgeMentorHelp(
    id,
    acknowledgeMentorRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **acknowledgeMentorRequest** | **AcknowledgeMentorRequest**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**StudentTaskMentorResponse**

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

# **createMentoringActivity**
> StudentTaskMentorResponse createMentoringActivity(studentTaskMentorRequest)


### Example

```typescript
import {
    StudentTaskMentorControllerApi,
    Configuration,
    StudentTaskMentorRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentTaskMentorControllerApi(configuration);

let studentTaskMentorRequest: StudentTaskMentorRequest; //

const { status, data } = await apiInstance.createMentoringActivity(
    studentTaskMentorRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentTaskMentorRequest** | **StudentTaskMentorRequest**|  | |


### Return type

**StudentTaskMentorResponse**

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

# **updateMentoringMinutes**
> StudentTaskMentorResponse updateMentoringMinutes(updateMentorMinutesRequest)


### Example

```typescript
import {
    StudentTaskMentorControllerApi,
    Configuration,
    UpdateMentorMinutesRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentTaskMentorControllerApi(configuration);

let id: number; // (default to undefined)
let updateMentorMinutesRequest: UpdateMentorMinutesRequest; //

const { status, data } = await apiInstance.updateMentoringMinutes(
    id,
    updateMentorMinutesRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateMentorMinutesRequest** | **UpdateMentorMinutesRequest**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**StudentTaskMentorResponse**

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

