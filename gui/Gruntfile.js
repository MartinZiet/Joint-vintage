module.exports = function(grunt) {

  //Initializing the configuration object
    grunt.initConfig({
    	
	copy: {
		fonts: {
			files: [
				{
					expand: true,
					flatten: true,
					src: [
						'./bower_components/fontawesome/fonts/*.*',
						'./bower_components/bootstrap/fonts/*.*'
					],
					dest: './public/fonts/'
				}
			]
		},
		images: {
			files: [
				{
					expand: true,
					flatten: true,
					src: [
						'./bower_components/jquery-prettyPhoto/images/prettyPhoto/default/*.*'
					],
					dest: './public/images/prettyPhoto/default/'
				}
			]
		}
	},
	
	less: {
		joint: {
			files: {
				"./public/css/app.css": "./assets/less/style.less"
			}
		}
	},
    	
	concat: {
		js_3rdparty: {
			src: [
				'./bower_components/jquery/dist/jquery.min.js',
				'./bower_components/bootstrap/dist/js/bootstrap.min.js',
				'./bower_components/lodash/lodash.min.js',
				'./bower_components/angular/angular.min.js',
				'./bower_components/angular-ui-bootstrap-bower/ui-bootstrap-tpls.min.js',
				'./bower_components/angular-ui-router/release/angular-ui-router.min.js',
				'./bower_components/angular-ui-select/dist/select.min.js',
				'./bower_components/angular-google-maps/dist/angular-google-maps.min.js',
				'./bower_components/restangular/dist/restangular.min.js',
				'./bower_components/bootbox/bootbox.js',
				'./bower_components/ngBootbox/ngBootbox.js',
				'./bower_components/jquery-locationpicker-plugin/dist/locationpicker.jquery.min.js',
				'./bower_components/ng-contenteditable/dist/ng-contenteditable.min.js',
				'./bower_components/toastr/toastr.min.js',
				'./bower_components/angular-local-storage/dist/angular-local-storage.min.js',
				'./bower_components/angularjs-scroll-glue/src/scrollglue.js',
				'./bower_components/angular-bootstrap-simple-chat/src/scripts/index.js',
				'./bower_components/angular-youtube-mb/dist/angular-youtube-embed.min.js',
				'./bower_components/jquery-prettyPhoto/js/jquery.prettyPhoto.js',
                './assets/js/socket.io/socket.io.min.js',
                './assets/js/easyrtc/api/easyrtc.js'
			],
			dest: './public/js/3rdparty.js'
		},
		js_uploader: {
			src: [
				'./bower_components/jquery-file-upload/js/vendor/jquery.ui.widget.js',
				'./bower_components/buleimp-load-image/js/load-image.all.min.js',
				'./bower_components/blueimp-canvas-to-blob/js/canvas-to-blob.min.js',
				'./bower_components/jquery-file-upload/js/jquery.fileupload.js',
				'./bower_components/jquery-file-upload/js/jquery.fileupload-process.js',
				'./bower_components/jquery-file-upload/js/jquery.fileupload-image.js',
				'./bower_components/jquery-file-upload/js/jquery.fileupload-audio.js',
				'./bower_components/jquery-file-upload/js/jquery.fileupload-video.js',
				'./bower_components/jquery-file-upload/js/jquery.fileupload-validate.js',
				'./bower_components/jquery-file-upload/js/jquery.fileupload-angular.js'
			],
			dest: './public/js/upload.js'
		},
		js_app: {
			src: [
				'./app/*.js',
				'./app/shared/**/*.js',
				'./app/components/**/*.js'
			],
			dest: './public/js/app.js'
			
		},
		css_3rdparty: {
			src: [
				'./assets/styles/bootstrap.min.css',
				'./bower_components/fontawesome/css/font-awesome.min.css',
				'./bower_components/angular-ui-select/dist/select.min.css',
				'./bower_components/toastr/toastr.min.css',
				'./bower_components/angular-bootstrap-simple-chat/src/css/style.css',
				'./bower_components/angular-bootstrap-simple-chat/src/css/themes.css',
				'./bower_components/jquery-file-upload/css/jquery.fileupload.css',
				'./bower_components/jquery-file-upload/css/jquery.fileupload-ui.css',
				'./bower_components/jquery-prettyPhoto/css/prettyPhoto.css'
			],
			dest: './public/css/3rdparty.css'
		}
	},
	
	watch: {
		less: {
			files: [
				'./assets/less/*.less'
			],
			tasks: ['less']
		},
		js_app: {
			files: [
				'./app/*.js',
				'./app/shared/**/*.js',
				'./app/components/**/*.js'
			],
			tasks: ['concat:js_app']
		}
	}

    });

  // Plugin loading
  //grunt.loadNpmTasks('grunt-bower');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Task definition
  grunt.registerTask('default', ['watch']);
  grunt.registerTask('serve', ['copy','less','concat']);

};