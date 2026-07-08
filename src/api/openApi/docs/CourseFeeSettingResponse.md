# CourseFeeSettingResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**courseId** | **string** |  | [optional] [default to undefined]
**courseTitle** | **string** |  | [optional] [default to undefined]
**subjectNm** | **string** |  | [optional] [default to undefined]
**courseDuration** | **string** |  | [optional] [default to undefined]
**currentFee** | [**CourseFeeHistoryResponse**](CourseFeeHistoryResponse.md) |  | [optional] [default to undefined]
**feeHistory** | [**Array&lt;CourseFeeHistoryResponse&gt;**](CourseFeeHistoryResponse.md) |  | [optional] [default to undefined]
**totalHistoryRecords** | **number** |  | [optional] [default to undefined]

## Example

```typescript
import { CourseFeeSettingResponse } from './api';

const instance: CourseFeeSettingResponse = {
    courseId,
    courseTitle,
    subjectNm,
    courseDuration,
    currentFee,
    feeHistory,
    totalHistoryRecords,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
