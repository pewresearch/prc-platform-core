<?php
namespace PRC\Platform;
use WP_Error;
use lygav\slackbot\SlackBot;
use PRC_PLATFORM_SLACK_TOKEN;
/**
 * Slack Bot
 * Example PHP usage:
 *
 * $slackbot = new \PRC\Platform\Slack_Bot()->send_notification( array(
 *	'text' => 'Hello World!',
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

	private static $channel_endpoints = [
		'#publish' => 'https://hooks.slack.com/services/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',
		'#decoded' => 'https://hooks.slack.com/services/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',
		'#prc-platform-activity' => 'https://hooks.slack.com/services/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',
	];

	protected $token;

	public static $handle = 'prc-platform-slack-bot';

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $version, $loader ) {
		$this->version = $version;
		$this->token = PRC_PLATFORM_SLACK_TOKEN;

		require_once( plugin_dir_path( __FILE__ ) . 'class-slack-notification.php' );

		$this->init($loader);
	}

	public function init($loader = null) {
		if ( null !== $loader ) {
			$loader->add_filter( 'prc_api_endpoints', $this, 'register_endpoint' );


			// Do this very last so that all hooks are in place.
			$loader->add_action( 'prc_platform_on_publish', $this, 'post_publish_notification', 100 );
			$loader->add_action( 'prc_platform_on_update', $this, 'post_updated_after_publish', 100 );
			$loader->add_action( 'created_category', $this, 'category_created_notification', 10, 2 );
		}
	}

	public function handoff_to_action_scheduler() {

	}

	public function handle_scheduled_action() {

	}

	/**
	 * Register endpoint for getting theme colors
	 * @hook prc_api_endpoints
	 * @param mixed $endpoints
	 * @return void
	 */
	public function register_endpoint($endpoints) {
		array_push($endpoints, array(
			'route' => 'slackbot/interact',
			'methods'             => 'GET',
			'callback'            => array( $this, 'restfully_receive_interact_request' ),
			'args'                => array(
				'color' => array(
					'validate_callback' => function( $param, $request, $key ) {
						return is_string( $param );
					},
				),
			),
			'permission_callback' => function () {
				return true;
			},
		));
		return $endpoints;
	}

	public function restfully_receive_interact_request() {
		$valid_callbacks = [
			'view_parsely',
			'edit_post'
		];
	}

	public function get_hook_for_channel($channel) {
		if ( array_key_exists( $channel, self::$channel_endpoints ) ) {
			return self::$channel_endpoints[$channel];
		}
		return false;
	}

	public function get_notification_image($post_id) {
		$art = prc_get_art( $post_id, 'twitter' );
		error_log("get_notification_image: " . print_r($art, true));
		if ($art) {
			return $art['url'];
		}
		return null;
	}

	public function send_notification( $args = array() ) {
		// if ( 'production' !== wp_get_environment_type() ) {
		// 	return;
		// }]

		$args = wp_parse_args( $args, array(
			'channel' => '#publish',
			'text'    => false,
			'attachments' => [],
			'image' => null,
		) );

		$url = $this->get_hook_for_channel($args['channel']);

		if ( empty( $this->token ) ) {
			return new WP_Error( '401', 'No Slack token!' );
		}

		$bot = new SlackBot($url, [
			'token' => $this->token,
		]);

		$notification_text = $args['text'];
		if ( ! $notification_text ) {
			return new WP_Error( '400', 'No text provided!' );
		}

		$notification = $bot->text($notification_text);

		if ( !empty($args['attachments']) ) {
			foreach($args['attachments'] as $markdown) {
				$attachment = $bot->buildAttachment("Attachment Fallback Text")->enableMarkdown()->setText($markdown);
				$notification->attach($attachment);
			}
		}

		return $notification->send([
			'icon_emoji' => ':speaker:', // A default if the icon url for our app is not available...
			'unfurl_links' => true,
			'unfurl_media' => true,
		]);
	}

	private function construct_notification_args_for_post($post_id) {
		// If this post type is not set to public then bail
		$post_type = get_post_type( $post_id );
		$channel = $post_type === 'decoded' ? '#decoded' : '#publish';
		$post_type = get_post_type_object( $post_type );
		if ( ! $post_type || ! $post_type->public ) {
			return;
		}

		$permalink = get_permalink( $post_id );
		$title     = get_the_title( $post_id );
		$excerpt   = get_the_excerpt( $post_id );
		$topics     = get_the_terms( $post_id, 'category' );
		$research_teams = get_the_terms( $post_id, 'research-teams' );
		$regions_countries = get_the_terms( $post_id, 'regions-countries' );
		$formats = get_the_terms( $post_id, 'formats' );
		$bylines = get_the_terms( $post_id, 'bylines' );

		$overview_attachment = [
			'*URL:* <' . $permalink . ' | ' . $permalink . ' >',
		];
		if ( $bitly = get_post_meta( $post_id, 'bitly', true ) ) {
			$overview_attachment[] = '*Bit.ly:* <' . $bitly . ' | ' . $bitly . ' >';
		}
		// if ( $excerpt ) {
		// 	$overview_attachment[] = '*Excerpt:* ' . $excerpt;
		// }

		$extras_attachment = [];
		// if ( $bylines ) {
		// 	$extras_attachment[] = '*Bylines:* ' . implode( ', ', wp_list_pluck( $bylines, 'name' ) );
		// }
		// if ( $formats ) {
		// 	$extras_attachment[] = '*Formats:* ' . implode( ', ', wp_list_pluck( $formats, 'name' ) );
		// }
		// if ( $topics ) {
		// 	$extras_attachment[] = '*Topics:* ' . implode( ', ', wp_list_pluck( $topics, 'name' ) );
		// }
		// if ( $research_teams ) {
		// 	$extras_attachment[] = '*Research Teams:* ' . implode( ', ', wp_list_pluck( $research_teams, 'name' ) );
		// }
		// if ( $regions_countries ) {
		// 	$extras_attachment[] = '*Regions/Countries:* ' . implode( ', ', wp_list_pluck( $regions_countries, 'name' ) );
		// }

		$notification_text = '*Title:* <' . $permalink . ' | ' . $title . ' > is now live.';
		$notification_attachments = [];
		if ( !empty($overview_attachment) ) {
			$notification_attachments[] = implode("\n", $overview_attachment);
		}
		if ( !empty($extras_attachment) ) {
			$notification_attachments[] = implode("\n", $extras_attachment);
		}

		$args = array(
			'channel' => $channel,
			'text' => $notification_text,
			'attachments' => $notification_attachments
		);

		return $args;
	}

	/**
	 * @hook prc_platform_on_publish
	 * @param mixed $post
	 * @return void
	 */
	public function post_publish_notification( $post ) {
		$args = $this->construct_notification_args_for_post($post->ID);
		$notified = $this->send_notification( $args );
		error_log("NOTIFIED".print_r($notified, true));
	}

	/**
	 * @hook prc_platform_on_update
	 * @param mixed $post
	 * @return void
	 */
	public function post_updated_after_publish( $post ) {
		$args = $this->construct_notification_args_for_post($post->ID);
		$notified = $this->send_notification( $args );
		error_log("NOTIFIED".print_r($notified, true));
	}

	/**
	 * @hook created_category
	 * @param mixed $term_id
	 * @param mixed $taxonomy_id
	 * @return void
	 */
	public function category_created_notification( $term_id, $taxonomy_id ) {
		global $post;

		$term = get_term( $term_id, 'category' );

		if ( ! $term ) {
			return;
		}

		$post_type = 'post';
		if ( $post && property_exists( $post, 'post_type' ) ) {
			$post_type = $post->post_type;
		}

		$edit_url = admin_url(
			add_query_arg(
				array(
					'taxonomy'  => 'category',
					'post_type' => $post_type,
					's'         => urlencode( $term->name ),
				),
				'edit-tags.php'
			)
		);

		$attachment_text = array(
			'*EDIT:* <' . $edit_url . '>',
		);

		$args = array(
			'text'        => "'" . $term->name . "' topic category created.",
			'icon_emoji'  => ':thought_balloon:',
			'attachments' => json_encode(
				array(
					array(
						'color'     => '#000',
						'text'      => implode( "\n", $attachment_text ),
						'mrkdwn_in' => array( 'text' ),
					),
				)
			),
		);

		$this->send_notification( $args );
	}
}

