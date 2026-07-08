# CourseFeeControllerApi

All URIs are relative to *http://localhost:9090*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createCourseFee**](#createcoursefee) | **POST** /api/course-fee/{courseId} | |
|[**getCourseFeeSetting**](#getcoursefeesetting) | **GET** /api/course-fee/{courseId} | |
|[**getFeeHistory1**](#getfeehistory1) | **GET** /api/course-fee/{courseId}/history | |
|[**updateCourseFee**](#updatecoursefee) | **PUT** /api/course-fee/{courseId} | |

# **createCourseFee**
> CourseFeeHistoryResponse createCourseFee(courseFeeRequest)


### Example

```typescript
import {
    CourseFeeControllerApi,
    Configuration,
    CourseFeeRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseFeeControllerApi(configuration);

let courseId: string; // (default to undefined)
let staffId: string; // (default to undefined)
let courseFeeRequest: CourseFeeRequest; //

const { status, data } = await apiInstance.createCourseFee(
    courseId,
    staffId,
    courseFeeRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **courseFeeRequest** | **CourseFeeRequest**|  | |
| **courseId** | [**string**] |  | defaults to undefined|
| **staffId** | [**string**] |  | defaults to undefined|


### Return type

**CourseFeeHistoryResponse**

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

# **getCourseFeeSetting**
> CourseFeeSettingResponse getCourseFeeSetting()


### Example

```typescript
import {
    CourseFeeControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseFeeControllerApi(configuration);

let courseId: string; // (default to undefined)

const { status, data } = await apiInstance.getCourseFeeSetting(
    courseId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **courseId** | [**string**] |  | defaults to undefined|


### Return type

**CourseFeeSettingResponse**

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

# **getFeeHistory1**
> Array<CourseFeeHistoryResponse> getFeeHistory1()


### Example

```typescript
import {
    CourseFeeControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseFeeControllerApi(configuration);

let courseId: string; // (default to undefined)

const { status, data } = await apiInstance.getFeeHistory1(
    courseId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **courseId** | [**string**] |  | defaults to undefined|


### Return type

**Array<CourseFeeHistoryResponse>**

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

# **updateCourseFee**
> CourseFeeSettingResponse updateCourseFee(courseFeeRequest)


### Example

```typescript
import {
    CourseFeeControllerApi,
    Configuration,
    CourseFeeRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseFeeControllerApi(configuration);

let courseId: string; // (default to undefined)
let staffId: string; // (default to undefined)
let courseFeeRequest: CourseFeeRequest; //

const { status, data } = await apiInstance.updateCourseFee(
    courseId,
    staffId,
    courseFeeRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **courseFeeRequest** | **CourseFeeRequest**|  | |
| **courseId** | [**string**] |  | defaults to undefined|
| **staffId** | [**string**] |  | defaults to undefined|


### Return type

**CourseFeeSettingResponse**

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

