# ProviderControllerApi

All URIs are relative to *http://localhost:9090*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createProvider**](#createprovider) | **POST** /api/providers | |
|[**deleteProvider**](#deleteprovider) | **DELETE** /api/providers/{id} | |
|[**getAllProviders**](#getallproviders) | **GET** /api/providers | |
|[**getProviderById**](#getproviderbyid) | **GET** /api/providers/{id} | |
|[**updateProvider**](#updateprovider) | **PUT** /api/providers/{id} | |

# **createProvider**
> ProviderResponse createProvider(providerRequest)


### Example

```typescript
import {
    ProviderControllerApi,
    Configuration,
    ProviderRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ProviderControllerApi(configuration);

let staffId: number; // (default to undefined)
let providerRequest: ProviderRequest; //

const { status, data } = await apiInstance.createProvider(
    staffId,
    providerRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **providerRequest** | **ProviderRequest**|  | |
| **staffId** | [**number**] |  | defaults to undefined|


### Return type

**ProviderResponse**

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

# **deleteProvider**
> string deleteProvider()


### Example

```typescript
import {
    ProviderControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProviderControllerApi(configuration);

let id: number; // (default to undefined)
let staffId: number; // (default to undefined)

const { status, data } = await apiInstance.deleteProvider(
    id,
    staffId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|
| **staffId** | [**number**] |  | defaults to undefined|


### Return type

**string**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAllProviders**
> Array<ProviderResponse> getAllProviders()


### Example

```typescript
import {
    ProviderControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProviderControllerApi(configuration);

const { status, data } = await apiInstance.getAllProviders();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<ProviderResponse>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getProviderById**
> ProviderResponse getProviderById()


### Example

```typescript
import {
    ProviderControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProviderControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getProviderById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ProviderResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateProvider**
> ProviderResponse updateProvider(providerRequest)


### Example

```typescript
import {
    ProviderControllerApi,
    Configuration,
    ProviderRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ProviderControllerApi(configuration);

let id: number; // (default to undefined)
let staffId: number; // (default to undefined)
let providerRequest: ProviderRequest; //

const { status, data } = await apiInstance.updateProvider(
    id,
    staffId,
    providerRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **providerRequest** | **ProviderRequest**|  | |
| **id** | [**number**] |  | defaults to undefined|
| **staffId** | [**number**] |  | defaults to undefined|


### Return type

**ProviderResponse**

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

