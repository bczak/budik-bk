# API Reference

This API reference is organized by resource type. Each resource type has one or more data representations and one or more methods.

## Resource types

### Event
This object represents Event entity.
#### Resource representations
```json5
{
  "id": 6,
  "title": "Build the Wall",
  "description": "Build the big Wall against White Walkers",
  "start": "2021-02-11T16:00:00Z",
  "end": "2021-02-11T18:00:00Z"
}
```
|Property name|Value|Description|Note|
|-------------|-----|-----------|----|
|`id`|__integer__|Unique identifier of the event. Generates automatically, do not need to specify.|_readonly_|
|`title`|__string__|Title of the event.|_writable_|
|`description`|__string__|Description of the event.|_writable optional_|
|`start`|__string__|The start time and date of the event. Represented as __ISO 8601__ string|_writable_|
|`end`|__string__|The end time and date of the event. Represented as __ISO 8601__ string. If the event is reminder type, then this field is empty.|_writable optional_|

### Alarm
This object represents Alarm entity
#### Resource representations
```json5
{
  "id": 3,
  "time": "18:00",
  "label": "Kill Jon Snow",
  "repeat": 5,
  "status": true,
  "sound": "default"
}
```
|Field|Value|Description|Note|
|-----|-----|-----------|----|
|`id`|__integer__|Unique identifier of the alarm. Generates automatically, do not need to specify.|_readonly_|
|`time`|__string__|Time of the alarm.|_writable_|
|`label`|__string__|Label of the alarm.|_writable optional_|
|`repeat`|__integer__|Repeatability of alarm. `1` for Monday, `2` for Tuesday, `4` for Wednesday, `8` for Thursday, `16` for Friday, `32` for Saturday, `64` for Sunday. To represent 2 days or more - use the sum. For example: Monday(`1`) and Wednesday(`4`) - `5`, Saturday(`32`) and Sunday(`64`) - `96`, Monday to Sunday - `127`. Use `0` for no repeat.|_writable_|
|`status`|__boolean__|Status of the alarm. True if active, otherwise - false.|_writable_|
|`sound`|__string__|Sound of the alarm|_writable optional_|

