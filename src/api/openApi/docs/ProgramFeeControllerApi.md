# ProgramFeeControllerApi

All URIs are relative to *http://localhost:9090/lms*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createProgramFee**](#createprogramfee) | **POST** /api/program-fee/{programId} | |
|[**getFeeHistory**](#getfeehistory) | **GET** /api/program-fee/{programId}/history | |
|[**getProgramFeeSetting**](#getprogramfeesetting) | **GET** /api/program-fee/{programId} | |
|[**updateProgramFee**](#updateprogramfee) | **PUT** /api/program-fee/{programId} | |

# **createProgramFee**
> ProgramFeeHistoryResponse createProgramFee(programFeeRequest)


### Example

```typescript
import {
    ProgramFeeControllerApi,
    Configuration,
    ProgramFeeRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ProgramFeeControllerApi(configuration);

let programId: string; // (default to undefined)
let staffId: string; // (default to undefined)
let programFeeRequest: ProgramFeeRequest; //

const { status, data } = await apiInstance.createProgramFee(
    programId,
    staffId,
    programFeeRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **programFeeRequest** | **ProgramFeeRequest**|  | |
| **programId** | [**string**] |  | defaults to undefined|
| **staffId** | [**string**] |  | defaults to undefined|


### Return type

**ProgramFeeHistoryResponse**

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

# **getFeeHistory**
> Array<ProgramFeeHistoryResponse> getFeeHistory()


### Example

```typescript
import {
    ProgramFeeControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProgramFeeControllerApi(configuration);

let programId: string; // (default to undefined)

const { status, data } = await apiInstance.getFeeHistory(
    programId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **programId** | [**string**] |  | defaults to undefined|


### Return type

**Array<ProgramFeeHistoryResponse>**

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

# **getProgramFeeSetting**
> ProgramFeeSettingResponse getProgramFeeSetting()


### Example

```typescript
import {
    ProgramFeeControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProgramFeeControllerApi(configuration);

let programId: string; // (default to undefined)

const { status, data } = await apiInstance.getProgramFeeSetting(
    programId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **programId** | [**string**] |  | defaults to undefined|


### Return type

**ProgramFeeSettingResponse**

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

# **updateProgramFee**
> ProgramFeeSettingResponse updateProgramFee(programFeeRequest)


### Example

```typescript
import {
    ProgramFeeControllerApi,
    Configuration,
    ProgramFeeRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ProgramFeeControllerApi(configuration);

let programId: string; // (default to undefined)
let staffId: string; // (default to undefined)
let programFeeRequest: ProgramFeeRequest; //

const { status, data } = await apiInstance.updateProgramFee(
    programId,
    staffId,
    programFeeRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **programFeeRequest** | **ProgramFeeRequest**|  | |
| **programId** | [**string**] |  | defaults to undefined|
| **staffId** | [**string**] |  | defaults to undefined|


### Return type

**ProgramFeeSettingResponse**

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

