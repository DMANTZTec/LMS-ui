# ProgramFeeSettingResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**programId** | **string** |  | [optional] [default to undefined]
**programTitle** | **string** |  | [optional] [default to undefined]
**duration** | **string** |  | [optional] [default to undefined]
**currentFee** | [**ProgramFeeHistoryResponse**](ProgramFeeHistoryResponse.md) |  | [optional] [default to undefined]
**feeHistory** | [**Array&lt;ProgramFeeHistoryResponse&gt;**](ProgramFeeHistoryResponse.md) |  | [optional] [default to undefined]
**totalHistoryRecords** | **number** |  | [optional] [default to undefined]

## Example

```typescript
import { ProgramFeeSettingResponse } from './api';

const instance: ProgramFeeSettingResponse = {
    programId,
    programTitle,
    duration,
    currentFee,
    feeHistory,
    totalHistoryRecords,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
