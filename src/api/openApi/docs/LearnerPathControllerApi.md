# LearnerPathControllerApi

All URIs are relative to *http://localhost:9090*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**create1**](#create1) | **POST** /api/learner-paths | |
|[**delete1**](#delete1) | **DELETE** /api/learner-paths/{id} | |
|[**getActivePaths**](#getactivepaths) | **GET** /api/learner-paths/active | |
|[**getAllPaths**](#getallpaths) | **GET** /api/learner-paths/all | |
|[**getById1**](#getbyid1) | **GET** /api/learner-paths/{id} | |
|[**update1**](#update1) | **PUT** /api/learner-paths/{id} | |

# **create1**
> LearnerPathResponse create1(learnerPathRequest)


### Example

```typescript
import {
    LearnerPathControllerApi,
    Configuration,
    LearnerPathRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new LearnerPathControllerApi(configuration);

let learnerPathRequest: LearnerPathRequest; //

const { status, data } = await apiInstance.create1(
    learnerPathRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **learnerPathRequest** | **LearnerPathRequest**|  | |


### Return type

**LearnerPathResponse**

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

# **delete1**
> string delete1()


### Example

```typescript
import {
    LearnerPathControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new LearnerPathControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.delete1(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


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

# **getActivePaths**
> Array<LearnerPathResponse> getActivePaths()


### Example

```typescript
import {
    LearnerPathControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new LearnerPathControllerApi(configuration);

const { status, data } = await apiInstance.getActivePaths();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<LearnerPathResponse>**

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

# **getAllPaths**
> Array<LearnerPathResponse> getAllPaths()


### Example

```typescript
import {
    LearnerPathControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new LearnerPathControllerApi(configuration);

const { status, data } = await apiInstance.getAllPaths();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<LearnerPathResponse>**

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

# **getById1**
> LearnerPathResponse getById1()


### Example

```typescript
import {
    LearnerPathControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new LearnerPathControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getById1(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**LearnerPathResponse**

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

# **update1**
> LearnerPathResponse update1(learnerPathRequest)


### Example

```typescript
import {
    LearnerPathControllerApi,
    Configuration,
    LearnerPathRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new LearnerPathControllerApi(configuration);

let id: number; // (default to undefined)
let learnerPathRequest: LearnerPathRequest; //

const { status, data } = await apiInstance.update1(
    id,
    learnerPathRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **learnerPathRequest** | **LearnerPathRequest**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**LearnerPathResponse**

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

