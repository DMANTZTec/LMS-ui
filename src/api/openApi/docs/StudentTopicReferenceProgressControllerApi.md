# StudentTopicReferenceProgressControllerApi

All URIs are relative to *http://localhost:9090*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**markReferenceCompleted**](#markreferencecompleted) | **POST** /api/progress/markascomplete | |

# **markReferenceCompleted**
> StudentTopicReferenceProgressResponse markReferenceCompleted(studentTopicReferenceProgressRequest)


### Example

```typescript
import {
    StudentTopicReferenceProgressControllerApi,
    Configuration,
    StudentTopicReferenceProgressRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentTopicReferenceProgressControllerApi(configuration);

let studentTopicReferenceProgressRequest: StudentTopicReferenceProgressRequest; //

const { status, data } = await apiInstance.markReferenceCompleted(
    studentTopicReferenceProgressRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentTopicReferenceProgressRequest** | **StudentTopicReferenceProgressRequest**|  | |


### Return type

**StudentTopicReferenceProgressResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

