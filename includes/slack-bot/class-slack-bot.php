<?php
namespace PRC\Platform;
use WP_Error;
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
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	public $settings = array();

	public static $handle = 'prc-platform-slack-bot';

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {
		$this->plugin_name = $plugin_name;
		$this->version = $version;
		$settings = array(
			'token' => \PRC_PLATFORM_SLACK_TOKEN,
			'username' => 'PRC_Platform',
			'default_channel' => '#publish',
		);
		$this->settings = $settings;
	}

	public function register_assets() {
		$asset_file  = include(  plugin_dir_path( __FILE__ )  . 'build/index.asset.php' );
		$asset_slug = self::$handle;
		$script_src  = plugin_dir_url( __FILE__ ) . 'build/index.js';

		$script = wp_register_script(
			$asset_slug,
			$script_src,
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);

		if ( ! $script ) {
			return new WP_Error( self::$handle, 'Failed to register all assets' );
		}

		return true;
	}

	/**
	 * @hook enqueue_block_editor_assets
	 * @return void
	 */
	public function enqueue_assets() {
		$registered = $this->register_assets();
		if ( is_admin() && ! is_wp_error( $registered ) ) {
			wp_enqueue_script( self::$handle );
		}
	}

	public function send_notification( $args = array() ) {
		$settings = $this->settings;

		if ( empty( $settings['token'] ) ) {
			return new WP_Error( '401', 'No Slack token!' );
		}

		$defaults = array(
			'token'        => $settings['token'],
			'channel'      => $settings['default_channel'],
			'text'         => '',
			'username'     => $settings['username'],
			'parse'        => 'none',
			'link_names'   => '1',
			'attachments'  => '',
			'unfurl_links' => true,
			'icon_url'     => '',
			'icon_emoji'   => ':speaker:',
		);

		$args = wp_parse_args( $args, $defaults );

		// No emoji needed if an icon_url is provided instead.
		if ( ! empty( $args['icon_url'] ) ) {
			unset( $args['icon_emoji'] );
		}

		// Channels should begin with a #
		if ( $args['channel'][0] !== '#' ) {
			$args['channel'] = '#' . $args['channel'];
		}

		$args = apply_filters( 'prc_platform_slackbot_args', $args );

		$slack_url = 'https://slack.com/api/chat.postMessage?' . http_build_query( $args );
		$resp = \vip_safe_wp_remote_get( $slack_url );

		if ( is_wp_error( $resp ) ) {
			return $resp;
		}

		$status  = intval( wp_remote_retrieve_response_code( $resp ) );
		$message = wp_remote_retrieve_body( $resp );
		if ( $status !== 200 ) {
			return new WP_Error( 'prc-platform-slackbot-unexpected-response', $message );
		}
		return $resp;
	}

	/**
	 * @hook transition_post_status
	 * @param mixed $new_status
	 * @param mixed $old_status
	 * @param mixed $post
	 * @return void
	 */
	public function post_publish_notification( $new_status, $old_status, $post ) {
		if ( 'production' !== wp_get_environment_type() ) {
			// return;
		}
		if ( $new_status === 'publish' && $old_status !== 'publish' ) {
			// If this post type is not set to public then bail
			$post_type = get_post_type_object( $post->post_type );
			if ( ! $post_type || ! $post_type->public ) {
				return;
			}

			$permalink = get_permalink( $post->ID );
			$title     = get_the_title( $post->ID );

			$attachment_text = array(
				'*URL:* <' . $permalink . ' | ' . $permalink . ' >',
			);

			if ( $bitly = get_post_meta( $post->ID, 'bitly', true ) ) {
				$attachment_text[] = '*Bit.ly:* <' . $bitly . ' | ' . $bitly . ' >';
			}

			$args = array(
				'text'        => '<' . $permalink . '|' . $title . '> is now live.',				'icon_emoji'  => ':memo:',
				'attachments' => json_encode(
					array(
						array(
							'color'     => '#000',
							'fallback'  => $title . ' is now live.',
							'text'      => implode( "\n", $attachment_text ),
							'mrkdwn_in' => array( 'text' ),
						),
					)
				),
			);

			$args = apply_filters( 'prc_slackbot_post_pub_args', $args, $post );

			$this->send_notification( $args );
		}
	}

	/**
	 * @hook created_category
	 * @param mixed $term_id
	 * @param mixed $taxonomy_id
	 * @return void
	 */
	public function category_created_notification( $term_id, $taxonomy_id ) {
		if ( 'production' !== wp_get_environment_type() ) {
			// return;
		}
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

