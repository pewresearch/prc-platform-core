<?php
namespace PRC\Platform;
use WP_Error;

/**
 * Shapes a notification to be sent to Slack
*/

class Slack_Notification  {
	public $text;
	public $channel;
	public $markdown;
	public $attachments;
	public $color;

	public function __construct() {

	}
}
