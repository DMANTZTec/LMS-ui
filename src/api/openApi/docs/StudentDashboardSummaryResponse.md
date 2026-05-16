# StudentDashboardSummaryResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**studentId** | **string** |  | [optional] [default to undefined]
**studentName** | **string** |  | [optional] [default to undefined]
**profileImg** | **string** |  | [optional] [default to undefined]
**courses** | [**StudentMyCoursesResponse**](StudentMyCoursesResponse.md) |  | [optional] [default to undefined]
**weeklySchedule** | [**WeeklyScheduleResponse**](WeeklyScheduleResponse.md) |  | [optional] [default to undefined]
**overallProgress** | [**OverallProgressResponse**](OverallProgressResponse.md) |  | [optional] [default to undefined]

## Example

```typescript
import { StudentDashboardSummaryResponse } from './api';

const instance: StudentDashboardSummaryResponse = {
    studentId,
    studentName,
    profileImg,
    courses,
    weeklySchedule,
    overallProgress,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
