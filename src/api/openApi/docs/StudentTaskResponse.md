# StudentTaskResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**studentId** | **string** |  | [optional] [default to undefined]
**topicId** | **number** |  | [optional] [default to undefined]
**topicName** | **string** |  | [optional] [default to undefined]
**topicReferences** | **Array&lt;{ [key: string]: object; }&gt;** |  | [optional] [default to undefined]
**startDt** | **string** |  | [optional] [default to undefined]
**endDt** | **string** |  | [optional] [default to undefined]
**commitUrl** | **string** |  | [optional] [default to undefined]
**status** | **string** |  | [optional] [default to undefined]
**needHelp** | **boolean** |  | [optional] [default to undefined]
**studentCommentTxt** | **string** |  | [optional] [default to undefined]
**reviewerCommentTxt** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { StudentTaskResponse } from './api';

const instance: StudentTaskResponse = {
    id,
    studentId,
    topicId,
    topicName,
    topicReferences,
    startDt,
    endDt,
    commitUrl,
    status,
    needHelp,
    studentCommentTxt,
    reviewerCommentTxt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
