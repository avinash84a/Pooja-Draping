<?php
/**
 * Plugin Name: Pooja Saree Draping - Headless CMS & Admin Panel
 * Plugin URI: https://avipatil.live/cmspooja
 * Description: Custom WordPress Admin Panel and REST API integration for पूजा साडी ड्रॅपिंग (Pooja Saree Draping Pune) Next.js frontend. Provides settings for workshops, fees, dates, WhatsApp number, and saree draping styles.
 * Version: 1.0.0
 * Author: Pooja Saree Draping Pune
 * Author URI: https://avipatil.live/cmspooja
 * Text Domain: pooja-saree-draping
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

class PoojaSareeDrapingCMS {

    private $option_key = 'pooja_workshop_settings';

    public function __construct() {
        // Admin Menu
        add_action('admin_menu', [$this, 'register_admin_menu']);
        
        // Admin Assets (Media uploader script & styles)
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_assets']);
        
        // Custom Post Type for Saree Styles / Gallery
        add_action('init', [$this, 'register_saree_styles_cpt']);
        
        // REST API Endpoints
        add_action('rest_api_init', [$this, 'register_rest_routes']);
        
        // Enable CORS for REST API
        add_action('rest_api_init', [$this, 'enable_cors_headers'], 15);
        
        // Register Page Meta for 'workshop' page
        add_action('init', [$this, 'register_workshop_meta']);
        
        // Save Settings Action
        add_action('admin_post_pooja_save_settings', [$this, 'handle_save_settings']);
    }

    /**
     * Default Workshop Data
     */
    public function get_default_settings() {
        return [
            'title'            => '1 डे साडी ड्रॅपिंग वर्कशॉप',
            'subtitle'         => 'गौरी महालक्ष्मीच्या सुंदर साडी ड्रॅपिंग प्रकारांचे प्रात्यक्षिकासह प्रशिक्षण',
            'instructor'       => 'पूजा पाटील',
            'description'      => 'पुण्यातील सुप्रसिद्ध साडी ड्रॅपिंग आर्टिस्ट पूजा पाटील यांच्या मार्गदर्शनाखाली संपूर्ण प्रात्यक्षिकासह (Hands-on Practical) 14+ पारंपारिक व गौरी महालक्ष्मी साडी प्रकार शिका.',
            'date'             => 'दर रविवारी नवीन बॅच (Upcoming Sunday)',
            'time'             => 'सकाळी ११:०० ते सायंकाळी ५:००',
            'location'         => 'सिंहगड रोड, आनंद नगर, पुणे',
            'location_details' => 'साईप्रभा हाऊस, जगताप हॉस्पिटल समोर, आनंद नगर, सिंहगड रोड, पुणे - ४११०५१',
            'fees'             => 1500,
            'advance_fee'      => 500,
            'seats_left'       => 6,
            'patterns_count'   => '14 ते 15 प्रकार',
            'whatsapp_number'  => '8446917187',
            'whatsapp_message' => 'नमस्कार पूजा ताई, मला १ डे साडी ड्रॅपिंग वर्कशॉपसाठी नाव नोंदवायचे आहे. कृपया पुढील बॅचचे डिटेल्स द्या.',
            'hero_image'       => 'https://avipatil.live/cmspooja/wp-content/uploads/%E0%A4%97%E0%A5%8C%E0%A4%B0%E0%A5%80-%E0%A4%AE%E0%A4%B9%E0%A4%BE%E0%A4%B2%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A5%8D%E0%A4%AE%E0%A5%80/WhatsApp-Image-2026-09-07-at-12.32.19-AM.jpeg',
            'highlights'       => [
                '१४+ पारंपारिक व मॉडर्न साडी ड्रॅपिंग प्रकार',
                'उभी व बसलेली गौरी महालक्ष्मी साडी ड्रॅपिंग स्पेशल',
                'स्टेप-बाय-स्टेप वैयक्तिक प्रात्यक्षिक (Hands-on training)',
                'साडी पिन अप, फिक्सिंग व प्लेट्सच्या सोप्या ट्रिक्स',
                'वर्कशॉपनंतर घरबसल्या साडी नेसवण्याचा आत्मविश्वास',
                'प्रमाणपत्र व मोफत व्हिडिओ गाईड',
            ],
        ];
    }

    /**
     * Retrieve current settings merged with defaults
     */
    public function get_settings() {
        $saved = get_option($this->option_key, []);
        return wp_parse_args($saved, $this->get_default_settings());
    }

    /**
     * Add Custom Admin Menu in WordPress Sidebar
     */
    public function register_admin_menu() {
        add_menu_page(
            'पूजा साडी ड्रॅपिंग CMS',
            'साडी ड्रॅपिंग CMS',
            'manage_options',
            'pooja-saree-draping',
            [$this, 'render_admin_page'],
            'dashicons-art',
            25
        );
    }

    /**
     * Enqueue Media Uploader in Admin
     */
    public function enqueue_admin_assets($hook) {
        if ($hook !== 'toplevel_page_pooja-saree-draping') {
            return;
        }
        wp_enqueue_media();
        wp_enqueue_style('pooja-admin-css', false);
        wp_add_inline_style('pooja-admin-css', '
            .pooja-wrap { max-width: 980px; margin: 20px auto 40px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif; }
            .pooja-header { background: linear-gradient(135deg, #7c1328 0%, #9e1b32 100%); color: #fff; padding: 24px 30px; border-radius: 12px; margin-bottom: 24px; box-shadow: 0 4px 14px rgba(124, 19, 40, 0.2); }
            .pooja-header h1 { color: #fff; margin: 0 0 8px; font-size: 24px; font-weight: 700; }
            .pooja-header p { margin: 0; opacity: 0.9; font-size: 14px; }
            .pooja-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 24px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
            .pooja-card h2 { margin-top: 0; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; font-size: 18px; color: #1e293b; display: flex; align-items: center; gap: 8px; }
            .pooja-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .pooja-field { margin-bottom: 18px; }
            .pooja-field label { display: block; font-weight: 600; font-size: 13px; margin-bottom: 6px; color: #334155; }
            .pooja-field input[type="text"], .pooja-field input[type="number"], .pooja-field textarea { width: 100%; border-radius: 6px; border: 1px solid #cbd5e1; padding: 10px 12px; font-size: 14px; }
            .pooja-field input:focus, .pooja-field textarea:focus { border-color: #9e1b32; outline: none; box-shadow: 0 0 0 2px rgba(158, 27, 50, 0.15); }
            .pooja-btn-primary { background: #9e1b32 !important; border-color: #7c1328 !important; color: #fff !important; font-size: 15px !important; padding: 10px 24px !important; border-radius: 6px !important; height: auto !important; font-weight: 600 !important; cursor: pointer; }
            .pooja-btn-primary:hover { background: #7c1328 !important; }
            .pooja-img-preview { max-width: 260px; max-height: 260px; border-radius: 8px; margin-top: 10px; border: 2px solid #e2e8f0; display: block; object-fit: cover; }
            .pooja-pill-link { display: inline-block; background: #fef2f2; color: #991b1b; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; text-decoration: none; border: 1px solid #fecaca; }
        ');
    }

    /**
     * Render the Admin Panel HTML
     */
    public function render_admin_page() {
        $settings = $this->get_settings();
        $saved = isset($_GET['updated']) && $_GET['updated'] === 'true';
        ?>
        <div class="wrap pooja-wrap">
            <div class="pooja-header">
                <h1>🌸 पूजा साडी ड्रॅपिंग (Pooja Saree Draping) - कंट्रोल पॅनल</h1>
                <p>या पॅनेलमधून बदललेली माहिती लगेच Next.js फ्रंटएंडवर (Front-end Website) आपोआप अपडेट होते.</p>
            </div>

            <?php if ($saved): ?>
                <div class="notice notice-success is-dismissible" style="border-left-color: #9e1b32;">
                    <p><strong>यशस्वी!</strong> सर्व बदल सेव्ह झाले असून Next.js फ्रंटएंडसाठी REST API अपडेट झाले आहे.</p>
                </div>
            <?php endif; ?>

            <form method="POST" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                <input type="hidden" name="action" value="pooja_save_settings">
                <?php wp_nonce_field('pooja_save_settings_nonce', '_pooja_nonce'); ?>

                <!-- SECTION 1: कार्यशाळा माहिती -->
                <div class="pooja-card">
                    <h2>📅 १ डे वर्कशॉप माहिती (Workshop Details)</h2>
                    
                    <div class="pooja-field">
                        <label for="pooja_title">वर्कशॉप मथळा / शीर्षक (Title):</label>
                        <input type="text" id="pooja_title" name="title" value="<?php echo esc_attr($settings['title']); ?>" required>
                    </div>

                    <div class="pooja-field">
                        <label for="pooja_subtitle">उपशीर्षक (Subtitle):</label>
                        <input type="text" id="pooja_subtitle" name="subtitle" value="<?php echo esc_attr($settings['subtitle']); ?>">
                    </div>

                    <div class="pooja-grid-2">
                        <div class="pooja-field">
                            <label for="pooja_instructor">प्रशिक्षिका नाव (Instructor):</label>
                            <input type="text" id="pooja_instructor" name="instructor" value="<?php echo esc_attr($settings['instructor']); ?>">
                        </div>
                        <div class="pooja-field">
                            <label for="pooja_patterns_count">साडी प्रकार संख्या (Pattern Count):</label>
                            <input type="text" id="pooja_patterns_count" name="patterns_count" value="<?php echo esc_attr($settings['patterns_count']); ?>">
                        </div>
                    </div>

                    <div class="pooja-grid-2">
                        <div class="pooja-field">
                            <label for="pooja_date">पुढील बॅच तारीख (Next Date):</label>
                            <input type="text" id="pooja_date" name="date" value="<?php echo esc_attr($settings['date']); ?>">
                            <small>उदा. दर रविवारी / १९ सप्टेंबर २०२६</small>
                        </div>
                        <div class="pooja-field">
                            <label for="pooja_time">वेळ (Timing):</label>
                            <input type="text" id="pooja_time" name="time" value="<?php echo esc_attr($settings['time']); ?>">
                            <small>उदा. सकाळी ११:०० ते सायंकाळी ५:००</small>
                        </div>
                    </div>

                    <div class="pooja-field">
                        <label for="pooja_description">वर्कशॉप वर्णन (Description):</label>
                        <textarea id="pooja_description" name="description" rows="3"><?php echo esc_textarea($settings['description']); ?></textarea>
                    </div>
                </div>

                <!-- SECTION 2: फी आणि नोंदणी -->
                <div class="pooja-card">
                    <h2>💰 फी आणि बुकिंग तपशील (Fees & Booking)</h2>
                    <div class="pooja-grid-2">
                        <div class="pooja-field">
                            <label for="pooja_fees">वर्कशॉप संपूर्ण फी (Total Fees ₹):</label>
                            <input type="number" id="pooja_fees" name="fees" value="<?php echo esc_attr($settings['fees']); ?>" min="0">
                        </div>
                        <div class="pooja-field">
                            <label for="pooja_advance_fee">अॅडव्हान्स बुकिंग फी (Advance Amount ₹):</label>
                            <input type="number" id="pooja_advance_fee" name="advance_fee" value="<?php echo esc_attr($settings['advance_fee']); ?>" min="0">
                        </div>
                    </div>

                    <div class="pooja-grid-2">
                        <div class="pooja-field">
                            <label for="pooja_seats_left">शिल्लक जागा (Seats Available):</label>
                            <input type="number" id="pooja_seats_left" name="seats_left" value="<?php echo esc_attr($settings['seats_left']); ?>" min="0">
                        </div>
                        <div class="pooja-field">
                            <label for="pooja_whatsapp">WhatsApp नंबर (WhatsApp Number):</label>
                            <input type="text" id="pooja_whatsapp" name="whatsapp_number" value="<?php echo esc_attr($settings['whatsapp_number']); ?>">
                            <small>फक्त १० अंकी नंबर (उदा. 8446917187)</small>
                        </div>
                    </div>

                    <div class="pooja-field">
                        <label for="pooja_whatsapp_msg">WhatsApp प्री-फिल्ड मेसेज (Default Message):</label>
                        <textarea id="pooja_whatsapp_msg" name="whatsapp_message" rows="2"><?php echo esc_textarea($settings['whatsapp_message']); ?></textarea>
                    </div>
                </div>

                <!-- SECTION 3: पत्ता आणि स्थळ -->
                <div class="pooja-card">
                    <h2>📍 पत्ता आणि स्थान (Venue Details)</h2>
                    <div class="pooja-field">
                        <label for="pooja_location">थोडक्यात पत्ता (Short Location):</label>
                        <input type="text" id="pooja_location" name="location" value="<?php echo esc_attr($settings['location']); ?>">
                        <small>उदा. सिंहगड रोड, आनंद नगर, पुणे</small>
                    </div>
                    <div class="pooja-field">
                        <label for="pooja_location_details">संपूर्ण पत्ता (Full Address):</label>
                        <textarea id="pooja_location_details" name="location_details" rows="2"><?php echo esc_textarea($settings['location_details']); ?></textarea>
                    </div>
                </div>

                <!-- SECTION 4: मुख्य फोटो (Hero Banner Image) -->
                <div class="pooja-card">
                    <h2>🖼️ मुख्य बॅनर फोटो (Hero Banner Image)</h2>
                    <div class="pooja-field">
                        <label for="pooja_hero_image">इमेज URL किंवा मीडिया लायब्ररीतून निवडा:</label>
                        <div style="display:flex; gap: 10px;">
                            <input type="text" id="pooja_hero_image" name="hero_image" value="<?php echo esc_attr($settings['hero_image']); ?>" style="flex:1;">
                            <button type="button" class="button" id="pooja_upload_btn">फोटो निवडा (Upload)</button>
                        </div>
                        <img id="pooja_img_preview" class="pooja-img-preview" src="<?php echo esc_url($settings['hero_image']); ?>" alt="Preview">
                    </div>
                </div>

                <!-- SECTION 5: वैशिष्ट्ये (Highlights) -->
                <div class="pooja-card">
                    <h2>✨ वर्कशॉप वैशिष्ट्ये (Key Highlights)</h2>
                    <p style="font-size: 13px; color: #64748b; margin-bottom: 15px;">खालील ओळींमध्ये प्रत्येक वैशिष्ट्य टाईप करा (प्रत्येक ओळीवर १):</p>
                    <div class="pooja-field">
                        <textarea name="highlights_text" rows="6"><?php 
                            echo esc_textarea(implode("\n", $settings['highlights'])); 
                        ?></textarea>
                    </div>
                </div>

                <div style="margin-top: 20px; display: flex; align-items: center; justify-content: space-between;">
                    <button type="submit" class="button button-primary pooja-btn-primary">
                        💾 सर्व बदल सेव्ह करा (Save Changes)
                    </button>
                    <a href="<?php echo esc_url(rest_url('pooja/v1/workshop')); ?>" target="_blank" class="pooja-pill-link">
                        🔗 REST API JSON तपासा (/wp-json/pooja/v1/workshop)
                    </a>
                </div>
            </form>
        </div>

        <script>
        jQuery(document).ready(function($){
            $('#pooja_upload_btn').on('click', function(e) {
                e.preventDefault();
                var custom_uploader = wp.media({
                    title: 'मुख्य बॅनर फोटो निवडा',
                    button: { text: 'हा फोटो वापरा' },
                    multiple: false
                }).on('select', function() {
                    var attachment = custom_uploader.state().get('selection').first().toJSON();
                    $('#pooja_hero_image').val(attachment.url);
                    $('#pooja_img_preview').attr('src', attachment.url);
                }).open();
            });
        });
        </script>
        <?php
    }

    /**
     * Save Form Settings & Sync to WordPress 'workshop' Page
     */
    public function handle_save_settings() {
        if (!current_user_can('manage_options')) {
            wp_die('अनधिकृत विनंती.');
        }

        check_admin_referer('pooja_save_settings_nonce', '_pooja_nonce');

        $highlights_raw = isset($_POST['highlights_text']) ? sanitize_textarea_field($_POST['highlights_text']) : '';
        $highlights_array = array_filter(array_map('trim', explode("\n", $highlights_raw)));

        $new_settings = [
            'title'            => sanitize_text_field($_POST['title'] ?? ''),
            'subtitle'         => sanitize_text_field($_POST['subtitle'] ?? ''),
            'instructor'       => sanitize_text_field($_POST['instructor'] ?? ''),
            'description'      => sanitize_textarea_field($_POST['description'] ?? ''),
            'date'             => sanitize_text_field($_POST['date'] ?? ''),
            'time'             => sanitize_text_field($_POST['time'] ?? ''),
            'location'         => sanitize_text_field($_POST['location'] ?? ''),
            'location_details' => sanitize_textarea_field($_POST['location_details'] ?? ''),
            'fees'             => absint($_POST['fees'] ?? 1500),
            'advance_fee'      => absint($_POST['advance_fee'] ?? 500),
            'seats_left'       => absint($_POST['seats_left'] ?? 6),
            'patterns_count'   => sanitize_text_field($_POST['patterns_count'] ?? '14-15 प्रकार'),
            'whatsapp_number'  => sanitize_text_field($_POST['whatsapp_number'] ?? '8446917187'),
            'whatsapp_message' => sanitize_textarea_field($_POST['whatsapp_message'] ?? ''),
            'hero_image'       => esc_url_raw($_POST['hero_image'] ?? ''),
            'highlights'       => !empty($highlights_array) ? array_values($highlights_array) : $this->get_default_settings()['highlights'],
        ];

        // Save in options table
        update_option($this->option_key, $new_settings);

        // Also ensure a WordPress Page with slug 'workshop' exists and is synced
        $this->sync_workshop_page($new_settings);

        wp_redirect(admin_url('admin.php?page=pooja-saree-draping&updated=true'));
        exit;
    }

    /**
     * Auto-sync to WordPress page with slug 'workshop' for standard REST endpoint
     */
    private function sync_workshop_page($settings) {
        $page = get_page_by_path('workshop');
        $post_data = [
            'post_title'   => $settings['title'],
            'post_name'    => 'workshop',
            'post_content' => $settings['description'],
            'post_status'  => 'publish',
            'post_type'    => 'page',
        ];

        if ($page) {
            $post_data['ID'] = $page->ID;
            $post_id = wp_update_post($post_data);
        } else {
            $post_id = wp_insert_post($post_data);
        }

        if (!is_wp_error($post_id)) {
            // Save as post meta so /wp-json/wp/v2/pages?slug=workshop exposes it
            update_post_meta($post_id, 'subtitle', $settings['subtitle']);
            update_post_meta($post_id, 'instructor', $settings['instructor']);
            update_post_meta($post_id, 'workshop_date', $settings['date']);
            update_post_meta($post_id, 'workshop_time', $settings['time']);
            update_post_meta($post_id, 'location', $settings['location']);
            update_post_meta($post_id, 'location_details', $settings['location_details']);
            update_post_meta($post_id, 'fees', $settings['fees']);
            update_post_meta($post_id, 'advance_fee', $settings['advance_fee']);
            update_post_meta($post_id, 'seats_left', $settings['seats_left']);
            update_post_meta($post_id, 'patterns_count', $settings['patterns_count']);
            update_post_meta($post_id, 'whatsapp_number', $settings['whatsapp_number']);
            update_post_meta($post_id, 'whatsapp_message', $settings['whatsapp_message']);
            update_post_meta($post_id, 'hero_image', $settings['hero_image']);
            update_post_meta($post_id, 'highlights', $settings['highlights']);
        }
    }

    /**
     * Register Custom Post Type for Saree Draping Styles
     */
    public function register_saree_styles_cpt() {
        $labels = [
            'name'               => 'साडी प्रकार (Saree Styles)',
            'singular_name'      => 'साडी प्रकार',
            'menu_name'          => 'साडी प्रकार (Styles)',
            'add_new'            => 'नवीन साडी प्रकार जोडा',
            'add_new_item'       => 'नवीन साडी प्रकार जोडा',
            'edit_item'          => 'साडी प्रकार संपादित करा',
            'all_items'          => 'सर्व साडी प्रकार',
        ];

        $args = [
            'labels'             => $labels,
            'public'             => true,
            'publicly_queryable' => true,
            'show_ui'            => true,
            'show_in_menu'       => true,
            'query_var'          => true,
            'rewrite'            => ['slug' => 'saree-styles'],
            'capability_type'    => 'post',
            'has_archive'        => true,
            'hierarchical'       => false,
            'menu_position'      => 26,
            'menu_icon'          => 'dashicons-tag',
            'supports'           => ['title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'],
            'show_in_rest'       => true, // Expose to /wp-json/wp/v2/saree_styles
            'rest_base'          => 'saree_styles',
        ];

        register_post_type('saree_style', $args);

        // Register Category for Saree Styles
        register_taxonomy('style_category', ['saree_style'], [
            'hierarchical'      => true,
            'labels'            => [
                'name'          => 'वर्गवारी (Categories)',
                'singular_name' => 'वर्गवारी',
            ],
            'show_ui'           => true,
            'show_admin_column' => true,
            'show_in_rest'      => true,
        ]);
    }

    /**
     * Register meta fields for REST API
     */
    public function register_workshop_meta() {
        $fields = [
            'subtitle', 'instructor', 'workshop_date', 'workshop_time',
            'location', 'location_details', 'fees', 'advance_fee',
            'seats_left', 'patterns_count', 'whatsapp_number',
            'whatsapp_message', 'hero_image', 'highlights'
        ];

        foreach ($fields as $field) {
            register_post_meta('page', $field, [
                'show_in_rest' => true,
                'single'       => true,
                'type'         => ($field === 'fees' || $field === 'advance_fee' || $field === 'seats_left') ? 'integer' : 'string',
            ]);
        }
    }

    /**
     * Enable Cross-Origin Resource Sharing (CORS) for Headless Frontend
     */
    public function enable_cors_headers() {
        remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
        add_filter('rest_pre_serve_request', function($value) {
            header('Access-Control-Allow-Origin: *');
            header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Allow-Headers: Authorization, X-WP-Nonce, Content-Type, Accept');
            return $value;
        });
    }

    /**
     * Register Dedicated REST API Endpoints
     */
    public function register_rest_routes() {
        register_rest_route('pooja/v1', '/workshop', [
            'methods'             => 'GET',
            'callback'            => [$this, 'get_rest_workshop_data'],
            'permission_callback' => '__return_true',
        ]);
    }

    /**
     * REST Callback: /wp-json/pooja/v1/workshop
     */
    public function get_rest_workshop_data() {
        $settings = $this->get_settings();
        return rest_ensure_response([
            'status'  => 'success',
            'data'    => $settings,
            'updated' => current_time('mysql'),
        ]);
    }
}

// Initialize the plugin
new PoojaSareeDrapingCMS();
