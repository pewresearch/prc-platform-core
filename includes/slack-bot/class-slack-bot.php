<?php
/**
 * Slack Bot
 *
 * @package PRC\Platform
 */

namespace PRC\Platform;

use WP_Error;
use lygav\slackbot\SlackBot;
use PRC_PLATFORM_SLACK_TOKEN;
use PRC_PLATFORM_SLACK_WEBHOOK;
/**
 * Slack Bot
 * Example PHP usage:
 *
 * $slackbot = new \PRC\Platform\Slack_Bot()->send_notification( array(
 *  'text' => 'Hello World!',
 *  'channel' => '#publish',
 * ) );
 *
 * @package PRC\Platform
 */
class Slack_Bot {
	/**
	 * Slack Webhook URLs
	 *
	 * @var string
	 */
	protected $webhook;

	/**
	 * Slack Webhook URL for Decoded
	 *
	 * @var string
	 */
	protected $decoded_webhook;

	/**
	 * Slack Bot Token
	 *
	 * @var string
	 */
	protected $token;

	/**
	 * Slack Bot Script Handle
	 *
	 * @var string
	 */
	public static $handle = 'prc-platform-slack-bot';

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param    string $loader    The loader instance.
	 * @throws   WP_Error When required Slack configuration constants are not defined.
	 */
	public function __construct( $loader ) {
		if ( ! defined( 'PRC_PLATFORM_SLACK_WEBHOOK' ) ) {
			throw new WP_Error( 'slack_webhook', 'PRC_PLATFORM_SLACK_WEBHOOK is not defined.' );
		}
		if ( ! defined( 'PRC_PLATFORM_SLACK_DECODED_WEBHOOK' ) ) {
			throw new WP_Error( 'slack_decoded_webhook', 'PRC_PLATFORM_SLACK_DECODED_WEBHOOK is not defined.' );
		}
		if ( ! defined( 'PRC_PLATFORM_SLACK_TOKEN' ) ) {
			throw new WP_Error( 'slack_token', 'PRC_PLATFORM_SLACK_TOKEN is not defined.' );
		}

		$this->webhook         = PRC_PLATFORM_SLACK_WEBHOOK;
		$this->decoded_webhook = PRC_PLATFORM_SLACK_DECODED_WEBHOOK;
		$this->token           = PRC_PLATFORM_SLACK_TOKEN;

		require_once plugin_dir_path( __FILE__ ) . 'class-slack-notification.php';

		$this->init( $loader );
	}

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string $loader    The loader instance.
	 */
	public function init( $loader = null ) {
		if ( null !== $loader ) {
			$loader->add_action(
				'prc_slack_bot_send_notification',
				$this,
				'handle_scheduled_notification',
				10,
				1
			);

			$loader->add_action( 'prc_platform_on_publish', $this, 'schedule_post_published_notification', 200, 1 );
		}
	}

	/**
	 * Handoff to action scheduler
	 *
	 * @since    1.0.0
	 * @param      array $args    The arguments.
	 * @param      int   $post_id    The post ID.
	 */
	public function handoff_to_action_scheduler( $args, $post_id ) {
		$args = array(
			'data' => wp_json_encode( $args ),
		);
		as_enqueue_async_action( 'prc_slack_bot_send_notification', $args, $post_id, true, 5 );
	}

	/**
	 * Handle scheduled notification
	 *
	 * @since    1.0.0
	 * @param      array $args    The arguments.
	 */
	public function handle_scheduled_notification( $args ) {
		$args = json_decode( $args, true );
		return $this->send_notification( $args );
	}

	/**
	 * Register slackbot endpoint
	 *
	 * @hook prc_api_endpoints
	 *
	 * @param mixed $endpoints The endpoints.
	 * @return array The endpoints.
	 */
	public function register_endpoint( $endpoints ) {
		array_push(
			$endpoints,
			array(
				'route'               => 'slackbot/interact',
				'methods'             => 'GET',
				'callback'            => array( $this, 'restfully_receive_interact_request' ),
				'args'                => array(
					'color' => array(
						'validate_callback' => function ( $param ) {
							return is_string( $param );
						},
					),
				),
				'permission_callback' => function () {
					return true;
				},
			)
		);
		return $endpoints;
	}

	/**
	 * Restfully receive interact request
	 *
	 * @return void
	 */
	public function restfully_receive_interact_request() {
		$valid_callbacks = array(
			'view_parsely',
			'edit_post',
		);
	}

	/**
	 * Send notification
	 *
	 * @param array $args The arguments.
	 * @return WP_Error|void
	 */
	public function send_notification( $args = array() ) {
		if ( 'production' !== wp_get_environment_type() ) {
			return;
		}

		$args = wp_parse_args(
			$args,
			array(
				'channel'     => '#publish',
				'text'        => false,
				'attachments' => array(),
				'image'       => null,
			)
		);

		if ( empty( $this->token ) ) {
			return new WP_Error( '401', 'No Slack token!' );
		}

		$notification_text = $args['text'];
		if ( ! $notification_text ) {
			return new WP_Error( '400', 'No text provided!' );
		}

		$webhook = ( '#decoded' === $args['channel'] ) ? $this->decoded_webhook : $this->webhook;

		$bot = new SlackBot(
			$webhook,
			array(
				'token' => $this->token,
			)
		);

		$notification = $bot->text( $notification_text );

		if ( ! empty( $args['attachments'] ) ) {
			foreach ( $args['attachments'] as $markdown ) {
				$attachment = $bot->buildAttachment( 'Attachment Fallback Text' )->enableMarkdown()->setText( $markdown );
				$notification->attach( $attachment );
			}
		}

		$notfication = $notification->send(
			array(
				'channel'      => $args['channel'],
				'icon_emoji'   => ':speaker:', // A default if the icon url for our app is not available...
				'unfurl_links' => true,
				'unfurl_media' => true,
			)
		);

		return $notfication;
	}

	/**
	 * Construct notification args for post
	 *
	 * @param int $post_id The post ID.
	 * @return array
	 */
	private function construct_notification_args_for_post( $post_id ) {
		$post_type = get_post_type( $post_id );
		$channel   = ( 'decoded' === $post_type ) ? '#decoded' : '#publish';
		$post_type = get_post_type_object( $post_type );
		if ( ! $post_type || ! $post_type->public ) {
			return;
		}

		$permalink = get_permalink( $post_id );
		$title     = get_the_title( $post_id );
		$bitly     = get_post_meta( $post_id, 'bitly', true );

		$overview_attachment = array(
			'*URL:* <' . $permalink . ' | ' . $permalink . ' >',
		);
		if ( ! empty( $bitly ) ) {
			$overview_attachment[] = '*Bit.ly:* <' . $bitly . ' | ' . $bitly . ' >';
		}

		$extras_attachment = array();

		$notification_text        = wp_sprintf(
			'*%s:* <%s | %s> is now live.',
			$post_type->labels->singular_name,
			$permalink,
			$title
		);
		$notification_attachments = array();
		if ( ! empty( $overview_attachment ) ) {
			$notification_attachments[] = implode( "\n", $overview_attachment );
		}
		if ( ! empty( $extras_attachment ) ) {
			$notification_attachments[] = implode( "\n", $extras_attachment );
		}

		$args = array(
			'channel'     => $channel,
			'text'        => $notification_text,
			'attachments' => $notification_attachments,
		);

		return $args;
	}

	/**
	 * Schedule post published notification
	 *
	 * @hook prc_platform_on_publish
	 *
	 * @param WP_Post $post The post object.
	 * @return void
	 */
	public function schedule_post_published_notification( $post ) {
		$args = $this->construct_notification_args_for_post( $post->ID );
		$this->handoff_to_action_scheduler( $args, $post->ID );
	}
}
