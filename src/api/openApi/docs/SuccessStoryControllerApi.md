# SuccessStoryControllerApi

All URIs are relative to *http://localhost:9090/lms*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**_delete**](#_delete) | **DELETE** /api/success-stories/{id} | |
|[**create**](#create) | **POST** /api/success-stories | |
|[**getAllStories**](#getallstories) | **GET** /api/success-stories | |
|[**toggleActive**](#toggleactive) | **PATCH** /api/success-stories/{id}/toggle-active | |
|[**update**](#update) | **PUT** /api/success-stories/{id} | |

# **_delete**
> _delete()


### Example

```typescript
import {
    SuccessStoryControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SuccessStoryControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance._delete(
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

# **create**
> SuccessStoryResponse create(successStoryRequest)


### Example

```typescript
import {
    SuccessStoryControllerApi,
    Configuration,
    SuccessStoryRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new SuccessStoryControllerApi(configuration);

let successStoryRequest: SuccessStoryRequest; //

const { status, data } = await apiInstance.create(
    successStoryRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **successStoryRequest** | **SuccessStoryRequest**|  | |


### Return type

**SuccessStoryResponse**

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

# **getAllStories**
> Array<SuccessStoryResponse> getAllStories()


### Example

```typescript
import {
    SuccessStoryControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SuccessStoryControllerApi(configuration);

const { status, data } = await apiInstance.getAllStories();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<SuccessStoryResponse>**

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

# **toggleActive**
> toggleActive()


### Example

```typescript
import {
    SuccessStoryControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SuccessStoryControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.toggleActive(
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

# **update**
> SuccessStoryResponse update(successStoryRequest)


### Example

```typescript
import {
    SuccessStoryControllerApi,
    Configuration,
    SuccessStoryRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new SuccessStoryControllerApi(configuration);

let id: number; // (default to undefined)
let successStoryRequest: SuccessStoryRequest; //

const { status, data } = await apiInstance.update(
    id,
    successStoryRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **successStoryRequest** | **SuccessStoryRequest**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**SuccessStoryResponse**

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

