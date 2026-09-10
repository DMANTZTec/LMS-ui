# CourseManagementControllerApi

All URIs are relative to *http://localhost:9090/lms*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addCourses**](#addcourses) | **POST** /api/add/course/program | |
|[**addDocument**](#adddocument) | **POST** /api/topics/{topicId}/references/document | |
|[**addUrl**](#addurl) | **POST** /api/topics/{topicId}/references/url | |
|[**addVideo**](#addvideo) | **POST** /api/topics/{topicId}/references/video | |
|[**createChapter**](#createchapter) | **POST** /api/chapter/create | |
|[**createCourse**](#createcourse) | **POST** /api/course/create | |
|[**createProgram**](#createprogram) | **POST** /api/add/program | |
|[**createSubject**](#createsubject) | **POST** /api/subject/create | |
|[**createTopic**](#createtopic) | **POST** /api/topics | |
|[**deleteChapter**](#deletechapter) | **DELETE** /api/delete/{chapterId} | |
|[**deleteCourse**](#deletecourse) | **DELETE** /api/course/delete/{courseId} | |
|[**deleteDocument**](#deletedocument) | **DELETE** /api/references/document/{referenceId} | |
|[**deleteProgram**](#deleteprogram) | **DELETE** /api/delete/program/{id} | |
|[**deleteProgramCourse**](#deleteprogramcourse) | **DELETE** /api/delete/course/program | |
|[**deleteSubject**](#deletesubject) | **DELETE** /api/subject/delete/{subjectId} | |
|[**deleteSubjectImage**](#deletesubjectimage) | **DELETE** /api/subject/{subjectId}/image | |
|[**deleteTopic**](#deletetopic) | **DELETE** /api/topics/{id} | |
|[**deleteUrl**](#deleteurl) | **DELETE** /api/references/url/{referenceId} | |
|[**deleteVideo**](#deletevideo) | **DELETE** /api/references/video/{referenceId} | |
|[**getAllPrograms**](#getallprograms) | **GET** /api/getAll/program | |
|[**getChapterById**](#getchapterbyid) | **GET** /api/get/{chapterId} | |
|[**getChaptersByCourse1**](#getchaptersbycourse1) | **GET** /api/chapters/getAll | |
|[**getChaptersByCourseId**](#getchaptersbycourseid) | **GET** /api/course/{courseId}/chapters | |
|[**getCourseDetails**](#getcoursedetails) | **GET** /api/coursedetails/{courseId} | |
|[**getDocuments**](#getdocuments) | **GET** /api/topics/{topicId}/references/documents | |
|[**getProgramById**](#getprogrambyid) | **GET** /api/getById/program/{id} | |
|[**getTopicByIdAndChapterId**](#gettopicbyidandchapterid) | **GET** /api/topics/{topicId} | |
|[**getTopicsByChapterId**](#gettopicsbychapterid) | **GET** /api/topics | |
|[**getTopicsByCourseId**](#gettopicsbycourseid) | **GET** /api/course/{courseId}/topics | |
|[**getUrlsByTopicId**](#geturlsbytopicid) | **GET** /api/topics/{topicId}/references/url | |
|[**getVideos**](#getvideos) | **GET** /api/topics/{topicId}/references/videos | |
|[**moveChapter**](#movechapter) | **PUT** /api/{chapterId}/movechapter | |
|[**moveTopic**](#movetopic) | **PUT** /api/{topicId}/movetopic | |
|[**updateChapter**](#updatechapter) | **PUT** /api/update/{chapterId} | |
|[**updateCourse**](#updatecourse) | **PUT** /api/course/update/{courseId} | |
|[**updateCourseImage**](#updatecourseimage) | **PUT** /api/course/update/{courseId}/image | |
|[**updateCourseIntroVideo**](#updatecourseintrovideo) | **PUT** /api/course/update/{courseId}/intro-video | |
|[**updateProgram**](#updateprogram) | **PUT** /api/update/program/{id} | |
|[**updateSubject**](#updatesubject) | **PUT** /api/subject/update/{subjectId} | |
|[**updateSubjectImage**](#updatesubjectimage) | **PUT** /api/subject/{subjectId}/image | |
|[**updateTopic**](#updatetopic) | **PUT** /api/topics/{id} | |
|[**uploadSubjectImage**](#uploadsubjectimage) | **POST** /api/subject/{subjectId}/image | |
|[**viewAllCourses**](#viewallcourses) | **GET** /api/course/view-courses | |
|[**viewAllSubjects**](#viewallsubjects) | **GET** /api/subject/view-subjects | |
|[**viewCoursesBySubject**](#viewcoursesbysubject) | **GET** /api/subjects/{subjectId}/view-courses | |

# **addCourses**
> Array<ProgramCourseResponse> addCourses(programCourseRequest)


### Example

```typescript
import {
    CourseManagementControllerApi,
    Configuration,
    ProgramCourseRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseManagementControllerApi(configuration);

let programCourseRequest: ProgramCourseRequest; //

const { status, data } = await apiInstance.addCourses(
    programCourseRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **programCourseRequest** | **ProgramCourseRequest**|  | |


### Return type

**Array<ProgramCourseResponse>**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **addDocument**
> TopicReferenceResponseDto addDocument()


### Example

```typescript
import {
    CourseManagementControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseManagementControllerApi(configuration);

let topicId: number; // (default to undefined)
let documentName: string; // (default to undefined)
let refBy: string; // (default to undefined)
let refById: string; // (default to undefined)
let file: File; // (default to undefined)

const { status, data } = await apiInstance.addDocument(
    topicId,
    documentName,
    refBy,
    refById,
    file
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **topicId** | [**number**] |  | defaults to undefined|
| **documentName** | [**string**] |  | defaults to undefined|
| **refBy** | [**string**] |  | defaults to undefined|
| **refById** | [**string**] |  | defaults to undefined|
| **file** | [**File**] |  | defaults to undefined|


### Return type

**TopicReferenceResponseDto**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **addUrl**
> TopicReferenceResponseDto addUrl(topicUrlReferenceRequestDto)


### Example

```typescript
import {
    CourseManagementControllerApi,
    Configuration,
    TopicUrlReferenceRequestDto
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseManagementControllerApi(configuration);

let topicId: number; // (default to undefined)
let topicUrlReferenceRequestDto: TopicUrlReferenceRequestDto; //

const { status, data } = await apiInstance.addUrl(
    topicId,
    topicUrlReferenceRequestDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **topicUrlReferenceRequestDto** | **TopicUrlReferenceRequestDto**|  | |
| **topicId** | [**number**] |  | defaults to undefined|


### Return type

**TopicReferenceResponseDto**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **addVideo**
> TopicReferenceResponseDto addVideo()


### Example

```typescript
import {
    CourseManagementControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseManagementControllerApi(configuration);

let topicId: number; // (default to undefined)
let videoTitle: string; // (default to undefined)
let refBy: string; // (default to undefined)
let refById: string; // (default to undefined)
let file: File; // (default to undefined)

const { status, data } = await apiInstance.addVideo(
    topicId,
    videoTitle,
    refBy,
    refById,
    file
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **topicId** | [**number**] |  | defaults to undefined|
| **videoTitle** | [**string**] |  | defaults to undefined|
| **refBy** | [**string**] |  | defaults to undefined|
| **refById** | [**string**] |  | defaults to undefined|
| **file** | [**File**] |  | defaults to undefined|


### Return type

**TopicReferenceResponseDto**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createChapter**
> ChapterResponse createChapter(chapterRequest)


### Example

```typescript
import {
    CourseManagementControllerApi,
    Configuration,
    ChapterRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseManagementControllerApi(configuration);

let staffId: string; // (default to undefined)
let chapterRequest: ChapterRequest; //

const { status, data } = await apiInstance.createChapter(
    staffId,
    chapterRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **chapterRequest** | **ChapterRequest**|  | |
| **staffId** | [**string**] |  | defaults to undefined|


### Return type

**ChapterResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createCourse**
> CourseResponse createCourse()


### Example

```typescript
import {
    CourseManagementControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseManagementControllerApi(configuration);

let staffId: string; // (default to undefined)
let courseTitle: string; // (default to undefined)
let description: string; // (default to undefined)
let language: string; // (default to undefined)
let skills: Array<string>; // (default to undefined)
let subjectId: number; // (default to undefined)
let providerId: number; // (default to undefined)
let level: string; // (default to undefined)
let courseImage: File; // (optional) (default to undefined)
let introVideo: File; // (optional) (default to undefined)

const { status, data } = await apiInstance.createCourse(
    staffId,
    courseTitle,
    description,
    language,
    skills,
    subjectId,
    providerId,
    level,
    courseImage,
    introVideo
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **staffId** | [**string**] |  | defaults to undefined|
| **courseTitle** | [**string**] |  | defaults to undefined|
| **description** | [**string**] |  | defaults to undefined|
| **language** | [**string**] |  | defaults to undefined|
| **skills** | **Array&lt;string&gt;** |  | defaults to undefined|
| **subjectId** | [**number**] |  | defaults to undefined|
| **providerId** | [**number**] |  | defaults to undefined|
| **level** | [**string**]**Array<&#39;BEGINNER&#39; &#124; &#39;INTERMEDIATE&#39; &#124; &#39;ADVANCED&#39;>** |  | defaults to undefined|
| **courseImage** | [**File**] |  | (optional) defaults to undefined|
| **introVideo** | [**File**] |  | (optional) defaults to undefined|


### Return type

**CourseResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createProgram**
> ProgramResponse createProgram(programRequest)


### Example

```typescript
import {
    CourseManagementControllerApi,
    Configuration,
    ProgramRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseManagementControllerApi(configuration);

let programRequest: ProgramRequest; //

const { status, data } = await apiInstance.createProgram(
    programRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **programRequest** | **ProgramRequest**|  | |


### Return type

**ProgramResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createSubject**
> SubjectResponse createSubject(subjectRequest)


### Example

```typescript
import {
    CourseManagementControllerApi,
    Configuration,
    SubjectRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseManagementControllerApi(configuration);

let staffId: string; // (default to undefined)
let subjectRequest: SubjectRequest; //

const { status, data } = await apiInstance.createSubject(
    staffId,
    subjectRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **subjectRequest** | **SubjectRequest**|  | |
| **staffId** | [**string**] |  | defaults to undefined|


### Return type

**SubjectResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createTopic**
> TopicResponseDto createTopic(topicRequestDto)


### Example

```typescript
import {
    CourseManagementControllerApi,
    Configuration,
    TopicRequestDto
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseManagementControllerApi(configuration);

let topicRequestDto: TopicRequestDto; //

const { status, data } = await apiInstance.createTopic(
    topicRequestDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **topicRequestDto** | **TopicRequestDto**|  | |


### Return type

**TopicResponseDto**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteChapter**
> string deleteChapter()


### Example

```typescript
import {
    CourseManagementControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseManagementControllerApi(configuration);

let chapterId: number; // (default to undefined)
let staffId: string; // (default to undefined)

const { status, data } = await apiInstance.deleteChapter(
    chapterId,
    staffId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **chapterId** | [**number**] |  | defaults to undefined|
| **staffId** | [**string**] |  | defaults to undefined|


### Return type

**string**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteCourse**
> string deleteCourse()


### Example

```typescript
import {
    CourseManagementControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseManagementControllerApi(configuration);

let courseId: number; // (default to undefined)
let staffId: string; // (default to undefined)

const { status, data } = await apiInstance.deleteCourse(
    courseId,
    staffId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **courseId** | [**number**] |  | defaults to undefined|
| **staffId** | [**string**] |  | defaults to undefined|


### Return type

**string**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteDocument**
> string deleteDocument()


### Example

```typescript
import {
    CourseManagementControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseManagementControllerApi(configuration);

let referenceId: number; // (default to undefined)

const { status, data } = await apiInstance.deleteDocument(
    referenceId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **referenceId** | [**number**] |  | defaults to undefined|


### Return type

**string**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteProgram**
> string deleteProgram()


### Example

```typescript
import {
    CourseManagementControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseManagementControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.deleteProgram(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**string**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteProgramCourse**
> string deleteProgramCourse(deleteProgramCourseRequest)


### Example

```typescript
import {
    CourseManagementControllerApi,
    Configuration,
    DeleteProgramCourseRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseManagementControllerApi(configuration);

let deleteProgramCourseRequest: DeleteProgramCourseRequest; //

const { status, data } = await apiInstance.deleteProgramCourse(
    deleteProgramCourseRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **deleteProgramCourseRequest** | **DeleteProgramCourseRequest**|  | |


### Return type

**string**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteSubject**
> string deleteSubject()


### Example

```typescript
import {
    CourseManagementControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseManagementControllerApi(configuration);

let subjectId: number; // (default to undefined)
let staffId: string; // (default to undefined)

const { status, data } = await apiInstance.deleteSubject(
    subjectId,
    staffId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **subjectId** | [**number**] |  | defaults to undefined|
| **staffId** | [**string**] |  | defaults to undefined|


### Return type

**string**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteSubjectImage**
> string deleteSubjectImage()


### Example

```typescript
import {
    CourseManagementControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseManagementControllerApi(configuration);

let subjectId: number; // (default to undefined)
let staffId: string; // (default to undefined)

const { status, data } = await apiInstance.deleteSubjectImage(
    subjectId,
    staffId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **subjectId** | [**number**] |  | defaults to undefined|
| **staffId** | [**string**] |  | defaults to undefined|


### Return type

**string**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteTopic**
> string deleteTopic()


### Example

```typescript
import {
    CourseManagementControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseManagementControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.deleteTopic(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**string**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteUrl**
> string deleteUrl()


### Example

```typescript
import {
    CourseManagementControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseManagementControllerApi(configuration);

let referenceId: number; // (default to undefined)

const { status, data } = await apiInstance.deleteUrl(
    referenceId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **referenceId** | [**number**] |  | defaults to undefined|


### Return type

**string**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteVideo**
> string deleteVideo()


### Example

```typescript
import {
    CourseManagementControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseManagementControllerApi(configuration);

let referenceId: number; // (default to undefined)

const { status, data } = await apiInstance.deleteVideo(
    referenceId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **referenceId** | [**number**] |  | defaults to undefined|


### Return type

**string**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAllPrograms**
> Array<ProgramResponse> getAllPrograms()


### Example

```typescript
import {
    CourseManagementControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseManagementControllerApi(configuration);

const { status, data } = await apiInstance.getAllPrograms();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<ProgramResponse>**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getChapterById**
> ChapterResponse getChapterById()


### Example

```typescript
import {
    CourseManagementControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseManagementControllerApi(configuration);

let chapterId: number; // (default to undefined)

const { status, data } = await apiInstance.getChapterById(
    chapterId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **chapterId** | [**number**] |  | defaults to undefined|


### Return type

**ChapterResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getChaptersByCourse1**
> Array<ChapterResponse> getChaptersByCourse1()


### Example

```typescript
import {
    CourseManagementControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseManagementControllerApi(configuration);

const { status, data } = await apiInstance.getChaptersByCourse1();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<ChapterResponse>**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getChaptersByCourseId**
> Array<ChapterResponse> getChaptersByCourseId()


### Example

```typescript
import {
    CourseManagementControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseManagementControllerApi(configuration);

let courseId: string; // (default to undefined)

const { status, data } = await apiInstance.getChaptersByCourseId(
    courseId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **courseId** | [**string**] |  | defaults to undefined|


### Return type

**Array<ChapterResponse>**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getCourseDetails**
> CourseDetailsResponse getCourseDetails()


### Example

```typescript
import {
    CourseManagementControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseManagementControllerApi(configuration);

let courseId: string; // (default to undefined)

const { status, data } = await apiInstance.getCourseDetails(
    courseId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **courseId** | [**string**] |  | defaults to undefined|


### Return type

**CourseDetailsResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getDocuments**
> Array<TopicReferenceDataDto> getDocuments()


### Example

```typescript
import {
    CourseManagementControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseManagementControllerApi(configuration);

let topicId: number; // (default to undefined)

const { status, data } = await apiInstance.getDocuments(
    topicId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **topicId** | [**number**] |  | defaults to undefined|


### Return type

**Array<TopicReferenceDataDto>**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getProgramById**
> ProgramResponse getProgramById()


### Example

```typescript
import {
    CourseManagementControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseManagementControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getProgramById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ProgramResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getTopicByIdAndChapterId**
> TopicResponseDto getTopicByIdAndChapterId()


### Example

```typescript
import {
    CourseManagementControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseManagementControllerApi(configuration);

let topicId: number; // (default to undefined)
let chapterId: number; // (default to undefined)

const { status, data } = await apiInstance.getTopicByIdAndChapterId(
    topicId,
    chapterId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **topicId** | [**number**] |  | defaults to undefined|
| **chapterId** | [**number**] |  | defaults to undefined|


### Return type

**TopicResponseDto**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getTopicsByChapterId**
> Array<TopicResponseDto> getTopicsByChapterId()


### Example

```typescript
import {
    CourseManagementControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseManagementControllerApi(configuration);

let chapterId: number; // (default to undefined)

const { status, data } = await apiInstance.getTopicsByChapterId(
    chapterId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **chapterId** | [**number**] |  | defaults to undefined|


### Return type

**Array<TopicResponseDto>**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getTopicsByCourseId**
> Array<TopicResponseDto> getTopicsByCourseId()


### Example

```typescript
import {
    CourseManagementControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseManagementControllerApi(configuration);

let courseId: string; // (default to undefined)

const { status, data } = await apiInstance.getTopicsByCourseId(
    courseId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **courseId** | [**string**] |  | defaults to undefined|


### Return type

**Array<TopicResponseDto>**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getUrlsByTopicId**
> Array<TopicReferenceDataDto> getUrlsByTopicId()


### Example

```typescript
import {
    CourseManagementControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseManagementControllerApi(configuration);

let topicId: number; // (default to undefined)

const { status, data } = await apiInstance.getUrlsByTopicId(
    topicId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **topicId** | [**number**] |  | defaults to undefined|


### Return type

**Array<TopicReferenceDataDto>**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getVideos**
> Array<TopicReferenceDataDto> getVideos()


### Example

```typescript
import {
    CourseManagementControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseManagementControllerApi(configuration);

let topicId: number; // (default to undefined)

const { status, data } = await apiInstance.getVideos(
    topicId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **topicId** | [**number**] |  | defaults to undefined|


### Return type

**Array<TopicReferenceDataDto>**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **moveChapter**
> string moveChapter()


### Example

```typescript
import {
    CourseManagementControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseManagementControllerApi(configuration);

let chapterId: number; // (default to undefined)
let targetPosition: number; // (default to undefined)

const { status, data } = await apiInstance.moveChapter(
    chapterId,
    targetPosition
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **chapterId** | [**number**] |  | defaults to undefined|
| **targetPosition** | [**number**] |  | defaults to undefined|


### Return type

**string**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **moveTopic**
> string moveTopic()


### Example

```typescript
import {
    CourseManagementControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseManagementControllerApi(configuration);

let topicId: number; // (default to undefined)
let targetPosition: number; // (default to undefined)

const { status, data } = await apiInstance.moveTopic(
    topicId,
    targetPosition
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **topicId** | [**number**] |  | defaults to undefined|
| **targetPosition** | [**number**] |  | defaults to undefined|


### Return type

**string**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateChapter**
> ChapterResponse updateChapter(chapterRequest)


### Example

```typescript
import {
    CourseManagementControllerApi,
    Configuration,
    ChapterRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseManagementControllerApi(configuration);

let chapterId: number; // (default to undefined)
let staffId: string; // (default to undefined)
let chapterRequest: ChapterRequest; //

const { status, data } = await apiInstance.updateChapter(
    chapterId,
    staffId,
    chapterRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **chapterRequest** | **ChapterRequest**|  | |
| **chapterId** | [**number**] |  | defaults to undefined|
| **staffId** | [**string**] |  | defaults to undefined|


### Return type

**ChapterResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateCourse**
> CourseResponse updateCourse(updateCourseRequest)


### Example

```typescript
import {
    CourseManagementControllerApi,
    Configuration,
    UpdateCourseRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseManagementControllerApi(configuration);

let courseId: number; // (default to undefined)
let staffId: string; // (default to undefined)
let updateCourseRequest: UpdateCourseRequest; //

const { status, data } = await apiInstance.updateCourse(
    courseId,
    staffId,
    updateCourseRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateCourseRequest** | **UpdateCourseRequest**|  | |
| **courseId** | [**number**] |  | defaults to undefined|
| **staffId** | [**string**] |  | defaults to undefined|


### Return type

**CourseResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateCourseImage**
> CourseResponse updateCourseImage()


### Example

```typescript
import {
    CourseManagementControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseManagementControllerApi(configuration);

let courseId: number; // (default to undefined)
let staffId: string; // (default to undefined)
let courseImage: File; // (default to undefined)

const { status, data } = await apiInstance.updateCourseImage(
    courseId,
    staffId,
    courseImage
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **courseId** | [**number**] |  | defaults to undefined|
| **staffId** | [**string**] |  | defaults to undefined|
| **courseImage** | [**File**] |  | defaults to undefined|


### Return type

**CourseResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateCourseIntroVideo**
> CourseResponse updateCourseIntroVideo()


### Example

```typescript
import {
    CourseManagementControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseManagementControllerApi(configuration);

let courseId: number; // (default to undefined)
let staffId: string; // (default to undefined)
let introVideo: File; // (default to undefined)

const { status, data } = await apiInstance.updateCourseIntroVideo(
    courseId,
    staffId,
    introVideo
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **courseId** | [**number**] |  | defaults to undefined|
| **staffId** | [**string**] |  | defaults to undefined|
| **introVideo** | [**File**] |  | defaults to undefined|


### Return type

**CourseResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateProgram**
> ProgramResponse updateProgram(programRequest)


### Example

```typescript
import {
    CourseManagementControllerApi,
    Configuration,
    ProgramRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseManagementControllerApi(configuration);

let id: number; // (default to undefined)
let programRequest: ProgramRequest; //

const { status, data } = await apiInstance.updateProgram(
    id,
    programRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **programRequest** | **ProgramRequest**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ProgramResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateSubject**
> SubjectResponse updateSubject(subjectRequest)


### Example

```typescript
import {
    CourseManagementControllerApi,
    Configuration,
    SubjectRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseManagementControllerApi(configuration);

let subjectId: number; // (default to undefined)
let staffId: string; // (default to undefined)
let subjectRequest: SubjectRequest; //

const { status, data } = await apiInstance.updateSubject(
    subjectId,
    staffId,
    subjectRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **subjectRequest** | **SubjectRequest**|  | |
| **subjectId** | [**number**] |  | defaults to undefined|
| **staffId** | [**string**] |  | defaults to undefined|


### Return type

**SubjectResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateSubjectImage**
> SubjectResponse updateSubjectImage()


### Example

```typescript
import {
    CourseManagementControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseManagementControllerApi(configuration);

let subjectId: number; // (default to undefined)
let staffId: string; // (default to undefined)
let subjectImage: File; // (default to undefined)

const { status, data } = await apiInstance.updateSubjectImage(
    subjectId,
    staffId,
    subjectImage
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **subjectId** | [**number**] |  | defaults to undefined|
| **staffId** | [**string**] |  | defaults to undefined|
| **subjectImage** | [**File**] |  | defaults to undefined|


### Return type

**SubjectResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateTopic**
> TopicResponseDto updateTopic(topicRequestDto)


### Example

```typescript
import {
    CourseManagementControllerApi,
    Configuration,
    TopicRequestDto
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseManagementControllerApi(configuration);

let id: number; // (default to undefined)
let topicRequestDto: TopicRequestDto; //

const { status, data } = await apiInstance.updateTopic(
    id,
    topicRequestDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **topicRequestDto** | **TopicRequestDto**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**TopicResponseDto**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **uploadSubjectImage**
> SubjectResponse uploadSubjectImage()


### Example

```typescript
import {
    CourseManagementControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseManagementControllerApi(configuration);

let subjectId: number; // (default to undefined)
let staffId: string; // (default to undefined)
let subjectImage: File; // (default to undefined)

const { status, data } = await apiInstance.uploadSubjectImage(
    subjectId,
    staffId,
    subjectImage
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **subjectId** | [**number**] |  | defaults to undefined|
| **staffId** | [**string**] |  | defaults to undefined|
| **subjectImage** | [**File**] |  | defaults to undefined|


### Return type

**SubjectResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **viewAllCourses**
> Array<CourseResponse> viewAllCourses()


### Example

```typescript
import {
    CourseManagementControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseManagementControllerApi(configuration);

const { status, data } = await apiInstance.viewAllCourses();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<CourseResponse>**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **viewAllSubjects**
> Array<SubjectResponse> viewAllSubjects()


### Example

```typescript
import {
    CourseManagementControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseManagementControllerApi(configuration);

const { status, data } = await apiInstance.viewAllSubjects();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<SubjectResponse>**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **viewCoursesBySubject**
> Array<CourseResponse> viewCoursesBySubject()


### Example

```typescript
import {
    CourseManagementControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CourseManagementControllerApi(configuration);

let subjectId: number; // (default to undefined)

const { status, data } = await apiInstance.viewCoursesBySubject(
    subjectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **subjectId** | [**number**] |  | defaults to undefined|


### Return type

**Array<CourseResponse>**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

