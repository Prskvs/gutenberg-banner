<?php
/**
 * Functions to register client-side assets (scripts and stylesheets) for the
 * Gutenberg block.
 *
 * @package gutenberg-banner
 */

/**
 * Registers all block assets so that they can be enqueued through Gutenberg in
 * the corresponding context.
 *
 * @see https://wordpress.org/gutenberg/handbook/designers-developers/developers/tutorials/block-tutorial/applying-styles-with-stylesheets/
 */
function banner_block_init() {
	// Skip block registration if Gutenberg is not enabled/merged.
	if ( ! function_exists( 'register_block_type' ) ) {
		return;
	}
	$dir = dirname( __FILE__ );

	$index_js = 'banner/index.js';
	wp_register_script(
		'banner-block-editor',
		plugins_url( $index_js, __FILE__ ),
		[
			'wp-blocks',
			'wp-i18n',
			'wp-element',
			'wp-block-editor',
			'wp-components',
		],
		filemtime( "{$dir}/{$index_js}" )
	);

	$editor_css = 'banner/editor.css';
	wp_register_style(
		'banner-block-editor',
		plugins_url( $editor_css, __FILE__ ),
		[],
		filemtime( "{$dir}/{$editor_css}" )
	);

	$style_css = 'banner/style.css';
	wp_register_style(
		'banner-block',
		plugins_url( $style_css, __FILE__ ),
		[],
		filemtime( "{$dir}/{$style_css}" )
	);

	register_block_type( 'gutenberg-banner/banner', [
		'editor_script' => 'banner-block-editor',
		'editor_style'  => 'banner-block-editor',
		'style'         => 'banner-block',
	] );
}

add_action( 'init', 'banner_block_init' );
