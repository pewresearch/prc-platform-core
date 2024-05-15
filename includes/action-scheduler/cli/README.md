# Action Scheduler CLI

_Due to more than three years of negligence and low prioritization on [improving the WP CLI](https://github.com/woocommerce/action-scheduler/issues/265) and [the PRs submitted](https://github.com/woocommerce/action-scheduler/issues?q=label%3A%22component%3A+wp-cli%22+author%3Acrstauf) to [Action Scheduler](https://github.com/woocommerce/action-scheduler), decided to create this plugin to optimize my (and hopefully others) use of [Action Scheduler](https://actionscheduler.org/)._

## Commands

|Command|Description|
|:--|:--|
|`ascli action cancel`|Cancels an existing scheduled action.|
|`ascli action create`|Creates a new scheduled action.|
|`ascli action delete`|Deletes scheduled action(s).|
|`ascli action generate`|Generates some scheduled actions.|
|`ascli action get`|Get details about a scheduled action.|
|`ascli action list`|Gets a list of scheduled actions.|
|`ascli action next`|Get the next scheduled action.|
|`ascli action run`|Run existing scheduled action.|
|`ascli system data-store`|Get current data store.|
|`ascli system runner`|Get current runner.|
|`ascli system runner disable`|Disable runner.|
|`ascli system runner enable`|Enable runner.|
|`ascli system status`|- List of actions according to status<br />- Active version<br />- Active data store class<br />- Active runner class|
|`ascli system version`|Lists active version(s).|
