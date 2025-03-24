<?php
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
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	private static $username = 'prc_platform';

	protected $webhook;
	protected $decoded_webhook;
	protected $token;
	public $env_type;

	public static $handle = 'prc-platform-slack-bot';

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string $plugin_name       The name of this plugin.
	 * @param      string $version    The version of this plugin.
	 */
	public function __construct( $version, $loader ) {
		if ( ! defined( 'PRC_PLATFORM_SLACK_WEBHOOK' ) ) {
			return new WP_Error( 'slack_webhook', 'PRC_PLATFORM_SLACK_WEBHOOK is not defined.' );
		}
		if ( ! defined( 'PRC_PLATFORM_SLACK_DECODED_WEBHOOK' ) ) {
			return new WP_Error( 'slack_decoded_webhook', 'PRC_PLATFORM_SLACK_DECODED_WEBHOOK is not defined.' );
		}
		if ( ! defined( 'PRC_PLATFORM_SLACK_TOKEN' ) ) {
			return new WP_Error( 'slack_token', 'PRC_PLATFORM_SLACK_TOKEN is not defined.' );
		}

		$this->version         = $version;
		$this->webhook         = PRC_PLATFORM_SLACK_WEBHOOK;
		$this->decoded_webhook = PRC_PLATFORM_SLACK_DECODED_WEBHOOK;
		$this->token           = PRC_PLATFORM_SLACK_TOKEN;

		require_once plugin_dir_path( __FILE__ ) . 'class-slack-notification.php';

		$this->init( $loader );
	}

	public function init( $loader = null ) {
		if ( null !== $loader ) {
			$this->env_type = wp_get_environment_type();

			// $loader->add_filter( 'prc_api_endpoints', $this, 'register_endpoint' );

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

	public function handoff_to_action_scheduler( $args, $post_id ) {
		$args = array(
			'data' => wp_json_encode( $args ),
		);
		as_enqueue_async_action( 'prc_slack_bot_send_notification', $args, $post_id, true, 5 );
	}

	public function handle_scheduled_notification( $args ) {
		$args = json_decode( $args, true );
		return $this->send_notification( $args );
	}

	/**
	 * Register slackbot endpoint
	 *
	 * @hook prc_api_endpoints
	 * @param mixed $endpoints
	 * @return void
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
						'validate_callback' => function ( $param, $request, $key ) {
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

	public function restfully_receive_interact_request() {
		$valid_callbacks = array(
			'view_parsely',
			'edit_post',
		);
	}

	public function send_notification( $args = array() ) {
		if ( 'production' !== $this->env_type ) {
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

		$webhook = $args['channel'] === '#decoded' ? $this->decoded_webhook : $this->webhook;

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

	private function construct_notification_args_for_post( $post_id ) {
		// If this post type is not set to public then bail
		$post_type = get_post_type( $post_id );
		$channel   = $post_type === 'decoded' ? '#decoded' : '#publish';
		$post_type = get_post_type_object( $post_type );
		if ( ! $post_type || ! $post_type->public ) {
			return;
		}

		$permalink         = get_permalink( $post_id );
		$title             = get_the_title( $post_id );
		$excerpt           = get_the_excerpt( $post_id );
		$topics            = get_the_terms( $post_id, 'category' );
		$research_teams    = get_the_terms( $post_id, 'research-teams' );
		$regions_countries = get_the_terms( $post_id, 'regions-countries' );
		$formats           = get_the_terms( $post_id, 'formats' );
		$bylines           = get_the_terms( $post_id, 'bylines' );
		$bitly             = get_post_meta( $post_id, 'bitly', true );

		$overview_attachment = array(
			'*URL:* <' . $permalink . ' | ' . $permalink . ' >',
		);
		if ( ! empty( $bitly ) ) {
			$overview_attachment[] = '*Bit.ly:* <' . $bitly . ' | ' . $bitly . ' >';
		}
		// if ( $excerpt ) {
		// $overview_attachment[] = '*Excerpt:* ' . $excerpt;
		// }

		$extras_attachment = array();
		// if ( $bylines ) {
		// $extras_attachment[] = '*Bylines:* ' . implode( ', ', wp_list_pluck( $bylines, 'name' ) );
		// }
		// if ( $formats ) {
		// $extras_attachment[] = '*Formats:* ' . implode( ', ', wp_list_pluck( $formats, 'name' ) );
		// }
		// if ( $topics ) {
		// $extras_attachment[] = '*Topics:* ' . implode( ', ', wp_list_pluck( $topics, 'name' ) );
		// }
		// if ( $research_teams ) {
		// $extras_attachment[] = '*Research Teams:* ' . implode( ', ', wp_list_pluck( $research_teams, 'name' ) );
		// }
		// if ( $regions_countries ) {
		// $extras_attachment[] = '*Regions/Countries:* ' . implode( ', ', wp_list_pluck( $regions_countries, 'name' ) );
		// }

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

		error_log( 'Slack Bot Args: ' . print_r( $args, true ) );

		return $args;
	}

	/**
	 * @hook prc_platform_on_publish
	 * @param mixed $post
	 * @return void
	 */
	public function schedule_post_published_notification( $post ) {
		$args = $this->construct_notification_args_for_post( $post->ID );
		$this->handoff_to_action_scheduler( $args, $post->ID );
	}
}

function send_slack_notification( $post_id, $args = array() ) {
	as_enqueue_async_action( 'prc_slack_bot_send_notification', $args, $post_id, true, 5 );
}
