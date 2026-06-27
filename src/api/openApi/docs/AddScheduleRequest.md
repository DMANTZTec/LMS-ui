# AddScheduleRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**className** | **string** |  | [optional] [default to undefined]
**courseName** | **string** |  | [optional] [default to undefined]
**staffId** | **string** |  | [default to undefined]
**classDate** | **string** |  | [optional] [default to undefined]
**startTime** | [**LocalTime**](LocalTime.md) |  | [optional] [default to undefined]
**endTime** | [**LocalTime**](LocalTime.md) |  | [optional] [default to undefined]
**staffName** | **string** |  | [optional] [default to undefined]
**batchId** | **number** |  | [optional] [default to undefined]

## Example

```typescript
import { AddScheduleRequest } from './api';

const instance: AddScheduleRequest = {
    className,
    courseName,
    staffId,
    classDate,
    startTime,
    endTime,
    staffName,
    batchId,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
