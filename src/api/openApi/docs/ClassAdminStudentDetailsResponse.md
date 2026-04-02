# ClassAdminStudentDetailsResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**studentId** | **string** |  | [optional] [default to undefined]
**firstNm** | **string** |  | [optional] [default to undefined]
**lastNm** | **string** |  | [optional] [default to undefined]
**emailId** | **string** |  | [optional] [default to undefined]
**mobileNum** | **string** |  | [optional] [default to undefined]
**status** | **string** |  | [optional] [default to undefined]
**enabled** | **string** |  | [optional] [default to undefined]
**courses** | [**Array&lt;MyCourseResponse&gt;**](MyCourseResponse.md) |  | [optional] [default to undefined]
**totalSchedules** | **number** |  | [optional] [default to undefined]
**upcoming** | **number** |  | [optional] [default to undefined]
**completedSchedules** | **number** |  | [optional] [default to undefined]
**schedules** | [**Array&lt;ClassScheduleResponse&gt;**](ClassScheduleResponse.md) |  | [optional] [default to undefined]

## Example

```typescript
import { ClassAdminStudentDetailsResponse } from './api';

const instance: ClassAdminStudentDetailsResponse = {
    id,
    studentId,
    firstNm,
    lastNm,
    emailId,
    mobileNum,
    status,
    enabled,
    courses,
    totalSchedules,
    upcoming,
    completedSchedules,
    schedules,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
