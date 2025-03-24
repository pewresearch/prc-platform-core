<?php
namespace PRC\Platform;

class Copilot {
	public static $platform_version;

	public function __construct( $version, $loader ) {
		self::$platform_version = $version;
		$this->init( $loader );
	}

	public function init( $loader = null ) {
		if ( null !== $loader ) {
			// $loader->add_filter( 'ai_services_chatbot_enabled', $this, 'enable_chatbot' );
			$loader->add_filter( 'ai_services_model_params', $this, 'default_system_instructions', 10, 2 );
		}
	}

	public function enable_chatbot( $enabled ) {
		return is_user_admin();
	}

	/**
	 * @hook ai_services_model_params
	 */
	public function default_system_instructions( $params, $service ) {
		if ( 'prc-copilot__playground' === $params['feature'] ) {
			$params['systemInstruction']  = 'You are operating inside the Gutenberg block editor, when you are asked to generate content provide it back in markdown so that it may easily be pasted and converted automatically into block markup.';
			$params['systemInstruction'] .= ' If you are asked a question just return normal strings. When you are asked specifically about "our" as in "our data" use "Pew Research Center".';
			$params['systemInstruction'] .= ' If this prompt is explicitly asking to create a table, escape the markdown output so that I can easily copy and paste it into the block editor.';
		}
		return $params;
	}
}
