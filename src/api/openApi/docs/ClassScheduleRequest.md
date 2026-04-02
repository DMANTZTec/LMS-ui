# ClassScheduleRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**scheduleId** | **number** |  | [optional] [default to undefined]
**courseName** | **string** |  | [optional] [default to undefined]
**classId** | **number** |  | [default to undefined]
**staffId** | **number** |  | [default to undefined]
**classDate** | **string** |  | [optional] [default to undefined]
**startTime** | [**LocalTime**](LocalTime.md) |  | [optional] [default to undefined]
**endTime** | [**LocalTime**](LocalTime.md) |  | [optional] [default to undefined]
**staffName** | **string** |  | [optional] [default to undefined]
**mode** | **string** |  | [optional] [default to undefined]
**meetingLink** | **string** |  | [optional] [default to undefined]
**location** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { ClassScheduleRequest } from './api';

const instance: ClassScheduleRequest = {
    scheduleId,
    courseName,
    classId,
    staffId,
    classDate,
    startTime,
    endTime,
    staffName,
    mode,
    meetingLink,
    location,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
