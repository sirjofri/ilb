InterLinear Bible
=================

This progressive web app is a bible reader application for interlinear text.
There is a perl converter for `.csv` data.

**All JSON files can change their format at any time!** This is all work in
progress.

library.json
============

This file is the database library. At the moment please look into it directly.

book.json
=========

The library format is like the following code. You can use the tool
`tools/ilb-convert` for creating a skeleton with your data.

```json
{
    "short_name": "short name of the library",
    "name": "name of the library",
    "direction": "reading direction (left or not left)",
    "version": "version number (numerical)",
    "license": "name of the license",
    "license_text": "fulltext of the license",
    "license_url": "url of the license",
    "languages": [
        "first language name",
        "second language name"
        // ...
    ],
    "content": [
        "first row", "second row", // ... "third row", ...
        "first row", "second row", // ... "third row", ...
    ]
}
```
