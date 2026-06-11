# CreateClassRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**batchName** | **string** |  | [default to undefined]
**beginDate** | **string** |  | [default to undefined]
**endDate** | **string** |  | [default to undefined]
**selectedDays** | **Array&lt;string&gt;** |  | [default to undefined]
**dayTimes** | [**{ [key: string]: DayTimeSlot; }**](DayTimeSlot.md) |  | [default to undefined]
**selectedInstructors** | **Array&lt;string&gt;** |  | [default to undefined]

## Example

```typescript
import { CreateClassRequest } from './api';

const instance: CreateClassRequest = {
    batchName,
    beginDate,
    endDate,
    selectedDays,
    dayTimes,
    selectedInstructors,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
