<?php

namespace PRC_Core;

#acf-dependency, needs to be fully converted to rest/custom-js in the post type when this gets converted to gutenberg.

/**
 * This is our first defined "hybrid" that combines a post type with a named taxonomy. It breaks out the "view" portion and the data "controller" portion into a post type and custom taxonomy repsectively.
 */
class Hybrid_Dataset {

	protected $post_type        = 'dataset';
	protected $taxonomy         = 'datasets';
	private $enabled_post_types = array(
		'dataset',
		'post',
		'interactives',
		'essay',
		'fact-sheets',
		'short-read',
		'quiz',
	);

	public function __construct() {      }

	public function init() {
		if ( get_current_blog_id() === PRC_PRIMARY_SITE_ID ) {
			return;
		}
		add_action( 'init', array( $this, 'register' ), 5 );
		add_action( 'rest_api_init', array( $this, 'register_rest_endpoints' ) );
		add_action( 'init', array( $this, 'archive_rewrites' ), 6 );
		add_filter( 'post_type_link', array( $this, 'modify_post_permalink' ), 10, 2 );
		add_action( 'admin_bar_menu', array( $this, 'modify_admin_bar_edit_link' ), 101 );
		add_action( 'save_post_' . $this->post_type, array( $this, 'on_save_dataset_logic' ), 30, 3 );
		add_action( 'wp_footer', array( $this, 'atp_additional_legal_modal' ) );
		add_action( 'wp_head', array( $this, 'schema_ld_json' ) );
		add_filter( 'pew_core_report_materials', array( $this, 'add_to_report_materials' ), 100, 3 );
		// @TODO: This needs some restyling, for the time being lets drive people to the dataset page.
		add_filter( 'prc_story_item_extra', array( $this, 'add_download_link_to_story_item' ), 10, 2 );
		add_filter( 'prc_story_item_extra', array( $this, 'add_pub_list_to_story_item' ), 11, 2 );
				add_action( 'prc_parent_before_archive_listing', array( $this, 'about_datasets_text' ), 10 );
		add_filter( 'prc_parent_items_listing_class', array( $this, 'sui_items_listing_class' ), 10, 1 );
	}

	public function register() {
		if ( get_current_blog_id() === PRC_PRIMARY_SITE_ID ) {
			return;
		}
		$labels = array(
			'name'                       => 'Datasets',
			'singular_name'              => 'Dataset',
			'add_new'                    => 'Add New',
			'add_new_item'               => 'Add New Dataset',
			'edit_item'                  => 'Edit Dataset',
			'new_item'                   => 'New Dataset',
			'all_items'                  => 'Datasets',
			'view_item'                  => 'View Dataset',
			'search_items'               => 'Search datasets',
			'not_found'                  => 'No dataset found',
			'not_found_in_trash'         => 'No dataset found in Trash',
			'parent_item_colon'          => '',
			'parent_item'                => 'Parent Item',
			'new_item_name'              => 'New Item Name',
			'add_new_item'               => 'Add New Item',
			'separate_items_with_commas' => 'Separate items with commas',
			'add_or_remove_items'        => 'Add or remove items',
			'choose_from_most_used'      => 'Choose from the most used',
			'popular_items'              => 'Popular Items',
			'items_list'                 => 'Items list',
			'items_list_navigation'      => 'Items list navigation',
			'menu_name'                  => 'Datasets',
		);

		// Post Type
		// We use the post type mostly to get its archive, and to use each post as a holding for download information and analytics.
		$type_args = array(
			'labels'             => $labels,
			'public'             => true,
			'publicly_queryable' => true,
			'show_ui'            => true,
			'show_in_menu'       => true,
			'show_in_rest'       => true,
			'query_var'          => true,
			'rewrite'            => false,
			'capability_type'    => 'post',
			'has_archive'        => true,
			'hierarchical'       => false,
			'menu_position'      => 30,
			'menu_icon'          => 'dashicons-download',
			'supports'           => array( 'title', 'editor', 'excerpt', 'revisions', 'custom-fields' ),
		);
		register_post_type( $this->post_type, $type_args );

		// Taxonomy
		// We use the taxonomy term to display the individual dataset item and to associated other posts to it.
		$tax_args = array(
			'labels'            => $labels,
			'hierarchical'      => false,
			'public'            => true,
			'rewrite'           => array(
				'slug'         => 'dataset',
				'with_front'   => false,
				'hierarchical' => false,
			),
			'show_ui'           => true,
			'show_admin_column' => true,
			'show_in_rest'      => true,
			'show_in_menu'      => true,
			'show_in_nav_menus' => false,
			'show_tagcloud'     => false,
		);
		register_taxonomy( $this->taxonomy, $this->enabled_post_types, $tax_args );

		register_post_meta(
			$this->post_type,
			'_total_downloads',
			array(
				'description'   => 'Total downloads counter for a dataset.',
				'show_in_rest'  => true,
				'single'        => true,
				'type'          => 'integer',
				'auth_callback' => function () {
					return current_user_can( 'edit_posts' );
				},
			)
		);
	}

	public function sui_items_listing_class( $class ) {
		if ( is_post_type_archive( $this->post_type ) ) {
			$class = 'ui divided very relaxed items paginated';
		}
		return $class;
	}

	public function archive_rewrites() {
		add_rewrite_rule(
			'datasets/(\d\d\d\d)/page/?([0-9]{1,})/?$',
			'index.php?post_type=dataset&year=$matches[1]&paged=$matches[2]',
			'top'
		);
		add_rewrite_rule(
			'datasets/(\d\d\d\d)/?$',
			'index.php?post_type=dataset&year=$matches[1]',
			'top'
		);
		add_rewrite_rule(
			'datasets/page/?([0-9]{1,})/?$',
			'index.php?post_type=dataset&paged=$matches[1]',
			'top'
		);
		add_rewrite_rule(
			'datasets/?$',
			'index.php?post_type=dataset',
			'top'
		);
	}

	public function on_save_dataset_logic( $post_id, $post, $update ) {
		if ( get_current_blog_id() === PRC_PRIMARY_SITE_ID ) {
			return;
		}
		// If is a revision or autosave do nothing.
		if ( wp_is_post_revision( $post_id ) || wp_is_post_autosave( $post_id ) ) {
			return; // Exit Early.
		}
		if ( isset( $post->post_status ) && ( 'auto-draft' === $post->post_status || 'draft' === $post->post_status ) ) {
			return;
		}

		if ( 'trash' === $post->post_status ) {
			// $current_user = wp_get_current_user();
			// $this->delete_associated_byline_term( $associated_term, $current_user->user_email );
		}

		// This is the first time that a dataset will be generated:
		$associated_term_id = get_post_meta( $post_id, 'linked_dataset_term', true );
		if ( empty( $associated_term_id ) ) {
			$this->generate_dataset_term( $post );
			// The dataset already exists now we're just editing it:
		} else {
			$this->update_dataset_term( $associated_term_id, $post );
		}
	}

	public function generate_dataset_term( $post, $return = false ) {
		if ( ! is_object( $post ) ) {
			return false;
		}
		$name = $post->post_title;
		$slug = $post->post_name;

		$new_term = wp_insert_term(
			$name,
			$this->taxonomy,
			array(
				'slug' => $slug,
			)
		);

		if ( is_wp_error( $new_term ) ) {
			return prc_log_error( 'DATASETS', $new_term->get_error_code(), $new_term->get_error_message(), $post );
		}

		update_term_meta( $new_term['term_id'], 'dataset_post_id', $post->ID );
		update_post_meta( $post->ID, 'linked_dataset_term', $new_term['term_id'] );

		if ( true === $return ) {
			return $new_term['term_id'];
		}
	}

	private function update_dataset_term( $term_id, $post ) {
		$term      = get_term( $term_id, $this->taxonomy );
		// If the term doesn't exist, we'll generate a new one.
		if ( !$term instanceof \WP_Term ) {
			return $this->generate_dataset_term( $post, true );
		}
		$term_name = $term->name;
		$term_slug = $term->slug;

		$post_name = $post->post_title;
		$post_slug = $post->post_name;

		$changes = array();
		if ( $term_name !== $post_name ) {
			$changes['name'] = $post_name;
		}

		if ( $term_slug !== $post_slug ) {
			$changes['slug'] = $post_slug;
		}

		wp_update_term( $term_id, $this->taxonomy, $changes );
	}

	private function delete_associated_dataset_term( $name, $requester_email ) {
		wp_mail( 'webdev@pewresearch.onmicrosoft.com', 'Dataset Deletion Request', "A request has been received to delete dataset: {$name}. Request made by: {$requester_email}" );
	}

	public function modify_post_permalink( $url, $post ) {
		if ( 'publish' !== $post->post_status ) {
			return $url;
		}
		if ( $this->post_type === get_post_type( $post ) ) {
			$dataset_term_id = get_post_meta( $post->ID, 'linked_dataset_term', true );
			if ( ! $dataset_term_id ) {
				return false;
			}
			$term_link = get_term_link( (int) $dataset_term_id, $this->taxonomy );
			do_action( 'qm/debug', 'Dataset Term Link: ' . $dataset_term_id . ' - ' . print_r( $term_link, true ) );
			if ( ! is_wp_error( $term_link ) ) {
				$url = $term_link;
			}
		}
		return $url;
	}

	public function modify_admin_bar_edit_link( $admin_bar ) {
		if ( ! is_tax( $this->taxonomy ) ) {
			return;
		}

		$admin_bar->remove_menu( 'edit' );

		$dataset_post_id = get_term_meta( get_queried_object()->term_id, 'dataset_post_id', true );
		$link            = get_edit_post_link( $dataset_post_id );
		$admin_bar->add_menu(
			array(
				'parent' => false,
				'id'     => 'edit_dataset',
				'title'  => __( 'Edit Dataset' ),
				'href'   => $link,
				'meta'   => array(
					'title' => __( 'Edit Dataset' ),
				),
			)
		);
	}

	/**
	 * This adds a link to the to dataset term page in the report materials widget.
	 *
	 * @param [type] $list            [description]
	 * @param [type] $post_obj        [description]
	 * @param [type] $parent_post_obj [description]
	 */
	public function add_to_report_materials( $list, $post_obj, $parent_post_obj ) {
		$terms = wp_get_post_terms( $parent_post_obj->ID, $this->taxonomy );
		if ( ! $terms ) {
			return $list; // Return list early nothing to see here.
		}

		$list = $list;

		foreach ( $terms as $term ) {
			$term_url = get_term_link( $term, 'datasets' );
			if ( 'prc_parent' === wp_get_theme()->template ) {
				$list .= "<a href='{$term_url}' class='item' dataset-id='{$term->term_id}' dataset-title='{$term->name}'>  <i class='download icon'></i> {$term->name}  Dataset</a>";
			} else {
				$list .= "<li class='dataset'><a href='{$term_url}' dataset-id='{$term->term_id}' dataset-title='{$term->name}'>{$term->name} Dataset</a></li>";
			}
		}

		return $list;
	}

	public function get_download_link( $dataset_term_id = false, $dataset_post_id = false, $classes = array(), $return_markup = true ) {
		$site_id = get_current_blog_id();
		if ( false === $dataset_post_id && false === $dataset_term_id ) {
			return false;
		}
		if ( false === $dataset_post_id ) {
			$dataset_post_id = get_term_meta( $dataset_term_id, 'dataset_post_id', true );
		}

		if ( empty( $dataset_post_id ) ) {
			return false;
		}

		$download_url = false;

		$download_attachment_id = get_post_meta( $dataset_post_id, 'dataset_download', true );
		if ( false !== $download_attachment_id && !empty($download_attachment_id) ) {
			$download_url = wp_get_attachment_url( $download_attachment_id );
		} else {
			$download_url = get_post_meta( $dataset_post_id, 'dataset_download_url', true );
			// @TODO: write a helper function to help move these into the media library.
		}

		$download = $download_url;

		if ( false === $download ) {
			return false;
		}

		$dataset_title     = get_the_title( $dataset_post_id );
		$dataset_permalink = get_the_permalink( $dataset_post_id );

		$isATP = get_post_meta( $dataset_post_id, 'legal_atp', true );
		if ( ! $isATP ) {
			$isATP = 'false';
		} else {
			$isATP = 'true';
		}
		$classes = implode( ' ', $classes );

		$download_link = '<div class="react-dataset-download" dataset-dl-link="' . esc_url( $download ) . '" dataset-id="' . esc_attr( $dataset_post_id ) . '" site-id="' . esc_attr( $site_id ) . '" atp="' . esc_attr( $isATP ) . '" dataset-title="' . esc_attr( $dataset_title ) . '" dataset-url="' . esc_url( $dataset_permalink ) . '"></div>';
		if ( false === $return_markup ) {
			return $download;
		} else {
			return $download_link;
		}
	}

	public function get_publications_list( $dataset_post_id ) {
		$dataset_term_id = get_post_meta( $dataset_post_id, 'linked_dataset_term', true );
		if ( ! $dataset_term_id ) {
			return;
		}

		// Get posts with the term... cache them... only get 10 and then have a link to the dataset term to get more.
		$query_args = array(
			'posts_per_page' => 5, // Get only the most recent 10 posts
			'tax_query'      => array(
				array(
					'taxonomy' => 'datasets',
					'field'    => 'term_id',
					'terms'    => $dataset_term_id,
				),
			),
		);
		$posts      = new \WP_Query( $query_args );
		if ( $posts->have_posts() ) {
			$term_link = get_term_link( (int) $dataset_term_id, $this->taxonomy );
			echo '<div classs="wp-block-spacer" aria-hidden="true" style="height: 20px;"></div>';
			echo '<div class="ui link relaxed large list" style="padding: 1.5rem;background: #F0F0E666;">';
			echo '<div><span class="uppercase-label"><strong>Publications from this dataset</strong></span></div>';
			while ( $posts->have_posts() ) {
				$posts->the_post();
				echo '<a class="item" href="' . get_the_permalink() . '">';
				echo '<div class="content">';
				echo '<div class="meta">' . get_the_time( 'M j, Y', get_the_ID() ) . '</div>';
				echo '<div class="header">' . get_the_title() . '</div>';
				echo '<div class="description">' . prc_get_subheadline( get_the_ID() ) . '</div>';
				echo '</div>';
				echo '</a>';
			}
			if ( $term_link && $posts->found_posts > 5 ) {
				echo '<a class="item" href="' . esc_url( $term_link ) . '">View More Publications</a>';
			}
			echo '</div>';
		}
		echo '<div classs="wp-block-spacer" aria-hidden="true" style="height: 48px;"></div>';
		echo '<div class="ui divider"/>';
	}

	public function add_download_link_to_story_item( $return, $data ) {
		if ( $this->post_type !== $data['post_type'] ) {
			return $return;
		}
		ob_start();
		?>
		<div class="extra">
			<?php echo $this->get_download_link( null, $data['id'], array( 'ui', 'disabled', 'button' ) ); ?>
		</div>
		<?php
		return ob_get_clean();
	}

	public function add_pub_list_to_story_item( $return, $data ) {
		if ( $this->post_type !== $data['post_type'] ) {
			return $return;
		}
		ob_start();
		?>
		<div class="extra-content">
			<?php echo $this->get_publications_list( $data['id'] ); ?>
		</div>
		<?php
		return ob_get_clean();
	}

	public function about_datasets_text() {
		if ( ! is_post_type_archive( $this->post_type ) || is_tax( $this->taxonomy ) ) {
			return;
		}

		// $forms = new \PewResearch\forms();
		echo '<div class="post-content">';
		echo '<div id="js-prc-user-login"></div>';

		if ( is_post_type_archive( $this->post_type ) ) {
			?>
			<p>This page is organized by survey, where each dataset is identified by the name of the survey, and below each dataset are links to the reports released from that data. In some cases, reports draw from multiple datasets.</p>

			<p>Typically, survey data are released two years after the reports are issued. See <a href="https://www.pewresearch.org/fact-tank/2018/03/09/how-to-access-pew-research-center-survey-data/">this post</a> for information on how to access and download our datasets. Pew Research Center staff are available to answer questions and to provide limited assistance in importing and analyzing the data. If you have questions about the datasets, or if the information you are interested in is more than two years old but is not here, please contact the Center.</p>
			<div class="ui divider"></div>
			<?php
		}
		echo '</div>'; // .post-content
	}

	/** @TODO For Legacy Sites, can be removed on 4.0 */
	public function atp_additional_legal_modal() {
		ob_start();
		?>
	<div id="js-atp-legal-modal" class="ui modal">
		<i class="close icon"></i>
		<div class="header">
			American Trends Panel Dataset
		</div>
		<div class="content">
			<div id="js-atp-legal-form" class="ui form">
				<textarea wrap="virtual" cols="65" rows="10" id="Legal" disabled>Terms and Conditions

	This is a legal agreement (this “Agreement”) between you, the end user (“you” or “User”), and Pew Research Center (the “Center”). By downloading the American Trends Panel survey data made available on this web site (“Data”) you are agreeing to be bound by the terms and conditions of this Agreement. If you do not agree to be bound by these terms, do not download or use the Data.

	I.	License.
	A.	 The Center hereby grants User a non-exclusive, revocable, limited, non-sublicensable, non-transferable, worldwide, royalty-free license to use the Data solely for (1) research, scholarly or academic purposes, or (2) User’s own personal, non-commercial use. The foregoing license is personal to User, and you may not share (or otherwise permit access to) the Data to any other individual or entity, including those within your business or organization.  Further, you may not reproduce, sell, rent, lease, loan, distribute or sublicense, or otherwise transfer any Data, in whole or in part, to any other party, or use the Data to create any derivative work or product for resale, lease or license. Notwithstanding the foregoing, you may incorporate limited portions of the Data in scholarly, research or academic publications or for the purposes of news reporting provided that you:
	1.	 acknowledge the source of the Data with express reference to the Center in accordance with the following citation:

	“Pew Research Center’s American Trends Panel”

	2.	do not use the Data in any manner that implies, suggests, or could otherwise be perceived as attributing a particular policy or lobbying objective or opinion to the Center, and
	3.	include the following disclaimer: “The opinions expressed herein, including any implications for policy, are those of the author and not of Pew Research Center.”
	B.	User acknowledges that, as between the parties, the Center is the sole and exclusive owner of all right, title and interest in the Data.  Except for the limited license granted herein, this Agreement does not give User any right, title or interest in the Data.

	II.	Disclaimers and Limitations of Liability. THE DATA IS PROVIDED “AS IS” WITHOUT ANY WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, ARISING BY LAW OR OTHERWISE, INCLUDING BUT NOT LIMITED TO WARRANTIES OF COMPLETENESS, NON-INFRINGEMENT, ACCURACY, MERCHANTABILITY, OR FITNESS FOR A PARTICULAR PURPOSE. THE CENTER EXPRESSLY DISCLAIMS, AND SHALL HAVE NO LIABILITY FOR, ANY ERRORS, OMISSIONS, INACCURACIES, OR INTERRUPTIONS IN THE DATA.  USER ASSUMES ALL RISK ASSOCIATED WITH USE OF THE DATA AND AGREES THAT IN NO EVENT SHALL THE CENTER OR ITS AFFILIATES BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, SPECIAL, INCIDENTAL, PUNITIVE OR CONSEQUENTIAL DAMAGES INCLUDING, BUT NOT LIMITED TO, DAMAGES FOR THE INABILITY TO USE EQUIPMENT OR ACCESS DATA, LOSS OF BUSINESS, LOSS OF REVENUE OR PROFITS, BUSINESS INTERRUPTIONS, LOSS OF INFORMATION OR DATA, OR OTHER FINANCIAL LOSS, ARISING OUT OF THE USE OF, OR INABILITY TO USE, THE DATA BASED ON ANY THEORY OF LIABILITY INCLUDING, BUT NOT LIMITED TO, BREACH OF CONTRACT, BREACH OF WARRANTY, TORT (INCLUDING NEGLIGENCE), OR OTHERWISE, EVEN IF USER HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.

	III.	Privacy, Confidentiality and Security.
	A.	The Center respects the privacy of individuals. The Center has taken measures to ensure that the Data is devoid of information that could be used to identify individuals (including, but not limited to, names, telephone numbers and email addresses) who participated in or who were the subject of any research surveys or studies used to collect the Data (“Personally Identifying Information”). However, in the event that you discover any such Personally Identifying Information in the Data, you shall immediately notify the Center and refrain from using any such Personally Identifying Information. User further agrees not to (and will not allow other to) attempt to ascertain the identity of or derive information about individual survey respondents nor link the individual survey records contained in the Data with other data sets for the purpose of identifying individuals.
	B.	User shall maintain the Data as confidential, and will not use it, in any way nor disclose it to any third party, except as expressly permitted under this Agreement. User agrees, at its sole expense, to take reasonable precautions to protect the confidentiality of Data, at least as stringent as User takes to protect User’s own confidential information, but in no case less than reasonable care.  The foregoing confidentiality obligations shall not apply to any information which: (a) is known to User prior to receipt from the Center other than as a result of User’s breach of any legal obligation; (b) becomes known (independently of disclosure by the Center) to User directly or indirectly from a source having the legal right to disclose such information; (c) is or becomes publicly known, except through a breach of this Agreement by User; or (d) is required to be disclosed by User to comply with applicable laws or governmental regulations, provided that User gives the Center, to the extent practicable, reasonable prior written notice of such disclosure sufficient to permit the Center to contest such disclosure and User takes reasonable and lawful actions to avoid and/or minimize the extent of such disclosure.  The parties agree that any breach of the confidentiality obligations of this Agreement by User will result in irreparable damage to the Center for which it will have no adequate remedy at law.  Therefore, it is agreed that the Center shall be entitled to equitable relief, including an injunction enjoining any such breach by any court of competent jurisdiction.  Such injunction shall be without prejudice to any other right or remedy to which the Center may be entitled, including but not limited to any damages resulting from User’s breach of the confidentiality obligations under this Agreement.  Any failure or delay in exercising any right, power or privilege hereunder shall not operate as a waiver thereof, nor shall any single or partial exercise thereof preclude any other or further exercise thereof or the exercise of any right, power or privilege hereunder.
	C.	User will immediately notify the Center and cooperate with investigations, and provide any information reasonably requested by the Center if User knows of or suspects any breach of security or potential vulnerability of the Data and will promptly remedy such breach.

	IV.	Indemnification. User shall indemnify and hold harmless the Center, its affiliates and related organizations, and each of their respective officers, directors, employees, legal representatives, agents, successors and assigns, from and against any damages, liabilities, costs and expenses (including reasonable attorneys’ and professionals’ fees and court costs arising out of any third-party claims based on (a) User’s access or use of the Data; (b) any changes made by User to the Data in accordance with this Agreement; or (c) any breach by User of any of the terms and conditions of this Agreement.

	V.	Termination. This license will terminate (1) automatically without notice from the Center if you fail to comply with the provisions of this Agreement or (2) immediately upon written notice (by e-mail or otherwise) from the Center. Upon termination of this Agreement, you agree to destroy all copies of any Data, in whole or in part and in any and all media, in your custody and control.

	VI.	Governing law. This Agreement shall be governed by, construed and interpreted in accordance with the laws of the District of Columbia. You further agree to submit to the jurisdiction and venue of the courts of the District of Columbia for any dispute relating to this Agreement.</textarea>

				<div class="required field" style="margin-top: 1em">
					<div class="ui checkbox">
						<input type="checkbox" tabindex="0" name="acceptance" data-validate="terms">
						<label>I have read and abide by the conditions in this agreement</label>
					</div>
				</div>

				<div class="ui secondary submit button flat">Submit</div>
			</div>
		</div>
	</div>
		<?php
		$markup = ob_get_clean();
		echo '<script>var atpLegalModal = ' . wp_json_encode( $markup ) . '</script>';
	}

	public function schema_ld_json() {
		if ( is_tax( $this->taxonomy ) ) {
			$dataset_post_id = get_term_meta( get_queried_object()->term_id, 'dataset_post_id', true );
			$dataset_post    = get_post( $dataset_post_id );
			$post_id = $dataset_post->ID;
			$schema = get_post_meta( $post_id, 'schema', true );
			if ( !empty( $schema ) ) {
				echo '<script type="application/ld+json" class="dataset-schema-single">' . wp_kses_data( $schema ) . '</script>';
			}
		} elseif ( is_post_type_archive( $this->post_type ) ) {
			ob_start();
			?>
				{
					"@context" : "https://schema.org",
					"@id" : "https://www.pewresearch.org/datasets/",
					"@type" : "DataCatalog",
					"name" : "Pew Research Center - Datasets",
					"creator" : {
						"@type" : "Organization",
						"@id" : "https://www.pewresearch.org",
						"name" : "Pew Research Center"
					},
					"description" : "Pew Research Center makes the case-level microdata for much of its research available to the public for secondary analysis after a period of time.",
					"funder" : [
						{
						"@type" : "Organization",
						"@id" : "https://pewtrusts.org/",
						"name" : "Pew Charitable Trusts"
						},
						{
						"@type" : "Organization",
						"@id" : "https://www.templeton.org/",
						"name" : "John Templeton Foundation"
						}
					],
					"about" :[
						{
						"@id": "http://id.loc.gov/authorities/subjects/sh85112549"
						},
						{
						"name" : "religion data"
						},
						{
						"@id" : "http://id.loc.gov/authorities/subjects/sh85127580"
						},
						{
						"name" : "religion surveys"
						},
						{
						"@id" : "http://id.loc.gov/authorities/subjects/sh85124003",
						"name" : "social science surveys"
						},
						{
						"@id" : "http://id.loc.gov/authorities/subjects/sh85104459",
						"name": "political surveys"
						}
					],
					"genre" : [
						{"@id" : "http://id.loc.gov/authorities/genreForms/gf2014026059",
						"name" : "Census data"
						}
					]
				}
			<?php
			$markup = ob_get_clean();
			echo '<script type="application/ld+json" class="dataset-schema-archive">' . wp_kses_data( $markup ) . '</script>';
		}
	}

	public function register_rest_endpoints() {
		register_rest_route(
			'prc-api/v2',
			'datasets/log-download',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'restfully_log_download' ),
				'permission_callback' => function () {
					return true; // @TODO We should implement a nonce here with the firebase authentication system.
				},
			)
		);


		register_rest_field(
			$this->post_type,
			'_downloads',
			array(
				'get_callback' => array( $this, 'restfully_get_download_log' ),
				'schema'       => null,
			)
		);
	}

	public function restfully_get_download_log( $object ) {
		$post_id = (int) $object['id'];

		$to_return = array(
			'total' => (int) get_post_meta( $post_id, '_total_downloads', true ),
			'log' => array(),
		);

		$start_year = 2020;
		$current_year = (int) date( 'Y' );
		$years = range( $start_year, $current_year );

		foreach($years as $year) {
			$meta_key = '_downloads_' . $year;
			$to_return['log'][ $year ] = get_post_meta( $post_id, $meta_key, true );
		}

		return $to_return;
	}

	public function restfully_log_download( \WP_REST_Request $request ) {
		$data    = json_decode( $request->get_body(), true );
		$id      = $data['id'];
		$site_id = $data['siteId'];

		$return            = array();
		$return['total']   = $this->increment_download_total( $id, $site_id );
		$return['monthly'] = $this->log_monthly_download_count( $id, $site_id );
		return $return;
	}

	public function increment_download_total( $dataset_id, $site_id ) {
		$current_site_id = get_current_blog_id();
		if ( (int) $site_id !== $current_site_id ) {
			switch_to_blog( $site_id );
		}

		$total = get_post_meta( $dataset_id, '_total_downloads', true );
		++$total;
		$updated = update_post_meta( $dataset_id, '_total_downloads', $total );
		if ( (int) $site_id !== $current_site_id ) {
			restore_current_blog();
		}

		if ( false !== $updated ) {
			return true;
		} else {
			return new \WP_Error( 'datasets/could-not-increment-total', 'Unable to increment download total.', array( 'status' => 500 ) );
		}
	}

	public function log_monthly_download_count( $dataset_id, $site_id ) {
		$current_site_id = get_current_blog_id();

		$year     = wp_date( 'Y' );
		$month    = wp_date( 'm' );
		$meta_key = '_downloads_' . $year;

		if ( (int) $site_id !== $current_site_id ) {
			switch_to_blog( $site_id );
		}

		$data = get_post_meta( $dataset_id, $meta_key, true );

		// Organize by date.
		if ( ! is_array( $data ) ) {
			$data = array();
		}

		if ( ! array_key_exists( $month, $data ) ) {
			$data[ $month ] = 1;
		}

		$data[ $month ] = $data[ $month ] + 1;

		$updated = update_post_meta( $dataset_id, $meta_key, $data );
		if ( (int) $site_id !== $current_site_id ) {
			restore_current_blog();
		}

		if ( false !== $updated ) {
			return true;
		} else {
			return new \WP_Error( 'datasets/could-not-log-monthly', 'Unable to log monthly download data.', array( 'status' => 500 ) );
		}
	}
}

$datasets = new Hybrid_Dataset();
$datasets->init();
