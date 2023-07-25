# Grups de recerca
The "grups_recerca" JSON files store information about the research groups, which is used in some templates, for example, spin-offs, patents or serveis. This has been done this way, because when we stored the information directly in the content, instead of centralizing it, it was very easy for some content to have information that was out of date.

Although it's not needed to save the grups_recerca.{lang}.json files in the repository, we save them to have a backup in case the API call fails. So when building the static site, there will always be data to rely on (even if they are old).

Ideally, these JSON files from the repository should be updated from time to time, since this way the backup will be as up-to-date as possible, although it is not essential, since as we have said before, it is only used in case the API call fails when the site is being built.