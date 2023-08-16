# PRC Multisite Migration "Collapse"

This plugin handles the migration schema and mapping for the 2023 Pew Research Center multisite migration. We will be migratin 11 of 13 networks sites into one new network site. This new network site will be the canonical "pewresearch.org". 

Going forward these are the expected site ids and slug at launch:
ID: `20`
slug: `pewresearch-org`

This class uses prc-distributor for handling its integration into 10up/distributor.
10up/distributor is used for the network push infrastructure and relies heavily on the hooks and filters afforded to us. That class also establishes a post migration auto-push functionality that we will continue to use post migration for `decoded (18)`. 

