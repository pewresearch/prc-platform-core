# Post Package

Handles post packaging, or, what we call internally "report packaging".
This constructs a data hierarchy of:
Parts (optional) -> Chapters -> Sections -> Sub-Section

"Chapters" are posts that are set as children of the "Post Package" post. "Sections" are `core/heading` blocks with the custom attribute of `isSection` set to true. Sub-Sections are H4 and H5 headings within a section.
