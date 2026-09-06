# SocialMediaControllerApi

All URIs are relative to *http://localhost:9090/lms*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createLink**](#createlink) | **POST** /api/social-media/staff/{staffId} | |
|[**deleteLink**](#deletelink) | **DELETE** /api/social-media/{id}/staff/{staffId} | |
|[**getActiveLinks**](#getactivelinks) | **GET** /api/social-media/active | |
|[**getAllLinks**](#getalllinks) | **GET** /api/social-media | |
|[**updateLink**](#updatelink) | **PUT** /api/social-media/{id}/staff/{staffId} | |

# **createLink**
> SocialMediaResponse createLink(socialMediaRequest)


### Example

```typescript
import {
    SocialMediaControllerApi,
    Configuration,
    SocialMediaRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new SocialMediaControllerApi(configuration);

let staffId: string; // (default to undefined)
let socialMediaRequest: SocialMediaRequest; //

const { status, data } = await apiInstance.createLink(
    staffId,
    socialMediaRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **socialMediaRequest** | **SocialMediaRequest**|  | |
| **staffId** | [**string**] |  | defaults to undefined|


### Return type

**SocialMediaResponse**

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

# **deleteLink**
> string deleteLink()


### Example

```typescript
import {
    SocialMediaControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SocialMediaControllerApi(configuration);

let id: number; // (default to undefined)
let staffId: string; // (default to undefined)

const { status, data } = await apiInstance.deleteLink(
    id,
    staffId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|
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

# **getActiveLinks**
> Array<SocialMediaResponse> getActiveLinks()


### Example

```typescript
import {
    SocialMediaControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SocialMediaControllerApi(configuration);

const { status, data } = await apiInstance.getActiveLinks();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<SocialMediaResponse>**

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

# **getAllLinks**
> Array<SocialMediaResponse> getAllLinks()


### Example

```typescript
import {
    SocialMediaControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SocialMediaControllerApi(configuration);

const { status, data } = await apiInstance.getAllLinks();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<SocialMediaResponse>**

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

# **updateLink**
> SocialMediaResponse updateLink(socialMediaRequest)


### Example

```typescript
import {
    SocialMediaControllerApi,
    Configuration,
    SocialMediaRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new SocialMediaControllerApi(configuration);

let id: number; // (default to undefined)
let staffId: string; // (default to undefined)
let socialMediaRequest: SocialMediaRequest; //

const { status, data } = await apiInstance.updateLink(
    id,
    staffId,
    socialMediaRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **socialMediaRequest** | **SocialMediaRequest**|  | |
| **id** | [**number**] |  | defaults to undefined|
| **staffId** | [**string**] |  | defaults to undefined|


### Return type

**SocialMediaResponse**

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

