( function( wp ) {
	/**
	 * Registers a new block provided a unique name and an object defining its behavior.
	 * @see https://wordpress.org/gutenberg/handbook/designers-developers/developers/block-api/#registering-a-block
	 */
	const { registerBlockType } = wp.blocks;
	/**
	 * Returns a new element of given type. Element is an abstraction layer atop React.
	 * @see https://wordpress.org/gutenberg/handbook/designers-developers/developers/packages/packages-element/
	 */
	const el = wp.element.createElement;
	/**
	 * Retrieves the translation of text.
	 * @see https://wordpress.org/gutenberg/handbook/designers-developers/developers/packages/packages-i18n/
	 */
	const { __ } = wp.i18n;

    const { RichText, MediaUpload, BlockControls, InspectorControls } = wp.blockEditor;
    const { Button, Panel, PanelBody, PanelRow, TextControl } = wp.components;

	/**
	 * Every block starts by registering a new block type definition.
	 * @see https://wordpress.org/gutenberg/handbook/designers-developers/developers/block-api/#registering-a-block
	 */
	registerBlockType( 'gutenberg-banner/banner', {
		/**
		 * This is the display title for your block, which can be translated with `i18n` functions.
		 * The block inserter will show this name.
		 */
		title: __( 'Banner', 'gutenberg-banner' ),

		/**
		 * Blocks are grouped into categories to help users browse and discover them.
		 * The categories provided by core are `common`, `embed`, `formatting`, `layout` and `widgets`.
		 */
		category: 'widgets',

		/**
		 * Optional block extended support features.
		 */
		supports: {
			// Removes support for an HTML mode.
			html: false,
		},
        icon: 'cover-image',
        keywords: ['banner', 'image'],
        attributes: {
            content: {
                type: 'string',
            },
            link: {
                type: 'string',
                source: 'attribute',
                selector: 'a',
                attribute: 'href',
            },
            mediaID: {
                type: 'number',
            },
            mediaURL: {
                type: 'string',
                source: 'attribute',
                selector: 'img',
                attribute: 'src',
            }
        },

		/**
		 * The edit function describes the structure of your block in the context of the editor.
		 * This represents what the editor will render when the block is used.
		 * @see https://wordpress.org/gutenberg/handbook/designers-developers/developers/block-api/block-edit-save/#edit
		 *
		 * @param {Object} [props] Properties passed from the editor.
		 * @return {Element}       Element to render.
		 */
		edit: ( props ) => {
			const onChangeContent = ( newContent ) => {
                props.setAttributes( { content: newContent } );
            }

            const onChangeLink = ( newlink ) => {
                props.setAttributes( { link: newlink } );
            }

            const onSelectImage = ( media ) => {
                props.setAttributes( {
                    mediaURL: media.url,
                    mediaID: media.id,
                } );
            };

            return [
                el( InspectorControls,
                    {
                        key: 'setting'
                    },
                    el ( Panel, {},
                        el( PanelBody,
                            {
                                title: __( 'Banner Settings' ),
                                initialOpen: true,
                            },
                            /* Link Field */
                            el ( PanelRow, {},
                                el ( TextControl,
                                    {
                                        label: __('Banner Link', 'gutenberg-banner'),
                                        onChange: onChangeLink,
                                        value: props.attributes.link,
                                    },
                                )
                            )
                        )
                    )
                ),

                el( 'div', { className: props.className },
                    el( 'div', { className: 'wp-block-banner' },
                        el( 
                            MediaUpload, 
                            {
                                onSelect: onSelectImage,
                                allowedTypes: 'image',
                                value: props.attributes.mediaID,
                                render: ( { open } ) => {
                                    if ( ! props.attributes.mediaID ) {
                                        return el( 
                                            Button, 
                                            {
                                                className: 'button button-large',
                                                onClick: open,
                                            },
                                            __( 'Upload Image' )
                                            )
                                        }
                                    else {
                                        return el( 'a',
                                            {
                                                className: 'wp-block-banner__link wp-block-banner__link--image',
                                                // href: props.attributes.link,
                                                onClick: false,
                                            },
                                            el( 
                                                'img', 
                                                {
                                                    className: 'wp-block-banner__image',
                                                    onClick: open,
                                                    src: props.attributes.mediaURL,
                                                    alt: props.attributes.content,
                                                } 
                                            )
                                        )
                                    }
                                }
                            },
                        ),
                        el( 'a',
                                {
                                    className: 'wp-block-banner__link wp-block-banner__link--text',
                                    // href: props.attributes.link,
                                    onClick: false,
                                },
                            el( 
                                RichText, 
                                {
                                    tagName: 'span',
                                    format: 'string',
                                    className: 'wp-block-banner__text',
                                    onChange: onChangeContent,
                                    value: props.attributes.content,
                                    placeholder: __('Banner text here'),
                                    allowedFormats: [ 'core/bold', 'core/italic' ],
                                }
                            )
                        )
                    )
                )
            ];
		},

		/**
		 * The save function defines the way in which the different attributes should be combined
		 * into the final markup, which is then serialized by Gutenberg into `post_content`.
		 * @see https://wordpress.org/gutenberg/handbook/designers-developers/developers/block-api/block-edit-save/#save
		 *
		 * @return {Element}       Element to render.
		 */
		save: ( props ) =>  {
			return (
                el('div', { className: props.className },
                    el( 'div', { className: 'wp-block-banner' },
                        el( 'a',
                            {
                                className: 'wp-block-banner__link wp-block-banner__link--image',
                                href: props.attributes.link,
                            },
                            el( 
                                'img', {
                                className: 'wp-block-banner__image',
                                src: props.attributes.mediaURL,
                                alt: props.attributes.content,
                            }
                            ),
                            el( 'a',
                                {
                                    className: 'wp-block-banner__link wp-block-banner__link--text',
                                    href: props.attributes.link,
                                },
                                el( 
                                    RichText.Content, 
                                    {
                                        tagName: 'span',
                                        className: 'wp-block-banner__text',
                                        value: props.attributes.content
                                    }
                                )
                            )
                        )
                    )
                )
            );
		}
	} );
} )(
	window.wp
);
