<?php
namespace PRC\Platform;

class Staff {
	public $id;
	public $name;
	public $slug;
	public $user_id;
	public $bio;
	public $mini_bio;
	public $job_title;
	public $job_title_extended;
	public $expertise;
	public $social_profiles;
	public $is_currently_employed = false;

	public function __construct($post_id = false, $term_id = false) {
		// if post id is not false then we'll check the staff post, if term id is not false then well check the term and get the staff post id from there and then continue...
	}
}
