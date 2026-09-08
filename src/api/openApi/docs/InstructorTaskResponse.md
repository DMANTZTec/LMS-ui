# InstructorTaskResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**title** | **string** |  | [optional] [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**courseId** | **string** |  | [optional] [default to undefined]
**assignedStudentCount** | **number** |  | [optional] [default to undefined]
**assignedTasks** | [**Array&lt;StudentTaskResponse&gt;**](StudentTaskResponse.md) |  | [optional] [default to undefined]

## Example

```typescript
import { InstructorTaskResponse } from './api';

const instance: InstructorTaskResponse = {
    title,
    description,
    courseId,
    assignedStudentCount,
    assignedTasks,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
