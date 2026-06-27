# ContactUsControllerApi

All URIs are relative to *http://localhost:9090*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createContactUs**](#createcontactus) | **POST** /api/contact-us/raise-enquiry | |
|[**getAllContactUs**](#getallcontactus) | **GET** /api/contact-us | |
|[**getContactUsById**](#getcontactusbyid) | **GET** /api/contact-us/{id} | |

# **createContactUs**
> ContactUsResponse createContactUs(contactUsRequest)


### Example

```typescript
import {
    ContactUsControllerApi,
    Configuration,
    ContactUsRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ContactUsControllerApi(configuration);

let contactUsRequest: ContactUsRequest; //

const { status, data } = await apiInstance.createContactUs(
    contactUsRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **contactUsRequest** | **ContactUsRequest**|  | |


### Return type

**ContactUsResponse**

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

# **getAllContactUs**
> Array<ContactUsResponse> getAllContactUs()


### Example

```typescript
import {
    ContactUsControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ContactUsControllerApi(configuration);

const { status, data } = await apiInstance.getAllContactUs();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<ContactUsResponse>**

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

# **getContactUsById**
> ContactUsResponse getContactUsById()


### Example

```typescript
import {
    ContactUsControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ContactUsControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getContactUsById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ContactUsResponse**

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

