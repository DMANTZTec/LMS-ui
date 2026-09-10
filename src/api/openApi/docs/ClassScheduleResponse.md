# ClassScheduleResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**scheduleId** | **number** |  | [optional] [default to undefined]
**updatedBy** | **number** |  | [optional] [default to undefined]
**updatedDt** | **string** |  | [optional] [default to undefined]
**batchId** | **number** |  | [optional] [default to undefined]
**batchName** | **string** |  | [optional] [default to undefined]
**className** | **string** |  | [optional] [default to undefined]
**classDate** | **string** |  | [optional] [default to undefined]
**dayOfWeek** | **string** |  | [optional] [default to undefined]
**startTime** | [**LocalTime**](LocalTime.md) |  | [optional] [default to undefined]
**endTime** | [**LocalTime**](LocalTime.md) |  | [optional] [default to undefined]
**instructors** | [**Array&lt;BatchInstructorResponse&gt;**](BatchInstructorResponse.md) |  | [optional] [default to undefined]
**mode** | **string** |  | [optional] [default to undefined]
**meetingLink** | **string** |  | [optional] [default to undefined]
**location** | **string** |  | [optional] [default to undefined]
**status** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { ClassScheduleResponse } from './api';

const instance: ClassScheduleResponse = {
    scheduleId,
    updatedBy,
    updatedDt,
    batchId,
    batchName,
    className,
    classDate,
    dayOfWeek,
    startTime,
    endTime,
    instructors,
    mode,
    meetingLink,
    location,
    status,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
