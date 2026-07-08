# StudentProgramControllerApi

All URIs are relative to *http://localhost:9090*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**assignProgramToStudent**](#assignprogramtostudent) | **POST** /api/student-programs/assign | |

# **assignProgramToStudent**
> AssignProgramResponse assignProgramToStudent(assignProgramRequest)


### Example

```typescript
import {
    StudentProgramControllerApi,
    Configuration,
    AssignProgramRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentProgramControllerApi(configuration);

let assignProgramRequest: AssignProgramRequest; //

const { status, data } = await apiInstance.assignProgramToStudent(
    assignProgramRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **assignProgramRequest** | **AssignProgramRequest**|  | |


### Return type

**AssignProgramResponse**

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

