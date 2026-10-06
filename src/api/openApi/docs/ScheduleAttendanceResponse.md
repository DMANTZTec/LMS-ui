# ScheduleAttendanceResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**scheduleId** | **number** |  | [optional] [default to undefined]
**batchName** | **string** |  | [optional] [default to undefined]
**course** | **string** |  | [optional] [default to undefined]
**sessionStatus** | **string** |  | [optional] [default to undefined]
**totalStudents** | **number** |  | [optional] [default to undefined]
**presentCount** | **number** |  | [optional] [default to undefined]
**absentCount** | **number** |  | [optional] [default to undefined]
**unmarkedCount** | **number** |  | [optional] [default to undefined]
**attendanceRate** | **number** |  | [optional] [default to undefined]
**markedAt** | **string** |  | [optional] [default to undefined]
**markedBy** | **string** |  | [optional] [default to undefined]
**students** | [**Array&lt;AttendanceStudentResponse&gt;**](AttendanceStudentResponse.md) |  | [optional] [default to undefined]

## Example

```typescript
import { ScheduleAttendanceResponse } from './api';

const instance: ScheduleAttendanceResponse = {
    scheduleId,
    batchName,
    course,
    sessionStatus,
    totalStudents,
    presentCount,
    absentCount,
    unmarkedCount,
    attendanceRate,
    markedAt,
    markedBy,
    students,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
